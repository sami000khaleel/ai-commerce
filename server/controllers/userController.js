const jwt = require('jsonwebtoken');
const authentication=require('../middlewares/authentication.js');
const userMiddleware = require('../middlewares/userMiddleware.js');
class userController{
    constructor(){

    }
    static async checkVerificationAccount(req,res){
        try
        {
            const user=await userMiddleware.findUserByEmail(req.body.email)
            // if it is later than 30 seconds then deny
            await authentication.checkCodeAge(req.body.code,user)
        }
        catch(error){
            console.log(error)
            res.json({success:false,message:error.message})
        }
    }
    static async createVerificationCode(req,res){
        try {
            const user=await userMiddleware.findUserByEmail(req.query.email)
            await authentication.checkCodeFrequency(user)
            const code =await authentication.createVerificationCode(user)
            await authentication.sendCode(user.email,code)
        }
        catch(error){
            console.error(error)
            return res.josn({success:'false',message:'internal server error'})
        }
    }
    static async loginUser(req,res){
        try{
        let result=null
         const user=await userMiddleware.findUserByEmail(req.query.email)
        if(!user)
            return res.json({success:false,message:'email is incorrect'})
        result=await authentication.verifyPassword(req.headers['password'],user.password)
         if(!result)
            return res.json({success:false,message:'password is incorrect'})   
        const token=authentication.createToken(user.id)    
        if(!token)
        return res.json({success:false,message:'failed creating the token'})
        res.header('token',token)    
        return res.json({success:true,user})
    }
        catch(error){
            console.error(error)
            return res.json({success:false,message:error.message})
        }
    }
    static async createAccount(req,res){
        try{
            let result=null
            return res.json({success:false,message:'city does not exist'})
            await  authentication.validateUserInfo(req.user)
          const hashedPassword=  await authentication.hashPassword(req.headers.password)
          req.body.user.password=hashedPassword 
          result= await authentication.checkEmailExists(req.user.email)
            if(result)
                return res.json({success:false,message:'email is already taken'})
            const user=await userMiddleware.createUser(req.body.user)              
            const token=await authentication.createToken(user.id)
            res.header('token',token)
            return res.json({success:true,user})
        }
        catch(error){
            console.error(error)
            return res.json({success:false,message:'error creating account'})
        }
    }
    static async  validateToken(req,res){
        try{
            if(!req.headers['token'])
                return res.json({success:false,message:'no token was sent'})
         const result=await authentication.validateToken(req.headers['token'])
            return res.json({success:true})
        }
        catch(error){
            console.error(error)
            return res.json({success:false,message:'the token is corrupted'})
        }
    }
}
module.exports=userController