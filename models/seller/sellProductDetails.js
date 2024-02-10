import mongoose from "mongoose"

const sellProductSchema=new mongoose.Schema({
   allSellProductDetails:[
    {
        userId:{
            type:String,
            required:true
        },
        productId:{
            type:String,
            required:true
        },
        totalItem:{
            type:Number,
            required:true,
        },
    }

   ] 
})

const sellerProduct=new mongoose.model("sellProduct",sellProductSchema)
export default sellerProduct;