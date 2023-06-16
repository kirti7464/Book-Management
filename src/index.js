const express = require("express")
const app=express()
const mongoose= require("mongoose")
const route= require("./route/route")
require("dotenv").config()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

const {MONGODB_URL,PORT}=process.env
mongoose.connect(MONGODB_URL,{
    useNewUrlParser:true
}).then(()=>{
    console.log("COnnected to Mongodb")
}).catch((error)=>{
    console.log("Error in connecting mongodb",error)
})

app.use("/",route)

app.listen(PORT,()=>{
    console.log(`Server is running at port ${PORT}`)
})