const jwt=require("jsonwebtoken")
require("dotenv").config()
const {SECRET_KEY}=process.env

const authenticate= function(req,res,next){
    try{
        let token= req.headers["token"]
        if(!token) return res.status(400).send({status:false,message:"Please provide token"})
        let decodedToken= jwt.verify(token,SECRET_KEY)
        req.decodedToken=decodedToken
        next()
    }
    catch(error){
        if(error.message=="invalid token") return res.status(401).send({status:false,message:"Please provide valid token"})
        return res.status(500).send({status:false,message:error.message})
    }
}
module.exports=authenticate