import mongoose from "mongoose"

const sellerProfileSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    profileImage:{
        type:String,
        default:""
    },
    createdProductDetails:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"createProduct"
    },
    sellProductDetails:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"sellProduct"
    }

})

const sellerProfile=new mongoose.model("sellerProfile",sellerProfileSchema);
export default sellerProfile;