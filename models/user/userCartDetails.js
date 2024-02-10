import mongoose from "mongoose"

const addToCartSchema=new mongoose.Schema({
   products:[
      {
         productId:{
            type:String,
            required:true
         }
      }
   ]
     
})

const addToCartDetails=mongoose.model("userCartDetails",addToCartSchema);
export default addToCartDetails;
