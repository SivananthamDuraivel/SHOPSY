const jwt = require('jsonwebtoken')
const userModel=require('./models/userModel')

const withAuth = async(req,res,next)=>{
    try{
        const token = req.cookies.myToken
        console.log("midd: ",token)
        if(!token)
            return res.json("")
        const decoded= await jwt.verify(token,process.env.SECRET_KEY)
        const user= await userModel.findById(decoded.id)
        //console.log(decoded.id +" ::::"+user)
        req.user=user 
        next() 
    }
    catch(err){
        console.log("midd catch : ",err)
        return
    }
}

module.exports={withAuth}