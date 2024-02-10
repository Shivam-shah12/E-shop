import createProductDetails from '../../models/seller/createProduct.js';
import sellerProfile from '../../models/seller/sellerProfile.js';
import sellerProduct from '../../models/seller/sellProductDetails.js';
import websiteProductDetails from '../../models/websiteProduct.js';


export const createProduct = async (req, res) => {
  try {

    const { productName, productPrice, productDescription, productImage, sellerId, category } = req.body;
    // validate Frontend Details
    if (!productName || !productPrice || !productDescription || !productImage || !sellerId  || !category) {
      console.log(productName, productPrice, productDescription, productImage, sellerId, category);
      return res.status(400).json({
        success: false,
        message: "All details not sent to the backend",
      });
    }
     
    // Fetch Seller Details
    const sellerDetails = await sellerProfile.findById(sellerId).exec();

    
    // Add the product to the seller's createdProductDetails
    const createdProduct = {
      productName,
      productPrice,
      productDescription,
      productImage,
      category,
   // Add a custom identifier to the product
    };
    // console.log(createdProduct)
    const id=sellerDetails.createdProductDetails;
    const {allProduct}=await createProductDetails.findByIdAndUpdate(
      { _id: id },
      { $push: { allProduct:  createdProduct } },
      { new: true }
    );
    // console.log(allProduct);
    const lastElement=allProduct[allProduct.length-1];
    // Add the product to the websiteProductDetails
    const websiteProduct = {
      productName,
      productPrice,
      productDescription,
      productImage,
      category,
      sellerId,
      productRef:lastElement._id // Use the same custom identifier
    };
    // console.log(websiteProduct)
    await websiteProductDetails.create(websiteProduct);
    

    // return response
    return res.status(200).json({
      success: true,
      message: "Product created successfully",
    });

  } catch (error) {
    // console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error in creating Product",
      error: error.message,
    });
  }
};


export const deleteProduct = async (req, res) => {
  try {
      const { productId, sellerId } = req.body;
      // validate Credentials
      if (!productId || !sellerId) {
          return res.status(400).json({
              success: false,
              message: "productId was not provided",
          });
      }

      // fetch userDetails
      const userDetails = await sellerProfile.findById(sellerId);
      const productInfo=await websiteProductDetails.findById(productId);
      // now fetch createProductDetailsId
      const productDetailId = userDetails.createdProductDetails;

      const result = await createProductDetails.findOneAndUpdate(
        { _id: productDetailId },
        { $pull: { allProduct: { _id: productInfo.productRef } } },
        { new: true }
    );
    await websiteProductDetails.findOneAndUpdate(
      { _id: productDetailId },
        { $pull:  { _id: productId  } },
        { new: true }
    )
    
    if (!result) {
        return res.status(404).json({
            success: false,
            message: "Product not found",
        });
    }
    // return response
    return res.status(200).json({
        success: true,
        message: "Product deleted successfully",
        allProduct: result.allProduct,
    });
  }catch(error)
  {
    // console.log(error)
    return res.status(505).json({
      success:false,
      message:"product not deleted"
    })
  }  }    


export const getSellDetail = async (req, res) => {
  try {
 
    const {sellerId}  = req.body;
     // validate Frontend Credentials
    if(!sellerId)
    {
      return res.status(404).json({
        success:false,
        message:"not get Required Details"
      })
    }

    const userDetails = await sellerProfile.findById(sellerId);
    const sellDetailId=userDetails.sellProductDetails;
    console.log(userDetails)
    const {allSellProductDetails}=await sellerProduct.findById(sellDetailId).exec();
    console.log(allSellProductDetails)
    
    if(!allSellProductDetails)
    return res.status(404).json({
    success:false,
    message:"error in getSellDetails"
    })
  
    // return response
    return res.status(200).json({
      success: true,
      message: "Get sell product details successfully",
      allSellProductDetails
    });
  } catch (error) {
    // console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error in getSellDetails"
    });
  }
};

export const getAllMyProduct=async(req,res)=>{
  try {
    const {sellerId}=req.body;
    const sellerDetails=await sellerProfile.findById(sellerId);
    const id=sellerDetails.createdProductDetails;
    const {allProduct}=await createProductDetails.findById(id).exec();
    return res.status(200).json({
      success:true,
      message:"successfully sent allProduct details of seller",
      allProduct
    })

    
  } catch (error) {
    // console.log(error)
    return res.status(505).json({
      success:false,
      message:"error in getallMyProduct"
    })
    
  }

}



//easy way to insert all product
export const getProduct = async (req, res) => {
  try {
    const { arr } = req.body;
    const sellerId = req.body.sellerId;
    // console.log(arr)

    for (const productData of arr) {
      const {
        productName,
        productPrice,
        productDescription,
        productImage,
        category,
        TotalLiked = 0,
      } = productData;

      const obj = {
        productName,
        productPrice,
        productDescription,
        productImage,
        category,
        TotalLiked,
      };

      const sellerDetails = await sellerProfile.findById(sellerId).exec();

      if (!sellerDetails.createdProductDetails) {
        sellerDetails.createdProductDetails = await createProductDetails.create(obj);
        await sellerDetails.save();
      }
      else
      { 
        const productId = sellerDetails.createdProductDetails;
        const allProductDetails=await createProductDetails.findById(productId);
        allProductDetails.allProduct.push({
          productName,
          productPrice,
          productDescription,
          productImage,
          category,
          TotalLiked
        })
        await allProductDetails.save();
        const b=allProductDetails.allProduct
        const id=b[b.length-1]._id
        // console.log(id)
        await websiteProductDetails.create({
          productName,
          productPrice,
          productDescription,
          productImage,
          category,
          sellerId,
          productRef:id
        });
        

      }
       
    }
    return res.status(200).json({
      success: true,
      message: "Product created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in getProduct API",
    });
  }
};