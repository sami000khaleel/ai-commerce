const jwt = require("jsonwebtoken");
const User=require('../models/userModel.js')
const authentication = require("../middlewares/authentication.js");
const userMiddleware = require("../middlewares/userMiddleware.js");
class userController {
  constructor() {}
  
  static async getAdmins(req,res){
    try
    {
      await authentication.validateToken(req.headers['token'])
      let admins=await User.find({role:'admin'})
      admins=admins.map(({_id,role,name,email})=>{return{_id,role,name,email}})
      return res.json({success:true,admins})  
    }catch(err){
      if(!err?.internal)
        return res.status(err.status).json({success:false,message:err.message})
      console.error(err)
      return res.status(500).json({success:false,message:'internal server error'})
    }
  }
  static async toggleAdmin(req,res){
    try
    {
      let user=await User.findById(req.body.userId)
      if(!user)
        return res.status(404).json({success:false,message:"no user was found"})
      const token=await authentication.validateToken(req.headers['token'])
      console.log(token)
      if(token.userId!==process.env.MANAGER_ID)
        return res.status(403).json({success:false,message:'you are not the manager'})

      const manager=await User.findById(token.userId)
      if(!manager)
        return res.status(404).json({success:false,message:"no manager was found"})
      user=await userMiddleware.toggleAdmin(user)
     console.log('done')
      return res.status(201).json({success:true})

      
    }catch(err){
      if(!err?.internal)
        return res.status(err.status).json({success:false,message:err.message})
      console.error(err)
      return res.status(500).json({success:false,message:'internal server error'})
      
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
        return res.json({
          success: false,
          error: "there is no password set in the environment",
        });
      if (password != process.env.MANAGER_PASSWORD)
        return res.json({
          success: false,
          message: "the manager password is incorrect",
        });
        const manager=await userMiddleware.set_manager(req.headers['userId'])
        
    } catch (error) {
      return res.json({ success: false, message: error.message });
    }
  }
  static async checkVerificationAccount(req, res) {
    try {
      const user = await userMiddleware.findUserByEmail(req.body.email);
      // if it is later than 30 seconds then deny
      await authentication.checkCodeAge(req.headers["code"], user);
      await authentication.checkIfCodeMatches(req.headers["code"], user);
      const token = authentication.createToken(user.id);
      req.headers[("token", token)];
      res.json({ success: true });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error });
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
      throw res.json({ success: false, message: error });
    }
  }
  static async loginUser(req, res) {
    try {
      let result = null;
      const user = await userMiddleware.findUserByEmail(req.query.email);
      if (!user)
        return res.json({ success: false, message: "email is incorrect" });
      result = await authentication.verifyPassword(
        req.headers["password"],
        user.password
      );
      if (!result)
        return res.json({ success: false, message: "password is incorrect" });
      const token = authentication.createToken(user.id);
      if (!token)
        return res.json({
          success: false,
          message: "failed creating the token",
        });
      res.header("token", token);
      return res.json({ success: true, user });
    } catch (error) {
      console.error(error);
      return res.json({ success: false, message: error.message });
    }
  }
  static async createAccount(req, res) {
      let result = null;
      console.log(req.body);
      await authentication.validateUserInfo(req.body.user);
      const hashedPassword = await authentication.hashPassword(
        req.headers.password,
        req.body.user
      );
      req.body.user.password = hashedPassword;
      result = await authentication.checkEmailExists(req.body.user.email);
      if (result)
        return res.json({ success: false, message: "email is already taken" });
      const user = await userMiddleware.createUser(req.body.user);
      const token = await authentication.createToken(user.id);
      res.header("token", token);
      return res.json({ success: true, user });
    
      
    
  }
  static async validateToken(req, res) {
    try {
      if (!req.headers["token"])
        return res.json({ success: false, message: "no token was sent" });
      const token = await authentication.validateToken(req.headers["token"]);
      return res.json({ success: true });
    } catch (error) {
      console.error(error);
      return res.json({ success: false, message: "the token is corrupted or expired" });
    }
  }
}
module.exports = userController;
