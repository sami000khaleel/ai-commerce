const nodemailer = require('nodemailer');
const User = require("../models/userModel.js");
const axios = require("axios");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
class authentication {
  constructor() {}
  static async checkCodeAge(code,user){
    try
    {
     const timeGapSeconds=Date.now()-user.verificationCodes[user.verificationCodes.length-1].createdAt
      if(timeGapSeconds>30000)
        throw new Error({message:` يجب أن تدخل الرمز السري خلال 30 ثانية من استلامه `})
    }
    catch(error){
      throw error
    }
  }
  static async sendCode(email){
    try{
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
        
        if(!isAfter30Sec)
          throw new Error({message:'you must wait 30 seconds between each code request'});
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
      throw error;
    }
  }
  static createToken(userId) {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "1w",
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

  static async hashPassword(password) {
    try {
      // Hash the password
      const hashedPassword = await bcryptjs.hash(user.password, 10);
      return hashedPassword;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  static async validateUserInfo(user) {
    try {
      // Validate user information here
      if (!user.name || !user.email || !user.password) {
        throw new Error("Missing required user information");
      }

      // Validate password length
      if (user.password.length < 6) {
        throw new Error("Password should be at least 6 characters long");
      }

      // Return the validated user information with the hashed password
      return {
        name: user.name,
        email: user.email,
        password: hashedPassword,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  static async validateToken(token) {
    try {
      const result = await jwt.verify(token, process.env.JWT_SECRET);
      return result;
    } catch (error) {
      // Handle the error appropriately (e.g., log the error, return an error response)
      console.error(error);
      throw error; // Rethrow the error if needed
    }
  }
}
module.exports = authentication;
