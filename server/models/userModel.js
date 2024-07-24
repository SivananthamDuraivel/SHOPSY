const mongoose= require('mongoose')

const userSchema = new mongoose.Schema({
    name:{type:String},
    email:{type:String},
    password:{type:String},
    role:{type:String,default:"user"},
    profile: { type: String, default:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"},
    cartValue: { type: Number, default: 0 },

    cart: [{
        picture: { type: String },
        name: { type: String },
        price: { type: Number },
        quantity: { type: Number },
        rating: { type: Number },
        category: { type: String },
        pId: { type: mongoose.Schema.Types.ObjectId, ref: 'productModel' },
    }],

},{timestamps:true})

module.exports=mongoose.model("userModel",userSchema)