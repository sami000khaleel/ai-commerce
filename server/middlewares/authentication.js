const nodemailer = require('nodemailer');
const User = require("../models/userModel.js");
const axios = require("axios");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { throwError } = require('../errorHandler.js');
class authentication {
  constructor() {}
  static async createVerificationCode(user){
    try
    {
      const code = Math.floor(Math.random()*1000000)
      user.verificationCodes.push({code})
      await user.save()
      return code
    }
    catch(error){
      console.log(error)
      throw error
    }
  }
  static async checkIfCodeMatches(code, user) {
    try {
      const lastVerificationCode = user.verificationCodes[user.verificationCodes.length - 1];
  
      if (!lastVerificationCode || lastVerificationCode.code != code) {
        throw new Error( "Invalid verification code" );
        
      }
  
      return "Verification code matched successfully";
    } catch (error) {
      console.error(error,'a');
      throw error
    }
  }
  
  static async checkCodeAge(code,user){
    try
    {
     const timeGapSeconds=Date.now()-user.verificationCodes[user.verificationCodes.length-1].createdAt
      if(timeGapSeconds<30000)
        throw new Error(`you have to type the code within 30 seconds from recieving it.`)
    }
    catch(error){
      console.log(error)
      throw error
    }
  }
  static async sendCode(email,code){
    try{
      console.log(process.env.UESR_NAME)
      const transporter=nodemailer.createTransport({
        service:'gmail',
        auth:{
        user:process.env.UESR_NAME,
        pass:process.env.APP_PASSWORD
      }
    })
    const mailOptions={
      from:process.env.EMAIL,
      to:email,
      subject:'ai commerce account recovery',
      text:`your verification code is : ${code}`
    }
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);

  }
  
  catch(error){
    console.error(error)
    throw error
  }
}
  static async checkCodeFrequency(user) {
    try {
      if (!user.verificationCodes.length) return true;
      let isAfter30Sec= Date.now() -
        user.verificationCodes[user.verificationCodes.length - 1].createdAt >30000
        
        // if(!isAfter30Sec)
        //   throw new Error({message:'you must wait 30 seconds between each code request'});
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  static async verifyPassword(sentPassword, password) {
    try {
      const res = await bcryptjs.compare(sentPassword, password);
      return res;
    } catch (error) {
      console.error(error);
      throwError('incorrect password',400)
    }
  }
  static createToken(userId) {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    });
    return token;
  }
  static async checkCityExists(city) {
    try {
      const response = await axios.get(
        `https://api.example.com/cities?name=${city}`
      );
      const cities = response.data;

      // Check if the city exists in the response
      const cityExists = cities.some(
        (c) => c.name.toLowerCase() === city.toLowerCase()
      );

      return cityExists;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  static async checkEmailExists(email) {
    try {
      const existingUser = await User.findOne({ email });
      return existingUser !== null;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async hashPassword(password,user) {
    try {
      // Hash the password
      const hashedPassword = await bcryptjs.hash(user.password, 10);
      return hashedPassword;
    } catch (error) {
        throwError("error while dealing with you`r password")
    }
  }
  static async validateUserInfo(user) {
    try {
      // Validate user information here
      if (!user.name || !user.email || !user.password) {
        let err= new Error("Missing required user information");
        err.status=403
        err.internal=false
        throw err
      }

      // Validate password length
      if (user.password.length < 6) {
          return throwError('password should be at least 6 characters long',400)
      }

      // Return the validated user information with the hashed password
      return {
        name: user.name,
        email: user.email,
        password: user.password,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  static async validateToken(token) {
      if(!token)
        throwError('no token was provided',400)
        const result = await jwt.verify(token, process.env.JWT_SECRET)
      return result;
    
      
  }
}
module.exports = authentication;
