const Product=require('../models/productModel')
const productMiddleware=require('../middlewares/productMiddleware')
const User=require('../models/userModel')
const fs=require('fs')
const formData = require('form-data');
const multer = require('multer');
const billMiddlware=require('../middlewares/billMiddleware')
const authentication = require('../middlewares/authentication')
const userMiddleware = require('../middlewares/userMiddleware')
const {handleError, throwError}=require('../errorHandler')
const {promisify}=require('util')
const access=promisify(fs.access,fs.writeFile)
const path=require('path')
class productController{
    static async searchByImage(req,res){
        try
        {
            

//             let data = '';

//   req.on('data', chunk => {
//     data += chunk;
//   });

//   req.on('end', async() => {
//     // Parse the multipart form data
//     const boundary = req.headers['content-type'].split('boundary=')[1];
//     const parts = data.split(`--${boundary}`);

//     // Iterate over each part of the form data
//     for (let i = 0; i < parts.length - 1; i++) {
//       // Extract the filename if present
//       const filenameMatch = parts[i].match(/filename="(.+?)"/);
//       const filename = filenameMatch ? filenameMatch[1] : 'No filename provided';

//       // Extract the content of the part
//       const contentMatch = parts[i].match(/\r\n\r\n([\s\S]*)$/);
//       const content = contentMatch ? contentMatch[1] : '';
      
//       // Save the content to a file
//       if (filename !== 'No filename provided' && content) {
//         const filePath = path.join(uploadsDir, filename);
//        await fs.writeFile(filePath, content);
//         console.log(`File saved: ${filePath}`);
//       }
//     }

//   });
const { userId } = await authentication.validateToken(req.headers['token']);
const uploadDir = path.join(__dirname, '..','uploads');

// Check if the uploads directory exists, create it if it doesn't
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename files to avoid collisions
  }
});

const upload = multer({ storage }).single('file');

upload(req, res, async (err) => {
  if (err) {
    console.error('Error uploading file:', err);
    return res.status(500).send('Internal Server Error');
  }

  // File is uploaded, you can access it via req.file
  const filePath = req.file.path;
  console.log('File saved at:', filePath);
  let similarities=await productMiddleware.sendFile(filePath)
  // Respond with a success message
  console.log(similarities)
    similarities=productMiddleware.extractImagesNames(similarities)
  const results=await productMiddleware.matchProductsByImages(similarities)
  console.log('done')
  return res.json(results); // Assuming places is defined elsewhere in your code
});
        }catch(err){
            console.log(err)
            handleError(err,res)
        }
    }
    static async buyProduct(req,res){
        try
        {
            const token=await authentication.validateToken(req.headers['token'])
            const user=await User.findById(token.userId)
            const sentProducts=req.body.products
            let products=[]
            for(let sentProduct of sentProducts)
                { 
                    let product=await Product.findById(sentProduct.productId)
                    await productMiddleware.checkForQuantity(product,sentProduct.quantities)
                    product=productMiddleware.subtractQuantities(product,sentProduct.quantities)
                    product.purchasedQuantities=sentProduct.quantities
                    products.push(product)    
                }
                user=userMiddleware.addPurchasedProducts(user,products) 
                let bill=await billMiddlware.createBill(products,user)
                bill.totalPrice=billMiddlware.calculateTotalPrice(bill,products)
                return res.json({success:true,bill})
            }
        catch(err){
            handleError(err,res)
        }
    }
    static async deleteProduct(req,res){
        try
        {
         const token=await authentication.validateToken(req.headers['token'])
         const user=await User.findById(token.userId)
         if(user.role!=='admin'||user.role!=='manager')
            throwError('you do not have authority lol',403) 
         if(!req.query?.productId)
                return res.status(400).json({success:false,message:"no id was provided"})
            const {productId}=req.query
            const product=await Product.findById(productId)
            if(!product)
                return throwError('no product was found',404)
            product.quantity=0
            await product.save()
            return res.json({success:true})
        }
        catch(err){
            handleError(err,res)
        }
    }
    static async getImage(req,res){
        try
        {
            if(!req.query?.imageName||!req.query?.productId)
                return throwError('missing parameters',400)
            const{imageName,productId}=req.query
            const imagePath = path.join(__dirname, '..', 'data', productId, imageName);
            await access(imagePath).catch(err=>throwError(`image was found`,404))
            return res.sendFile(imagePath)

        }
        catch(err){
            handleError(err,res)
        }
    }
    static async getProducts(req,res){
        try
        {
            const conditions=productMiddleware.makeConditions(req.query?.category,req.query?.max,req.query?.min)
            const products=await Product.find({$or:[conditions,{}]}).sort({date:-1}).limit(10)
            if(!products.length)
              return  throwError('no products were found ',404)
            return res.json({success:true,products})
        }
        catch(err){
            handleError(err,res)
        }
    }
    static async getProduct(req,res){
        try{
            const token=await authentication.validateToken(req.headers['token'])
            const {productId}=req.params
            if(!productId)
                   throwError('no product Id was provided',404)
            const product=await Product.findById(productId)
            if(!product)
                throwError('no prduct was found',404)
            return res.status(200).json({success:true,product})    
        }catch(err){
            handleError(err,res)
        }
    }
static async updateProduct(req,res){
   try{ 
    const token=await authentication.validateToken(req.headers['token'])
    
    const user=await User.findById(token.userId)
    if(!user)   
        throwError('no user was found !',404)
    if(user.role!=='admin'||user.role!=='manager')
        throwError('you do not have authority lol',403)
    const product=await Product.findById(req.body.productId)
    product = await productMiddleware.updateProduct(req.query,product)
   if(req.query.deleteImages.length)
       product=await productMiddleware.deleteImages(product)
    await product.save()
    if(!req.query.addImages.length)
        return res.status(201).json({success:true,product})
    const imagespaths=await productMiddleware.generateImagesPath(req.files,productId)
    product=await productMiddleware.saveImages(imagespaths,req.files)
    await product.save()
    return res.status(201).json({success:true,product})
}catch(err){
    handleError(err,res)
}
}    
static async createProduct(req,res){
    try{
        const {userId}= await authentication.validateToken(req.headers['token'])
        const user=await userMiddleware.findUserById(userId)
        if(user.role!=='admin'||user.role!=='manager')
            throwError('you do not have authority lol',403)
        let product=req.body
        product.publisherId=userId
        if(!req.files.length)
            throwError('you must add images',403)
        await productMiddleware.validateProduct_preInit(product)
        // do some stuff on it later to be added
        product=await Product.create(product)
        user=await userMiddleware.addPublishedProduct(user,product.id)
        const images=[]
        const imagespaths=await productMiddleware.generateImagesPath(req.files,product.id)
        product= await productMiddleware.saveImages(imagespaths,req.files,product)        
        
        return res.json({success:true,product})
    }catch(err){
        handleError(err,res)
    }
}

}
module.exports=productController