const productController=require('../controllers/productController')
const express=require('express')
const router=express.Router()
router.post('/',productController.createProduct)
// to be continued
router.get('/get-image',productController.getImage)
router.get('/get-random-products',productController.getRandomProducts)
router.get('/',productController.getProducts)
router.get('/:productId',productController.getProduct)
router.patch('/',productController.updateProduct)
router.delete('/',productController.deleteProduct)
router.post('/search-by-image',productController.searchByImage)
module.exports=router