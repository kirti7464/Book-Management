const jwt= require("jsonwebtoken")
const bookModel= require("../model/booksModel")
const authorise=async function(req,res,next){
    try{
        let decodedToken=req.decodedToken
        if(req.params.bookId){
            let book =await bookModel.findById(req.params.bookId)
            if(book.userId!=decodedToken.userId) return res.status(403).send({status:false,message:"Unauthorised"})
            next()
        }
        if(Object.keys(req.body).includes("userId")){
            if(req.body.userId!=decodedToken.userId) return res.status(403).send({status:false,message:"Unauthorised"})
            next()
        }
    }
    catch(error){
        return res.status(500).send({status:false,message:error.message})
    }
}
module.exports = authorise