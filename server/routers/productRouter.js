const express = require('express')
const router=express.Router()

const { loadProducts, addProduct,addToCart,myCart,removeFromCart,editProduct }=require('../controllers/productController')
const { withAuth } = require('../middleware')

router.post('/',withAuth,loadProducts)
router.post('/addProduct',withAuth,addProduct)
router.post('/addToCart',withAuth,addToCart)
router.post('/myCart',withAuth,myCart)
router.post('/removeFromCart',withAuth,removeFromCart)
router.put('/editProduct',withAuth,editProduct)

module.exports=router