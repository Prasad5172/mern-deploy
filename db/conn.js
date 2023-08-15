const dotenv = require("dotenv")
dotenv.config();
const mongoose = require("mongoose");

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qiwhc0j.mongodb.net/spotify`);
mongoose.connection.on("connected",() => console.log('Connection Is Succesful'))
mongoose.connection.on("error",(error) => console.log('Connection Failed With-'+error))


