const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require("mongoose");
const Product = require('./models/productModel'); // Assuming your product model is in this path
const path = require('path');
// mongoose.connect('mongodb://127.0.0.1:27017/ai-commerce', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }).then(() => {
//   console.log("Connected to MongoDB");
//   // createProducts();
//   createCsv()
// }).catch(err => {
//   console.error("Error connecting to MongoDB:", err);
// });

// // CSV file path
const filePath = '../dataset/images.csv';
function getHeaders(){

  // Create a readable stream to read the CSV file
  const readableStream = fs.createReadStream(filePath);

  // Pipe the readable stream to csv-parser to parse the CSV file
readableStream.pipe(csv())
  .on('headers', (headers) => {
    console.log('CSV file headers:', headers);
  })
  .on('error', (error) => {
    console.error('Error reading CSV file:', error);
  });
}
// getHeaders()
function getLabels()
{// Array to store label values
  const labels = [];
  
  // Create a readable stream to read the CSV file
  const readableStream = fs.createReadStream(filePath);
  
  // Pipe the readable stream to csv-parser to parse the CSV file
readableStream.pipe(csv())
  .on('data', (row) => {
    // Extract the value of the 'label' column from the row
    const labelValue = row['label'];
    // Push the label value to the labels array
    labels.push(labelValue);
  })
  .on('end', () => {
    // Log the unique label values to the console
    const uniqueLabels = [...new Set(labels)]; // Get unique label values
    console.log('Unique label values:', uniqueLabels);
  })
  .on('error', (error) => {
    console.error('Error reading CSV file:', error);
  });}
  // getLabels()
  
  async function createProducts() {
    try {
      // Read the CSV file
      const products = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          // Check if the image file exists
          const imagePath = `../dataset/images/${row.image}.jpg`; // Assuming the images have '.jpg' extension
          if (fs.existsSync(imagePath) && row.label !== 'Not sure') {
            // Construct product object
            const product = {
              publisherId: "65e2d13883fc262e382a169f",
              reviews: [],
              name: row.label,
              price: Math.floor(Math.random() * 96) + 5, // Random price between 5 and 100
              description: "",
              category: row.label,
              imagesNames: [row.image],
              quantities: generateRandomQuantities(),
              createdAt: Date.now()
            };
            products.push(product);
          } else {
            console.log(`Skipping product "${row.label}" because image doesn't exist or label is "Not sure"`);
          }
        })
        .on('end', async () => {
          console.log(products[0])
          // Save products to MongoDB
          const savedProducts = await Product.insertMany(products);
          console.log("Products saved to MongoDB:", savedProducts);
          
          // Create folders and save images
          savedProducts.forEach(product => {
            const productId = product._id.toString();
            const folderPath = `data/${productId}`;
            fs.mkdirSync(folderPath);
            fs.copyFileSync(`../dataset/images/${product.imagesNames[0]}.jpg`, `${folderPath}/${product.imagesNames[0]}.jpg`);
            console.log(`Image for product ${product.name} saved to ${folderPath}`);
          });
        });
    } catch (error) {
      console.error('Error:', error);
    }
  }

// Function to generate random quantities
function generateRandomQuantities() {
  const sizes = ["XS", "S", "L", "XL", "XXL", "XXXL"];
  return sizes.map(size => ({
    size,
    quantity: Math.floor(Math.random() * 21) // Random quantity between 0 and 20
  }));
}
async function createCsv(){
  let products=await Product.find()
  let csvFile=[]
  for (let product of products){
    csvFile.push({label:product.category,path:path.join('./','data',product.id,product.imagesNames[0])})
  }
  console.log(console.log(csvFile[6]))
    // Prepare CSV content
    let csvContent = 'label,path\n';
    csvFile.forEach(row => {
      csvContent += `${row.label},${row.path}\n`;
    });

    // Define CSV file path
    const csvFilePath = './product_paths.csv';

    // Write CSV file
    fs.writeFileSync(csvFilePath, csvContent);

    // console.log('CSV file created:', csvFilePath);
  
  }

// Call the function to create products
function acheck(){
  let x=true
  let y=true
  let z=false
  let u=true
  let w=true
  expression=((x|| !y)&&(y||z)&&(!z)&&(!x||!y||u)&&(!x||!y||u)&&(!x||!y||!u||w))
  console.log(expression)

}
acheck()