const express = require("express")
const router = express.Router()
const {createUser,loginUser} = require("../controller/userController")
const {createBook,getAllBooks,getBookById,updateBook,deleteBook}=require("../controller/bookController")
const {createReview,updateReview,deleteReview}=require("../controller/reviewController")
const authenticate=require("../middleware/Authentication")
const authorise=require("../middleware/Authorisation")

//User APIs
router.post("/register",createUser)
router.post("/login",loginUser)
//Books API
router.post("/books",authenticate,authorise,createBook)
router.get("/books",authenticate,getAllBooks)
router.get("/books/:bookId",authenticate,getBookById)
router.put("/books/:bookId",authenticate,authorise,updateBook)
router.delete("/books/:bookId",authenticate,authorise,deleteBook)
//Review APIs
router.post("/books/:bookId/review",createReview)
router.put("/books/:bookId/review/:reviewId",updateReview)
router.delete("/books/:bookId/review/:reviewId",deleteReview)

module.exports =router