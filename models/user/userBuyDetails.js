import mongoose from "mongoose"

const userBuySchema=new mongoose.Schema({
   allBuyProduct:[
    {
        productName:{
            type:String,
            required:true
        },
        productPrice:{
            type:Number,
            required:true
        },
        productQuantity:{
            type:Number,
            required:true
        },
        productDescription:{
            type:Object,
            required:true
        },
        purchasingDate:{
            type: Date,
        default: Date.now,
        },
        sellerId:{
            type:String,
            required:true
        }
    }
   ]
})

const userBuyDetails=new mongoose.model("userBuyDetails",userBuySchema)
export default userBuyDetails;