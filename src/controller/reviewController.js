const reviewModel = require("../model/reviewModel")
const bookModel = require("../model/booksModel")

const createReview= async function(req,res){
     try{
        let bookId=req.params.bookId
        let {review,rating,reviewedBy}=req.body
        let book= await bookModel.findOne({_id:bookId,isDeleted:false})
        //book existence
        if(!book) return res.status(400).send({status:false,message:"There is no book with this Id"})
        let reviewDoc=await reviewModel.create(req.body)

        //updating review count in book doc
        let reviewedBook= await bookModel.findOneAndUpdate({_id:bookId},{ $inc: { reviews: 1 }},{new:true})

        //finding all reviews with given bookId
        let reviewArr= await reviewModel.find({bookId:bookId})

        //created result object for storing the response data 
        let result={...reviewedBook._doc}
        //added reviewArray in the result object
        result.reviewsData=reviewArr
        
        return res.status(200).send({status:true,message:"Review added successfully",data:result})
        }
        catch(error){
            return res.status(500).send({status:false,message:error.message})
        }
}
const updateReview = async function(req,res){
    try{
        let bookId= req.params.bookId
        let reviewId= req.params.reviewId
        let {review, rating,reviewedBy}=req.body

        //book existence
        let book= await bookModel.findOne({_id:bookId,isDeleted:false})
        if(!book) return res.status(400).send({status:false,message:"Please provide correct bookId or the book is deleted"})
        //review Doc existence
        let reviewDoc= await reviewModel.findOne({_id:reviewId,isDeleted:false})
        if(!reviewDoc) return res.status(400).send({status:false,message:"Please provide correct reviewId or the review is deleted"})

        let updatedReview= await reviewModel.findByIdAndUpdate(reviewId,req.body)

        //finding all reviews with given bookId
        let reviewArr= await reviewModel.find({bookId:bookId})
        let result={...book._doc}
        result.reviewsData=reviewArr
        return res.status(200).send({status: true,message: 'Books list',data:result})
    }
    catch(error){
        return res.status(500).send({status:false,message:error.message})
    }
}
const deleteReview = async function(req,res){
    try{
        let bookId= req.params.bookId
        let reviewId= req.params.reviewId
        //review Doc existence
        let reviewDoc= await reviewModel.findOne({_id:reviewId,isDeleted:false})
        if(!reviewDoc) return res.status(400).send({status:false,message:"Please provide correct reviewId or the review is deleted"})
        //book existence
        let book= await bookModel.findById({_id:bookId,isDeleted:false})
        if(!book) return res.status(400).send({status:false,message:"Please provide correct bookId or the book is deleted"})
        let delReview =await reviewModel.findByIdAndUpdate(reviewId,{isDeleted:true})
        if(!delReview) return res.status(400).send({status:false,message:"Already deleted review"})
        let reviewedBook= await bookModel.findOneAndUpdate({_id:bookId},{ $inc: { reviews: -1 }},{new:true})
        return res.status(200).send({status: true,message: 'Review deleted succesfully!!'})

    }
    catch(error){
        return res.status(500).send({status:false,message:error.message})
    }
}
module.exports={createReview,updateReview,deleteReview}