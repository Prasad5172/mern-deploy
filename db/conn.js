const dotenv = require("dotenv")
dotenv.config();
const mongoose = require("mongoose");

mongoose.connect(process.env.REACT_APP_DATA_BASE_URL_MONGODB);
mongoose.connection.on("connected",() => console.log('Connection Is Succesful'))
mongoose.connection.on("error",(error) => console.log('Connection Failed With-'+error))


