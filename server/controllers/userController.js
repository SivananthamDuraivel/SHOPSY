const userModel = require('../models/userModel')
const jwt=require('jsonwebtoken')
const bcrypt = require('bcrypt')

const signUp=async(req,res)=>{
    console.log("signup auth")
    try{
        const {name,email,password,profile}=req.body
        
        const existingUser=await userModel.find({name:name})
        console.log(existingUser)
        if(existingUser && existingUser.length>0)
            return res.json("username exists")

        const hashedPassword= await bcrypt.hash(password,10)
        if(profile && profile.length>0)
            await userModel.create({name:name,email:email,password:hashedPassword,profile:profile})
        else    
            await userModel.create({ name: name, email: email, password: hashedPassword})
        return res.json("added")
    }   
    catch(err){
        console.log("sign up error : ",err)
    } 
}

const signIn = async(req,res)=>{
    try{
        const {email,password}=req.body
        const user=await userModel.findOne({email:email})
        if(!user)
            return res.json("not such user exists")

        const matchPassword=await bcrypt.compare(password,user.password)
        
        if(!matchPassword)
            return res.json("invalid password")
        else
        {
            const token=await jwt.sign({id:user._id},process.env.SECRET_KEY,{expiresIn:'2h'})
            console.log("signin : ",token)
            res.cookie("myToken",token,{httpOnly:true})
            if(user.role==="admin")
                return res.json("admin")
            return res.json("valid")
        }
    }
    catch(err)
    {
        console.log("singin error : ",err)
    }
}

module.exports={signUp,signIn}

