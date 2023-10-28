require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRouter=require('./routes/userRoutes')
async function createServer() {
  try {
    const app = express();
    app.use(cors());
    const port = process.env.PORT_NUMBER || 3000;
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("connected to database");
    await app.listen(port);
    console.log("connected to server");
  } catch (error) {
    console.error(error);
  }
}
createServer();
