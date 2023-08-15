require("dotenv").config({ path: '../.env' })
const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const clientScheme = new mongoose.Schema({
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
    password : {
        type : String ,
        required : true,
    },
    confirmpassword : {
        type : String,
        required : true,
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    library:[
        {
        playlistId:{
            type : String,
        }
    },
    
]
},{timestamps:true})

clientScheme.index({ "library.playlistId": 1 }, { unique: true });

clientScheme.pre("save",async function(next) {
    if(this.isModified("password")){
        const passWordHash = await bcrypt.hash(this.password,10);
        this.confirmpassword = passWordHash;
        this.password = passWordHash;
    }
    next();
})
// middleware
clientScheme.methods.generateAuthToken = async function() {
    try {
        const newToken = await jwt.sign({_id : this._id.toString()},process.env.REACT_APP_SECRET_KEY,{expiresIn:"7d"})
        this.tokens = this.tokens.concat({token:newToken})
        await this.save();
        return newToken;
    } catch (error) {
        console.log(error+" generateAuthToken")
    }
}
const Register = new mongoose.model("Register",clientScheme)

module.exports = Register;