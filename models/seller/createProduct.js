import mongoose from "mongoose"

const createProductSchema=new mongoose.Schema({
    allProduct:[{
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
    createDate:{
        type:"Date",
        default:Date.now()
    }
}
]

});

const createProductDetails=new mongoose.model("createProduct",createProductSchema);
export default createProductDetails;