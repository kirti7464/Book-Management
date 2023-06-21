const userModel= require("../model/userModel")
const jwt= require("jsonwebtoken")
require("dotenv").config()
const {SECRET_KEY}=process.env
const {isValid, isValidRequestBody, isValidEmail,isValidtitle ,isValidMobileNum}=require("../util/validation")

const createUser= async function(req,res){
    try{
        let input = req.body
        let {title,name,email,phone,password}=input
        if(!isValidRequestBody(req.body)) return res.status(400).send({
            status: false,
            message: "Please provide data for creating user",
          });

        if(!title) return res.status(400).send({status: false,
            message: "Please provide title of the user"})
        //title options check
        if(!isValidtitle(title)) return res.status(400).send({ status: false, 
            message: "Please provide valid title for the user" });

        if(!name) return res.status(400).send({status: false,
            message: "Please provide name of the user"})
        if(!isValid(name)) return res.status(400).send({ status: false, message: "Please provide name in correct format" });

        if(!email) return res.status(400).send({status: false,
            message: "Please provide email of the user"})
        //valid email
        if(!isValidEmail(email)) return res.status(400).send({ status: false, 
            message: "Please provide valid email" }); 

        if(!phone) return res.status(400).send({status: false,
            message: "Please provide phone number of the user"})
        if(isValidMobileNum(phone)) return res.status(400).send({ status: false, message: "Please provide valid mobile number" });

        if(!password) return res.status(400).send({status: false,
            message: "Please provide password"})
        //unique email
        let duplicateEmail= await userModel.findOne({email:email})
        if(duplicateEmail) return res.status(400).send({status: false,
            message: "This email is already registered"})
        //unique phone number
        let duplicatePhone = await userModel.findOne({phone:phone})
        if(duplicatePhone) return res.status(400).send({status: false,
            message: "This phone number is already registered"})
        let userData= await userModel.create(input)
        return res.status(201).send({status: true,
            data: userData})
    }
    catch(error){
        return res.status(500).send({status:false,message:error.message})
    }
}
const loginUser= async function(req,res){
    try{
        let {email,password}=req.body
        if(!isValidRequestBody(req.body)) return res.status(400).send({
            status: false,
            message: "Please provide credentials",
          });
        if(!email) return res.status(400).send({status: false,
            message: "Please provide email of the user"})
        if(!isValidEmail(email)) return res.status(400).send({ status: false, 
                message: "Please provide valid email" }); 
        
        
        if(!password) return res.status(400).send({status: false,
            message: "Please provide password"})
        let user = await userModel.findOne({email:email,password:password})
        if(!user) return res.status(401).send({status: false,
            message: "Please provide correct credentials... or register first"})
        
        let token= jwt.sign({userId:user._id,exp:232934892384092},SECRET_KEY)
        res.setHeaders["token",token]
        return res.status(200).send({status: true,
            data: {token:token}})
        }
        catch(error){
            return res.status(500).send({status:false,message:error.message})
        }
}

module.exports={createUser,loginUser}