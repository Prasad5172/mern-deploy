const dotenv = require("dotenv")
dotenv.config()
const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const googleClientScheme = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
        minlength:3
    },
    email:{
        type:String,
        required:true,
        unique:[true,"Email is already taken"],
        validator(value){
            if(!validator.isEmail(value)){
                throw new Error("Enter a valid Email")
            }
        }
    },
    email_verified:{
        type : Boolean,
        required : true,
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
},{timestamps:true})


// middleware
googleClientScheme.methods.generateAuthToken = async function() {
    console.log(process.env.REACT_APP_SECRET_KEY)
    try {
        const newToken = await jwt.sign({_id : this._id.toString()},process.env.REACT_APP_SECRET_KEY,{expiresIn:"7d"})
        this.tokens = this.tokens.concat({token:newToken})
        await this.save();
        return newToken;
    } catch (error) {
        console.log(error+" generateAuthToken")
    }
}
const RegisterGoogleUser = new mongoose.model("RegisterGoogleUser",googleClientScheme)

module.exports = RegisterGoogleUser;