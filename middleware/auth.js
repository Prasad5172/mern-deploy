const jwt = require("jsonwebtoken")
const Register = require("../models/struct")

const auth = async (req,res,next) => {
    try {
        const token = req.body.token;
        // console.log(token)
        const verifyToken = jwt.verify(token,process.env.REACT_APP_SECRET_KEY)
        // console.log(verifyToken)
        const user = await Register.findOne({_id : verifyToken._id})
        // console.log(user);
        req.user=user;
        // console.log("i am in auth")
        next();
    } catch (error) {
        console.log("signin first");
    }
}
module.exports = auth;