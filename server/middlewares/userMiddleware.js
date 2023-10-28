const User=require('../models/userModel.js')
class userMiddleware{
    constructor (){

    }
    static async findUserByEmail(email){
        try{
            const user=await User.findOne({email})
            if(!user)
              throw new Error({message:'this email does not exist'})
            return user
        }
        catch(error)
{
    console.error(error)
    throw error
}
    }
     static async createUser(userData) {
        try {
          const user = await User.create(userData);
          return user;
        } catch (error) {
          throw error;
        }
      }
      
}
module.exports=userMiddleware