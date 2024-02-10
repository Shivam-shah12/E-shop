import { Router } from "express"
import { login,signup,changePassword } from '../controller/user/userauth.js';
import { addToCart,removeFromCart,likedProduct,removeLikedProduct,buyProduct,
    saveAddress,saveImage,getUserBuyDetail,getCartDetails,getLikedDetails} from '../controller/user/userFeatures.js';
import { verify } from "../middlewares/verify.js";
const router=Router();


// common routes
router.post("/login",login);
router.post("/signup",signup);


// features --> 
router.post("/changePassword",verify,changePassword);
router.post("/likedProduct",verify,likedProduct);
router.post("/removeLike",verify,removeLikedProduct);
// --> -------------------------------------------------
router.post("/saveAddress",verify,saveAddress)
router.post("/saveImage",verify,saveImage);
router.post("/getUserBuyDetail",verify,getUserBuyDetail);
router.post("/buyedProduct",verify,buyProduct);
// --> -------------------------------------------------
router.post("/addToCart",verify,addToCart);
router.post("/removeToCart",verify,removeFromCart);
router.post("/getLikedDetails",verify,getLikedDetails)
router.post("/getCartDetails",verify,getCartDetails);

const user=router;

export default  user;