const User=require('../models/userModel.js')
const {throwError}=require('../errorHandler')
class userMiddleware{
    constructor (){

    }
    static async addPublishedProduct(user,productId,quantity){
      user.publishedProducts.push({productId,quantity})
      
      await user.save()
      console.log(user.publishedProducts)
      return user
    }
    static async findUserById(userId) {
      const user = await User.findById(userId);
      if (!user) 
        throwError('no user was found',404)
      
      return user; // This won't be reached if an error is thrown
  }
    static async toggleAdmin(user){
      if(user.role==='customer')
       {
         user.role='admin'
        await user.save()
        return user
       }
       if(user.role==='admin'){
        user.role='customer'
        await user.save()
        return user
       }

    }
    static async set_manager(id){
      try
      {
        const user=await User.findById(id)
        if(!user)
          throw new Error({success:false,message:"no user was found of this id"})
        user.role='manager'
        await user.save()
        return user
      }
      catch(error){
        throw error
      }
    }
    static async pushCodeIntoUserDoc(code, user) {
      try {
        // Push the code into the verificationCodes array of the user document
        user.verificationCodes.push({ code });
    
        // Save the updated user document
        await user.save();
    
        // Return a success message or any relevant data
        return "Verification code pushed into user document successfully";
      } catch (error) {
        console.error(error);
        throw new Error("Failed to push verification code into user document");
      }
    }
    
    static async findUserByEmail(email){
        try{
            const user=await User.findOne({email})
            if(!user)
              throw new Error('this email does not exist')
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
          throw error
        }
      }
      
}
module.exports=userMiddleware