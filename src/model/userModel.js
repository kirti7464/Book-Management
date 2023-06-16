const mongoose= require("mongoose")
const userSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true,
        enum:["Mr","Mrs","Miss"]
    },
    name:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true,
        unique:true
    },
    email:{                                //validation
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:8,
        maxlength:10
    },
    address:{
        street: String,
        city: String,
        pincode: String
    }

},{timestamps:true})

module.exports= mongoose.model("user",userSchema)
