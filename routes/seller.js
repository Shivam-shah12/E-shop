import { Router } from "express";
import { login,signup,changePassword } from '../controller/seller/sellerauth.js';
import {createProduct,deleteProduct,getSellDetail,getAllMyProduct,getProduct} from "../controller/seller/sellerFeatures.js"
import {verify} from "../middlewares/verify.js"

const router=Router();


// common api

router.post("/login",login);
router.post("/signup",signup);
router.post("/changePassword",changePassword);

// Feature api
router.post("/createProduct",verify,createProduct);
router.post("/getMyProduct",verify,getAllMyProduct);
router.post("/getSellDetail",verify,getSellDetail);
router.post("/deleteProduct",verify,deleteProduct);
router.get("/getproduct",getProduct);


const seller=router;
export default seller;