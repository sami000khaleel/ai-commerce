require("dotenv").config();
const express = require("express");
const path = require("path");
const http = require("http");
const mongoose = require("mongoose");
const fs = require("fs");
const app = express();
const bodyparser = require("body-parser");
const multer = require("multer");
const server = http.createServer(app);
const cors=require('cors')
app.use(bodyparser.json());
app.use(cors());
app.use(bodyparser.urlencoded({ extended: true }));
mongoose.connect('mongodb://127.0.0.1:27017/social-media').then(()=>{
  console.log('connected to database')
}).catch(err=>console.log(err.message))
// const socketHandler=require('./socketHandler')
// io.on('connection',(socket)=>{
//   socketHandler(socket)
// })
server.listen(3000,()=>{
  console.log('server is running')
})
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Perform some error handling or logging here
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
  // Perform some error handling or logging here
});
app.use(express.static(path.join(__dirname,'./dist')))
app.get('*',(req,res)=>{
  res.sendFile(path.join(__dirname,'dist','imdex.html'))
})