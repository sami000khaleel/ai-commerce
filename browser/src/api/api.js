import axios from "axios";
import Cookies from "js-cookies";

export default class api {
  static url = "http://127.0.0.1:3000/api";
  static token = Cookies.getItem("token");

  static async getRandomProducts(batch) {
    try {
      const response = await axios.get(`${api.url}/product/get-random-products?batch=${batch}`, {
        headers: {
          token: Cookies.getItem('token')
        }
      });
       return response
    } catch (error) {
      console.error("Error fetching random products:", error);
      throw error;
    }
  }

  static async searchByImage(imageFile) {
    try {
      const formData = new FormData();
      formData.append("file", imageFile);

      const response = await axios.post(`${api.url}/product/search-by-image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          token: Cookies.getItem('token')
        }
      });
       return response
    } catch (error) {
      console.error("Error searching by image:", error);
      throw error;
    }
  }

  static async getSimilarities(imageFile) {
    try {
      const formData = new FormData();
      formData.append("file", imageFile);

      const response = await axios.post(`${api.url}/models/get-similarities`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          token: Cookies.getItem('token')
        }
      });
       return response
    } catch (error) {
      console.error("Error getting similarities:", error);
      throw error;
    }
  }

  static async getImage(productId, imageName) {
    try {
      const response = await axios.get(`${api.url}/product/get-image?productId=${productId}&imageName=${imageName}`, {
        headers: {
          token: Cookies.getItem('token')
        }
      });
       return response
    } catch (error) {
      console.error("Error getting image:", error);
      throw error;
    }
  }

  static async deleteProduct(productId) {
    try {
      const response = await axios.delete(`${api.url}/product`, {
        headers: {
          token: Cookies.getItem('token')
        },
        data: {
          productId: productId
        }
      });
       return response
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  }

  static async getProducts(search,category, min='', max='') {
    try {
      const response = await axios.get(`${api.url}/product`, {
        params: {
          search,
          category: category,
          min: min,
          max: max
        },
        headers: {
          token: Cookies.getItem('token')
        }
      });
       return response
    } catch (error) {
      console.error("Error getting products:", error);
      throw error;
    }
  }

  static async getProduct(productId) {
    try {
      const response = await axios.get(`${api.url}/product/${productId}`, {
        headers: {
          token: Cookies.getItem('token')
        }
      });
       return response
    } catch (error) {
      console.error("Error getting product:", error);
      throw error;
    }
  }

  static async updateProduct(productData) {
    try {
      const response = await axios.patch(`${api.url}/product`, productData, {
        headers: {
          "Content-Type": "application/json",
          token: Cookies.getItem('token')
        }
      });
       return response
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  }

  static async createProduct(productData) {
    try {
      const response = await axios.post(`${api.url}/product`, productData, {
        headers: {
          "Content-Type": "multipart/form-data",
          token: Cookies.getItem('token')
        }
      });
       return response
    } catch (error) {
      console.error("Error creating product:", error.response);
      throw error;
    }
  }

  static async buyProducts(cart) {
    try {
      const response = await axios.post(`${api.url}/user/buy`, cart, {
        headers: {
          "Content-Type": "application/json",
          token: Cookies.getItem('token')
        }
      });
      console.log(Cookies.getItem('token'))
       return response
    } catch (error) {
      console.error("Error buying products:", error);
      throw error;
    }
  }

  static async getAdmins() {
    try {
      const response = await axios.get(`${api.url}/user/get-admins`, {
        headers: {
          token: Cookies.getItem('token')
        }
      });
       return response
    } catch (error) {
      console.error("Error getting admins:", error);
      throw error;
    }
  }

  static async toggleAdmin(userId) {
    try {
      const response = await axios.patch(`${api.url}/user/toggle-admin`, { userId: userId }, {
        headers: {
          "Content-Type": "application/json",
          token: Cookies.getItem('token')
        }
      });
       return response
    } catch (error) {
      console.error("Error toggling admin:", error);
      throw error;
    }
  }
  static async verifyCode(email,code)
  {
    console.log(email,code)
    try{
     const response=await axios.post(`${api.url}/user/recover-account`,{email},{
        headers:{
          token:api.token
          ,code:String(code)
        }
      })
      return response
    }catch(err){
      console.error("error verifying the code : ", err)
      throw err
    }
  }
  
  static async getCode(email)
  {
    try{
     const response=await axios.get(`${api.url}/user/recover-account?email=${email}`)
      return response
    }catch(err){
      console.error("error getting the code : ", err)
      throw err
    }
  }
  static async login(email,password)
  {
    try{
     const response=await axios.get(`${api.url}/user/login?email=${email}`
    ,{
      headers:{
        password
      }
    })
      return response
    }catch(err){
      console.error("error logging in : ", err)
      throw err
    }}
  static async validateToken()
  {
    try{
     const response=await axios.get(`${api.url}/user/validate-token`,{
        headers:{
          token:Cookies.getItem('token')
        }
      })
      return response
    }catch(err){
      console.error("error validating token : ", err)
      throw err
    }
  }
  static async createAccount(user)
  {
    try{
     const response=await axios.post(`${api.url}/user/`,{
      user})
        return response
    }catch(err){
      console.error("error creating you`r account : ", err)
      throw err
    }
  }
  static async getCountries() {
    try {
      const response = await axios.get(`${api.url}/user/get-countries`, {
        headers: {
          token: Cookies.getItem('token')
        }
      });
      return response;
    } catch (error) {
      console.error("Error getting countries:", error);
      throw error;
    }
  }

  static async getCities(country) {
    try {
      const response = await axios.get(
        `${api.url}/user/get-cities?country=${country}`,
        {
          headers: {
            token: Cookies.getItem('token')
          }
        }
      );
      return response;
    } catch (error) {
      console.error("Error getting cities:", error);
      throw error;
    }
  }

  static async resetPassword(password) {
    try {
      const response = await axios.patch(
        `${api.url}/user/reset-password`,
        { password },
        {
          headers: {
            "Content-Type": "application/json",
            token: Cookies.token
          }
        }
      );
      return response;
    } catch (error) {
      console.error("Error resetting password:", error);
      throw error;
    }
  }
}
