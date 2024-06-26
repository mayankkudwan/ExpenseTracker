const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose= require("mongoose");
const expenseRoute=require("./routes/expense")

mongoose.set('strictQuery', true)

dotenv.config()
const app=express();
app.use(cors());
app.use(express.json());
app.use("/api/v1/expenses",expenseRoute)

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('Connection successfull')
}).catch((err) =>{
    console.log(err);
});

app.listen(4444,()=>{
    console.log(`Server running on the port ${4444}`)
});