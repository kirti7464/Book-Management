const bookModel= require("../model/booksModel")
const userModel= require("../model/userModel")
const reviewModel= require("../model/reviewModel")
const { isValid, isValidRequestBody,isValidISBN,isValidObjectId} = require("../util/validation")
const createBook =async function(req,res){
    try{
        let input = req.body
        let {title,excerpt,userId,ISBN,category,subcategory}=req.body
        if (!isValidRequestBody(input))
          return res.status(400).send({
              status: false,
              message: "Please provide data for creating book",
            });
        if(!title) return res.status(400).send({status: false,
            message: "Please provide title of the book"})
        if(!isValid(title)) return res.status(400).send({status: false,
                message: "Please provide valid title "})

        if(!excerpt) return res.status(400).send({status: false,
            message: "Please provide excerpt of the book"})
        if(!isValid(excerpt)) return res.status(400).send({status: false,
                message: "Please provide valid excerpt "})

        if(!userId) return res.status(400).send({status: false,
            message: "Please provide user ID of the of the user"})
        if(!isValidRequestBody(userId)) return res.status(400).send({status: false,
                message: "Please provide valid userId "})

        if(!ISBN) return res.status(400).send({status: false,
            message: "Please provide ISBN of the book"})
        if(!isValidISBN(ISBN)) return res.status(400).send({status: false,
                message: "Please provide valid ISBN "})
        
        if(!category) return res.status(400).send({status: false,
            message: "Please provide category of the book"})
        if(!isValid(category)) return res.status(400).send({status: false,
                message: "Please provide valid category "})

        if(!subcategory) return res.status(400).send({status: false,
           message: "Please provide subcategory of the book"})
        if(!isValid(subcategory)) return res.status(400).send({status: false,
            message: "Please provide valid subcategory "})
        //unique title and ISBN
        let registeredTitle=await bookModel.findOne({title:title})
        if(registeredTitle) return res.status(400).send({status: false,
            message: "A book is already created with the title ..make changes in the title of the book"})
        let registeredISBN =await bookModel.findOne({ISBN:ISBN})
        if(registeredISBN) return res.status(400).send({status: false,
            message: "A book is already created with the ISBN ..make changes in the ISBN of the book"})
        //userId exists or not
        let user= await userModel.findById(userId)
        if(!user) return res.status(400).send({status: false,
            message: "Please provide a valid user Id"})
        
        let bookData= await bookModel.create(input)
        return res.status(201).send({status:true,data:bookData})
    }
    catch(error){
        return res.status(500).send({status:false,message:error.message})
    }
}
const getAllBooks= async function(req,res){
    try{
        let filter = req.query
        filter.isDeleted=false
        let books= await bookModel.find(filter).select({_id:1,title:1,excerpt:1,userId:1,category:1,releasedAt:1,reviews :1}).sort({title:1})

        if(books.length==0) return res.status(404).send({status:false,message:"There is no book with the applied filters"})
        
        return res.status(200).send({status: true,
            message: 'Books list',data:books})
    }
    catch(error){
        return res.status(500).send({status:false,message:error.message})
    }
}
const getBookById= async function(req,res){
    try{
        let bookId= req.params.bookId
        if(!isValidObjectId(bookId)) return res.status(400).send({status: false,
            message: "Please provide valid book Id"})
        let book= await bookModel.findOne({_id:bookId,isDeleted:false})
        if(!book) return res.status(404).send({status: false,
            message: "There is no book available with this id"})
        let review=await reviewModel.find({bookId:bookId,isDeleted:false})
        let result={...book._doc}
        result.reviewData=review
        return res.status(200).send({status:true,message:"Books list",data:result})
    }
    catch(error){
        return res.status(500).send({status:false,message:error.message})
    }
}
const updateBook = async function(req,res){
    try{
        let bookId= req.params.bookId
        if(!isValidObjectId(bookId)) return res.status(400).send({status: false,
            message: "Please provide valid book Id"})
        let {title,excerpt,releasedAt,ISBN}=req.body
        
        if(title){
            if(!isValid(title)) return res.status(400).send({status: false,
                message: "Please provide valid title "}) 
            let registeredTitle=await bookModel.findOne({title:title})//unique title
            if(registeredTitle) return res.status(400).send({status: false,
                message: "A book is already created with this title ..please choose different title"})
        }
        if(excerpt){
            if(!isValid(excerpt)) return res.status(400).send({status: false,
                message: "Please provide valid excerpt "})
            
        }
        if(releasedAt){
            const dateFormat = /^\d{4}-\d{2}-\d{2}$/
            if((typeof releasedAt != "Date")&&(!dateFormat.test(releasedAt))) return res.status(400).send({status: false,
                message: "Please provide valid releasedAt time "})
           
        }
        if(ISBN){
            if(!isValidISBN(ISBN)) return res.status(400).send({status: false,
                message: "Please provide valid ISBN "})
            let registeredISBN =await bookModel.findOne({ISBN:ISBN}) //unique ISBN
            if(registeredISBN) return res.status(400).send({status: false,
                message: "A book is already created with this ISBN ..please choose different ISBN"})
            
        }
   
        let book= await bookModel.findOne({_id:bookId,isDeleted:false})
        if(!book) return res.status(404).send({status: false,
            message: "There is no book with this id"})
        //validation on each input and updation works properly
        let updatedData= await bookModel.findByIdAndUpdate(bookId,req.body,{new:true})
        return res.status(200).send({
            status: true,
            message: 'Success',
            data: updatedData
          })

    }
    catch(error){
        return res.status(500).send({status:false,message:error.message})
    }
}
const deleteBook=async function(req,res){
    try{
        let bookId= req.params.bookId
        if(!isValidObjectId(bookId)) return res.status(400).send({status: false,
            message: "Please provide valid book Id"})
        let book= await bookModel.findOne({_id:bookId,isDeleted:false})
        if(!book) return res.status(404).send({status: false,
            message: "There is no book with this id"})
        let delBook= await bookModel.findByIdAndUpdate(bookId,{isDeleted:true,deletedAt:new Date()},{new:true})
        return res.status(200).send({status: true,
            message: 'Success'})

    }
    catch(error){
        return res.status(500).send({status:false,message:error.message})
    }
}
module.exports={createBook,getAllBooks,getBookById,updateBook,deleteBook}