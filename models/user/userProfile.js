import mongoose from "mongoose"

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
     },
     email:{
        type:String,
        required:true
     },
     password:{
        type:String,
        required:true,
        minlength:[6]
     },
     profileImage:{
      type:String,
      default:""
     },
     userCartDetails:{
      type:mongoose.Schema.Types.ObjectId,
        ref:"userCartDetails"
     },
     userBuyDetails:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"userBuyDetails"
     },
     userLikedDetails:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"userLikedDetails"
     },
     saveAddress:{
      type:Array,
      default:[]
     }
})

const userProfile=mongoose.model("userProfile",userSchema);
export default userProfile;