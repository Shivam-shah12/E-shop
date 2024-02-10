import mongoose from "mongoose"

const websiteProductSchema=new mongoose.Schema({
    productName:{
        type:String,
        required:true
    },
    productPrice:{
        type:Number,
        required:true
    },
    productDescription:{
        type:Object,
        required:true
    },
    productImage:{
        type:Array,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    TotalLiked:{
      type:Number,
      required:true,
      default:0
    },
    sellerId:{
     type:String,
     required:true
    },
    productRef:{
        type:String,
        required:true
    },
    createDate:{
        type:"Date",
        default:Date.now()
    }

});

const websiteProductDetails=new mongoose.model("websiteProduct",websiteProductSchema);
export default websiteProductDetails;