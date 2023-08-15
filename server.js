const dotenv = require("dotenv")
dotenv.config()
const express = require('express');
const cors = require('cors')
const PORT = process.env.REACT_APP_PORT || 8000;
const app = express();
const bcrypt = require("bcryptjs");
const auth = require("./middleware/auth")
require("./db/conn")
const Register = require("./models/struct")
const RegisterGoogleUser = require("./models/googlestruct")
const jwt = require("jsonwebtoken")
const { OAuth2Client } = require("google-auth-library");
const createError = require('http-errors');
var nodemailer = require("nodemailer")
const Otp = require("./models/otpStruct")
const otpGenerator = require("otp-generator")
const path = require("path")



app.use(cors());

app.use(express.static(path.join(__dirname, "./client/build")));
app.get("*", function (_, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"),
    function (err) {
      res.status(500).send(err);
    }
  );
});

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const oauth2Client = new OAuth2Client(
    `${process.env.REACT_APP_CLIENT_ID}`,
    `${process.env.REACT_APP_CLIENT_SECRETE_ID}`)



async function verify(req, res, next) {
    console.log("verify")
    console.log(process.env.REACT_APP_CLIENT_SECRETE_ID)
    console.log(process.env.REACT_APP_CLIENT_ID)
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        next(createError.Unauthorized());
        return;
    }
    const token = authHeader.split(" ")[1];
    try {
        const ticket = await oauth2Client.verifyIdToken({
            idToken: token,
            audience: `${process.env.REACT_APP_CLIENT_ID}`,
        });
        const payload = ticket.getPayload();
        if (payload) {
            req.userId = payload.sub;
            next();
            return;
        }
        next(createError.Unauthorized());
    } catch (error) {
        next(createError.Unauthorized());
    }
}

app.get("/protected", verify, (req, res, next) => {
    console.log("protected")
    res.status(200).send("awesome it works for protected route");
})

app.get((req, res, next) => {
    next(createError.NotFound())
})
app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send({
        status: err.status || 500,
        message: err.message
    })
})

app.post("/logout", auth, async (req, res) => {
    try {
        const token = req.body.token;
        // console.log(req.user);
        req.user.tokens = req.user.tokens.filter(ele => ele.token != token);
        await req.user.save();
        res.status(200).json("logut succesful")
    } catch (error) {
        console.log(error)
    }
})

