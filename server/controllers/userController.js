const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const authentication = require("../middlewares/authentication.js");
const userMiddleware = require("../middlewares/userMiddleware.js");
const { throwError, handleError } = require("../errorHandler.js");
const fs = require("fs");
const billMiddleware=require('../middlewares/billMiddleware.js')
const { promisify } = require("util");
const productMiddleware = require("../middlewares/productMiddleware.js");
const readFile = promisify(fs.readFile);
class userController {
  constructor() {}
  static async resetPassword(req,res){
    try{
      const {userId}=await authentication.validateToken(req.headers['token'])
      let user=await User.findById(userId).catch(err=>throwError('no user was found',404))
      const {password}=req.body
      if(!password)
        throwError('no password was sent',400)
        if(password.length<6)
          throwError('password should be at least 6 character long',400)
        password=await authentication.hashPassword(password)
        user.password=password
        return res.json({success:true})
    }catch(err){
      handleError(err,res)
    }
  }
  static async getCountries(req, res) {
    try {
      let file = await readFile("./countries_and_cities.json");
      file = JSON.parse(file);
      const countries = file.map((element) => element.country);
      return res.json({ success: true, countries });
    } catch (err) {
      handleError(err, res);
    }
  }
  static async buyProduct(req, res) {
    try
     {
      // check for products
      // cart:{products:{},userId,q}
      const {userId}=await authentication.validateToken(req.headers['token'])
      const user=await User.findById(userId)
      let cart=req.body.map(item=>({productId:item.product._id,quantity:item.quantity,size:item.size}))
      let bill=await billMiddleware.createBill(cart,userId)
      const updatedPorducts=await productMiddleware.checkProductsQuantities(bill)
      await bill.save()
      await billMiddleware.sendBillEmail(bill,user)
      return res.json({success:true,bill})
    } catch (err) {
      handleError(err, res);
    }
  }
  static async getCities(req, res) {
    try {
      if (!req.query?.country) throwError("no country was sent", 400);
      let file = await readFile("./countries_and_cities.json");
      file = JSON.parse(file);
      const countryObj = file.filter(
        (elem) => elem.country === req.query.country
      );
      return res.json({ success: true, cities: countryObj[0].cities });
    } catch (err) {
      handleError(err, res);
    }
  }
  static async getAdmins(req, res) {
    try {
      await authentication.validateToken(req.headers["token"]);
      let admins = await User.find({ role: "admin" });
      admins = admins.map(({ _id, role, name, email }) => {
        return { _id, role, name, email };
      });
      return res.json({ success: true, admins });
    } catch (err) {
      if (!err?.internal)
        return res
          .status(err.status)
          .json({ success: false, message: err.message });
      console.error(err);
      return res
        .status(500)
        .json({ success: false, message: "internal server error" });
    }
  }
  static async toggleAdmin(req, res) {
    try {
      let user = await User.findById(req.body.userId);
      if (!user)
        return res
          .status(404)
          .json({ success: false, message: "no user was found" });
      const token = await authentication.validateToken(req.headers["token"]);
      console.log(token);
      if (token.userId !== process.env.MANAGER_ID)
        return res
          .status(403)
          .json({ success: false, message: "you are not the manager" });

      const manager = await User.findById(token.userId);
      if (!manager)
        return res
          .status(404)
          .json({ success: false, message: "no manager was found" });
      user = await userMiddleware.toggleAdmin(user);
      console.log("done");
      return res.status(201).json({ success: true });
    } catch (err) {
      if (!err?.internal)
        return res
          .status(err.status)
          .json({ success: false, message: err.message });
      console.error(err);
      return res
        .status(500)
        .json({ success: false, message: "internal server error" });
    }
  }
  // is the beginning there is no manager
  // manager is set using this function
  // while there is a manager no other manager can be
  // manager can log out henc other one can replace
  static async login_admin(req, res) {
    try {
      const password = req.headers["password"];
      if (!process.env.MANAGER_PASSWORD)
        return res.status(400).json({
          success: false,
          error: "there is no password set in the environment",
        });
      if (password != process.env.MANAGER_PASSWORD)
        return res.status(400).json({
          success: false,
          message: "the manager password is incorrect",
        });
      const manager = await userMiddleware.set_manager(req.headers["userId"]);
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
  static async checkVerificationAccount(req, res) {
    try {
      const user = await userMiddleware.findUserByEmail(req.body.email);
      // if it is later than 30 seconds then deny
      await authentication.checkCodeAge(req.headers["code"], user);
      await authentication.checkIfCodeMatches(req.headers["code"], user);
      const token = authentication.createToken(user.id);
      res.json({ success: true,token });
    } catch (error) {
      console.log(error);
      res.status(400).json({ success: false, message: error });
    }
  }
  static async resetPassword(req, res) {
    try {
      if(!req.body?.password)
        throwError('no password was given')
      const { userId } = await authentication.validateToken(req.headers.token);
      const user = await User.findById(userId);
      const hashedPassword = await authentication.hashPassword(req.body.password, user);
      user.password=hashedPassword
      res.json({ success: true });
    } catch (error) {
      handleError(error,res)
    }
  }
  static async createVerificationCode(req, res) {
    try {
      const user = await userMiddleware.findUserByEmail(req.query.email);
      await authentication.checkCodeFrequency(user);
      const code = await authentication.createVerificationCode(user);
      await authentication.sendCode(user.email, code);
      return res.json({
        success: true,
        message: "your code has been sent successfully",
      });
    } catch (error) {
      console.error(error);
      handleError(error,res)
    }}
  static async loginUser(req, res) {
    try {
      let result = null;
      if (!req.query?.email || !req.headers?.password)
        return res.status(400).json({ success: false, message: 'You need to send your email and password' });
  
      const user = await userMiddleware.findUserByEmail(req.query.email);
      if (!user)
        return res.status(404).json({ success: false, message: 'Email is incorrect' });
  
      result = await authentication.verifyPassword(req.headers["password"], user.password);
      if (!result)
        return res.status(400).json({ success: false, message: 'Password is incorrect' });
  
      const token = authentication.createToken(user.id);
      if (!token)
        return res.status(400).json({ success: false, message: 'Failed creating the token' });
  
      // Exclude unnecessary fields from the user object
      const sanitizedUser = {
        _id: user._id,
        name: user.name,
        email: user.email,
        location: user.location // If you want to include the location field
      };
  
      res.header("token", token);
      return res.json({ success: true, user: sanitizedUser });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }
  
  static async createAccount(req, res) {
  try{  let result = null;
    console.log(req.body);
    await authentication.validateUserInfo(req.body.user);
    const hashedPassword = await authentication.hashPassword(
      req.headers.password,
      req.body.user
    );
    req.body.user.password = hashedPassword;
    result = await authentication.checkEmailExists(req.body.user.email);
    if (result)
      return res.status(400).json({ success: false, message: "email is already taken" });
    const user = await userMiddleware.createUser(req.body.user);
    const token = await authentication.createToken(user.id);
    res.header("token", token);
    const sanitizedUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      location: user.location // If you want to include the location field
    };

    
    return res.json({ success: true, user:sanitizedUser });}
    catch(err){
      handleError(err,res)
    }
  }
  static async validateToken(req, res) {
    try {
      if (!req.headers["token"])
        return res.status(400).json({ success: false, message: "no token was sent" });
      const token = await authentication.validateToken(req.headers["token"]);
      return res.json({ success: true });
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        success: false,
        message: "the token is corrupted or expired",
      });
    }
  }
}
module.exports = userController;
