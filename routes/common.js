import {Router} from 'express'
import { getSingleProduct,getWebsiteProduct } from '../controller/user/userFeatures.js';

const router=Router();

router.get("/",getWebsiteProduct);
router.post("/get_single_product",getSingleProduct);


const common=router;

export default common;