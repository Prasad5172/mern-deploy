const mongoose = require('mongoose')



const otpSchema = new mongoose.Schema({
    
    email:{
        type:String,
        required:true,
        unique:false
    },
    otp:{
        type:String,
        required:true,
        unique:false
    },
    createdAt:{type:Date,default:Date.now,index:{expires:300}}
},{timestamps:true})


// middleware

const Otp = new mongoose.model("Otp",otpSchema)

module.exports = Otp;