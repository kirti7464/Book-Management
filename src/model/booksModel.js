const mongoose= require("mongoose")
const bookSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true
    },
    excerpt:{
        type:String,
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    ISBN:{
        type:String,
        required:true,
        unique:true
    },
    category:{
        type:String,
        required:true
    },
    subcategory:{
        type:String,
        required:true
    },
    reviews:{
        type:Number,
        default:0,
        comment: 'Holds the number of reviews of this book'
    },
    deletedAt:Date,
    isDeleted:{
        type:Boolean,
        default:false
    },
    releasedAt:{            //format("YYYY-MM-DD")}
        type:Date,
        required:true
    },
    bookCover:String
},{timestamps:true})
 
module.exports= mongoose.model("book",bookSchema)