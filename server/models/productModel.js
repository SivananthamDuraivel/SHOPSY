const mongoose = require('mongoose')

const productSchema= new mongoose.Schema({
    picture: { type: String, default:"https://th.bing.com/th/id/OIP.VaAm27aY4J6YQlhkbpGjMAHaHe?w=193&h=195&c=7&r=0&o=5&dpr=1.5&pid=1.7"},
    name:{type:String},
    price:{type:Number},
    available:{type:String,default:"available"},
    availableUnit:{type:Number,default:100},
    rating:{type:Number},
    category:{type:String},
})

module.exports=mongoose.model("productModel",productSchema)