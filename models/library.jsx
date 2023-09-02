const mongoose = require('mongoose')

const librarySchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true,
        unique:true
    },
    playlists:[{
        playlistId:{
            type:String,
        },
        title:{
            type:String,
        },
        url:{
            type:String
        }
    }]
},{timestamps:true})


const Library = new mongoose.model("Library",librarySchema)
module.exports = Library;