app.post("/checkuser", async (req, res) => {
    const token = req.body.token;
    console.log(token);
    try {
        const verifyToken = jwt.verify(token, process.env.REACT_APP_SECRET_KEY);
        const user = await Register.findOne({ _id: verifyToken._id });
        if (user == null) {
            console.log("notregistred")
            return res.status(400).json("notsuccessful");
        } else {
            console.log("registred")
            return res.status(200).json("successful");
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json("error");
    }
});
app.post("/checkEmail", async (req, res) => {
    const email = req.body.email;
    console.log(email);
    try {
        const user = await Register.findOne({ email: email });
        if (user == null) {
            console.log("notregistred")
            return res.status(400).json("notsuccessful");
        } else {
            console.log("registred")
            return res.status(200).json("successful");
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
});
app.post("/Signin", async (req, res) => {
    console.log(req.body);
    try {
        const email = req.body.email;
        const password = req.body.password;

        const user = await Register.findOne({ "email": email });
        // console.log(user);
        if(user == null){
            return res.status(400).json("signup");
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (isMatch) {
            const token = await user.generateAuthToken();
            console.log("Login Succesful")
            return res.status(200).send({ "token": token, "name": user.firstname, "email": user.email })
        } else {
            console.log("password not match")
            return res.status(400).json("failed")
        }
    } catch (error) {
        console.log(error + "insignin");
        res.status(400).json(error);
    }
})
app.post("/resetpassword",async (req,res) =>{
    console.log(req.body);
    // return res.status(200).json("resetpassword");
    try {
        const {email,password} = req.body
        const updatedPasswordHash = await bcrypt.hash(req.body.password,10);
        const user = await Register.findOneAndUpdate({email:req.body.email},{password:updatedPasswordHash,confirmpassword:updatedPasswordHash}) 

        // console.log(user);
        const result = await user.save();
        return res.status(200).json("succesful");

    } catch (error) {
        console.log(error);
        res.status(400).json("failedtoupdate");
    }
})

app.post("/verifyOtp", async (req, res) => {
    console.log("i am in verify otp in server file")
    try {
        const otpHolder = await Otp.find({
            email: req.body.email,
        })
        console.log(otpHolder)
        if (otpHolder.length == 0) { return res.status(400).json("expired") }
        const rightOtp = otpHolder[0];
        console.log(rightOtp)
        const validUser = await bcrypt.compare(req.body.otp, rightOtp.otp);
        console.log(validUser)
        if (rightOtp.email == req.body.email && validUser && !req.body.firstname) {
            await Otp.findOneAndDelete({
                email: req.body.email
            })
            return res.status(200).json("verifiedotp")
        }
        else if(rightOtp.email == req.body.email && validUser){
            await Otp.findOneAndDelete({
                email: req.body.email
            })
            const registerEmployee = new Register({
                firstname: req.body.firstname,
                email: req.body.email,
                password: req.body.password,
                confirmpassword: req.body.confirmpassword,
            })
            const token = await registerEmployee.generateAuthToken();
            const user = await registerEmployee.save();
            console.log("registred succesfully")
            return res.status(200).json("succesful")
        } else {
            console.log("otp is wrong")
            return res.status(400).json("wrongOtp");
        }
        return res.status(400).json("testing")
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
})
app.post("/addtolibrary",async (req,res) => {
    try {
        const email = req.body.email;
        const user = await Register.findOne({ "email" : email});
        user.library = user.library.concat({"playlistId" : req.body.playlistId});
        await user.save();
        return res.status(200).json("added")
    } catch (error) {
        console.log(error)
        return res.status(400).json("already added")
    }
})
app.post("/sendEmail", async (req, res) => {
    const userEmail = req.body.email;
    const OTP = otpGenerator.generate(6, {
        digits: true,
        specialChars: false,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        alphabets: false,
    });
    console.log(OTP)
    const salt = await bcrypt.genSalt(10);
    const hashedOTP = await bcrypt.hash(OTP, salt);
    await Otp.deleteMany({ "email": userEmail })

    const newotp = new Otp({ email: userEmail, otp: hashedOTP });
    const savedOTP = await newotp.save();

    var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: `${process.env.REACT_APP_USER}`,
            pass: `${process.env.REACT_APP_PASSWORD}`
        }
    });
    var mailOptions = {
        from: `${process.env.REACT_APP_USER}`,
        to: userEmail,
        subject: `Email Verification code: ${OTP}`,
        text: ` Verify OTP:${OTP}`
    }
    transporter.sendMail(mailOptions, function (error, info){
        if (error) {
            console.log(error)
            return res.status(400).json("failed to send")
        } else {
            console.log("Email sent:" + info.response)
            return res.status(200).json("otpsend")
        }
    })

})

app.post("/Signup", async (req, res) => {
    const user = await Register.findOne({ "email": req.body.email });
    if (user != null) {
        console.log("notValidMail")
        return res.status(400).json("notValidMail")
    }
    try {
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;
        if (password == cpassword) {
            const registerEmployee = new Register({
                firstname: req.body.firstname,
                email: req.body.email,
                password: req.body.password,
                confirmpassword: req.body.confirmpassword,
            })
            console.log("sending email")
            const sendEmail = await fetch("https://ill-shawl-lamb.cyclic.cloud/sendEmail", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ "email": req.body.email }),
            })
            if (sendEmail.ok) {
                
                console.log("email send succesful" )
                return res.status(200).json("otpsend");
            } else {
                console.log("email not send")
                return res.status(400).json("failedotp");
            }
        } else {
            console.log("password does not match")
            return res.status(400).json("password");
        }
    } catch (error) {
        console.log(error + "   signup");
        res.status(400).json("error" + error)
    }
})

app.post("/googleSignup", async (req, res) => {
    console.log(req.body)
    const user = await RegisterGoogleUser.findOne({ "email": req.body.email });
    if (user != null) {
        console.log("registredAlready")
        return res.status(400).json("notValidMail")
    }
    try {
        const email_verified = req.body.email_verified
        if (email_verified) {
            const newGoogleUser = new RegisterGoogleUser({
                firstname: req.body.given_name,
                email: req.body.email,
                email_verified: email_verified,
            })
            const token = await newGoogleUser.generateAuthToken();
            const user = await newGoogleUser.save();
            console.log("succesful")
            return res.status(200).json("succesful");
        } else {
            console.log("email is notverified");
            return res.status(400).json("emailNotVerified")
        }
    } catch (error) {
        console.log(error + "   signup");
        res.status(400).json("error" + error)
    }
})
app.post("/googleSignin", async (req, res) => {
    try {
        const email = req.body.email;
        // console.log(email)
        const user = await RegisterGoogleUser.findOne({ "email": req.body.email });
        const email_verified = req.body.email_verified;
        if (user != null && email_verified) {
            console.log("Login succesful")
            return res.status(200).json("succesful")
        } else {
            console.log("signup")
            return res.status(400).json("signup");
        }
    } catch (error) {
        console.log(error + "insignin");
        res.status(400).json(error);
    }
})


app.listen(PORT, () => {
    console.log(`server is running at the port no ${PORT}`)
})