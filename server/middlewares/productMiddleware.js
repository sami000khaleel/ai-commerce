const Product=require('../models/productModel')
const path=require('path')
const fs=require('fs')
const { promisify } = require('util');
const mkdir=promisify(fs.mkdir)
const writeFile=promisify(fs.writeFile)
const access=promisify(fs.access)
const unlink=promisify(fs.unlink)
const {throwError}=require('../errorHandler')
class productMiddleware{
   static makeConditions(category,max,min){
    let conditions={}
if(category)
  conditions.category=category
  if (max || min) {
    conditions.price = {};

    if (max) {
        conditions.price.$lt = max;
    }

    if (min) {
        conditions.price.$gt = min;
    }
}
return conditions
}
   
    static async deleteImages(product,imagesNames)
    {
        const allIncluded = imagesNames.every(imageName =>
            product.imagesNames.includes(imageName)
        );

        if (!allIncluded) 
           return throwError('the images you sent do not match with the products images',403)
               
         let dirName=path.join(__dirname,'..','uploads',product.id)
         for (const imageName of imagesNames) {
                const imagePath = path.join(dirName, imageName);
                await access(imagePath).catch(err=>throwError(`images ${imageName} was not found`,404))         // Check if the image exists
                await unlink(imagePath).catch((err)=>throwError(`could not delete image ${imageName}`,400 )) // Delete the image
    
                const index = product.imagesNames.indexOf(imageName);
                if (index !== -1) 
                    product.imagesNames.splice(index, 1); // Remove image name from product.imagesNames
                }
         return product
    }
    static async updateProduct(query,product){
        if (query.name) {
            product.name = query.name;
        }

        if (query.price) {
            product.price = query.price;
        }

        if (query.description) {
            product.description = query.description;
        }

        if (query.category) {
            product.category = query.category;
        }

        if (query.quantity) {
            product.quantity = query.quantity;
        }

        
        return product;
    }
    static async saveImages(imagespaths,images){
        if(imagespaths.length!==images.length)
                throwError('error handling images',400)
         imagespaths.forEach(async(path,i)=>{
            await fs.writeFile(path,images[i])    
            let buffer=path.split('/')
            const imageName=buffer[buffer.length-1]
            console.log('imageName',imageName)
            product.imagesNames.push(imageName)
            await product.save()
        })        
        return product
    }
    static genImageName(){
        return `${Date.now()}-${Math.floor(Math.random()*10000000)}` 
    }
    static async generateImagesPath(files,productId){
        const dirPath=path.join(__dirname,'..','uploads',productId)
        await mkdir(dirPath,{recursive:true})
        let imagespaths=[]
        files.forEach(async(file) => {
            const imageName=productMiddleware.genImageName()
            const imagePath=path.join(dirPath,imageName)
            imagespaths.push(imagePath)
        });
        return imagespaths
    }
    static async validateProduct_preInit(product) {
        try {
            // Check if all required fields are present
            const requiredFields = ['attributes', 'name', 'price', 'description', 'category', 'imagesUrls', 'quantity', 'createdAt'];
            for (const field of requiredFields) {
                if (!product.hasOwnProperty(field)) {
                    throwError(`Field '${field}' is missing.`,404);
                }
            }

            // Check data types and constraints
            if (!Array.isArray(product.attributes)) {
                throw new Error(`'attributes' must be an array.`);
            }
            if (typeof product.name !== 'string') {
                throw new Error(`'name' must be a string.`);
            }
            if (typeof product.price !== 'number' || isNaN(product.price) || product.price <= 0) {
                throw new Error(`'price' must be a positive number.`);
            }
            if (typeof product.description !== 'string') {
                throw new Error(`'description' must be a string.`);
            }
            if (typeof product.category !== 'string') {
                throw new Error(`'category' must be a string.`);
            }
            if (!Array.isArray(product.imagesUrls) || product.imagesUrls.some(url => typeof url !== 'string')) {
                throw new Error(`'imagesUrls' must be an array of strings.`);
            }
            if (typeof product.quantity !== 'number' || isNaN(product.quantity) || product.quantity < 0) {
                throw new Error(`'quantity' must be a non-negative number.`);
            }
            if (!(product.createdAt instanceof Date && !isNaN(product.createdAt))) {
                throw new Error(`'createdAt' must be a valid Date object.`);
            }

            // Additional custom validations can be added here

            // If all validations pass, return true
            return true;
        } catch (error) {
            // If any validation fails, throw an error
            let err= new Error(`Validation Error: ${error.message}`);
            err.userError=true
            err.status=403
            throw err
        }
    }
}
module.exports=productMiddleware