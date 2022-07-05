const {Schema,model} = require("mongoose")

const FileSchema = new Schema({
    path:{
        type:String,
        required:true
    },
    originalName:{
        type:String,
        required:true
    },
    password:String,
    downloadCount:{
        type:Number,
        required:true,
        default:0
    }
})

const File=model("File",FileSchema)

module.exports=File

