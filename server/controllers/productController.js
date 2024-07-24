const productModel = require('../models/productModel')
const userModel = require('../models/userModel')

const loadProducts = async(req,res)=>{
    console.log("entered loadProducts")
    const {price, rating, category } = req.body;
    console.log(price+"::"+rating+"::"+category)

    let filters = {};
    if (price && price>0 ) filters.price = { $lte: price };
    if (rating && rating>0 && rating<6) filters.rating = { $gte: rating };
    if (category && category.length>0) filters.category = category;

    const products = await productModel.find(filters);
    res.json(products);
}

const addProduct = async(req,res)=>{
    try{
        //console.log(req.user.role)
        if(req.user.role!=="admin")
            return res.json("you are not an admin")

        const {picture,name,price,available,availableUnit,rating,category}=req.body
        if(picture && picture.length>0)
            await productModel.create({picture,name,price,available,availableUnit,rating,category})
        else
            await productModel.create({name, price, available, availableUnit, rating, category})
        return res.json("added")
    }catch(err)
    {
        console.log("add error : ",err)
    }
}

const editProduct = async (req, res) => {
    try {
        if (req.user.role !== "admin")
            return res.json("You are not an admin");

        const { id, picture, name, price, available, availableUnit, rating, category } = req.body;

        const product = await productModel.findById(id);
        if (!product)
            return res.json("No such product");

        const updateData = { name, price, available, availableUnit, rating, category };
        if (picture && picture.length > 0) {
            updateData.picture = picture;
        }

        await productModel.findByIdAndUpdate(id, updateData, { new: true });
        return res.json("edited");
    } catch (err) {
        console.log("Edit error: ", err);
        return res.status(500).json("An error occurred while editing the product");
    }
};

const addToCart = async (req, res) => {
    try {
        const { productId, quantity, availableUnit } = req.body;
        console.log(productId + "::" + quantity + "::" + availableUnit + "::" + req.user._id);
        const newQuantity = availableUnit - quantity;

        const product = await productModel.findById(productId);
        if (!product) return res.json("no such products exists");

        console.log("PRODUCT: ", product);
        product.availableUnit = newQuantity;
        await product.save();
        console.log("product updated");

        const user = await userModel.findById(req.user._id);
        if (!user) return res.json("user not logged in");

        const oldCartValue = user.cartValue;
        const newCartValue = oldCartValue + (quantity * product.price);

        const existingCartProduct = user.cart.find((item) => item.pId.toString() === productId.toString());
        if (existingCartProduct) {
            existingCartProduct.quantity += Number(quantity);
        } else {
            const addProduct = {
                picture: product.picture,
                name: product.name,
                price: product.price,
                quantity: Number(quantity),
                rating: product.rating,
                category: product.category,
                pId: product._id
            };
            user.cart = [...user.cart, addProduct];
        }

        user.cartValue = newCartValue;
        await user.save();
        console.log("cart updated");
        return res.json("updated");
    } catch (err) {
        console.log(err);
        return res.json("it's us not you :( ");
    }
};


const removeFromCart = async (req, res) => {
    try {
        const { productId, removeQuantity, pId } = req.body;
        console.log()
        console.log(productId + "::" + removeQuantity + "::" + pId + "::" + req.user._id);

        const product = await productModel.findById(pId);
        if (!product)
            return res.json("no such products exists");

        console.log("PRODUCT: ", product);
        product.availableUnit += Number(removeQuantity);
        await product.save();
        console.log("product updated");

        const user = await userModel.findById(req.user._id);
        if (!user)
            return res.json("user not logged in");

        const oldCartValue = user.cartValue;
        const newCartValue = oldCartValue - (removeQuantity * product.price);

        const removeProduct = user.cart.find(item => item._id.toString() === productId);
        if (!removeProduct)
            return res.status(404).json("Product not found in cart");

        console.log()
        console.log(removeProduct.quantity + "::" + removeQuantity + "::" + productId);
        if (Number(removeProduct.quantity) === Number(removeQuantity)) {
            console.log("entered if")
            user.cart = user.cart.filter(item => item._id.toString() !== productId);
        } else {
            removeProduct.quantity -= Number(removeQuantity);
        }

        user.cartValue = newCartValue;
        await user.save();
        console.log("cart updated");

        return res.json("updated");
    } catch (err) {
        console.log(err);
        return res.status(500).json("it's us not you :( ");
    }
}




const myCart=async(req,res)=>{
    try{
        const user = await userModel.findById(req.user._id)
        if(!user)
            return res.json("user not logged in")
        return res.json({cartValue:user.cartValue,cart:user.cart})
    }catch(err)
    {
        console.log(err)
    }
}

module.exports={loadProducts,addProduct,addToCart,myCart,removeFromCart,editProduct}