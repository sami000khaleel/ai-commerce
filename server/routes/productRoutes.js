const productController=require('../controllers/productController')
const express=require('express')
const router=express.Router()
router.post('/',productController.createProduct)
// to be continued
router.get('/:productId',productController.getProduct)
router.get('/',productController.getProducts)
router.get('/images',productController.getImage)
router.patch('/',productController.updateProduct)
module.exports=router