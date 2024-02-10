import addToCartDetails from "../../models/user/userCartDetails.js";
import UserLikedModel from "../../models/user/userLikedDetails.js";
import userProfile from "../../models/user/userProfile.js";
import userBuyDetails from "../../models/user/userBuyDetails.js";
import sellerProduct from "../../models/seller/sellProductDetails.js";
import sellerProfile from "../../models/seller/sellerProfile.js";
import websiteProductDetails from "../../models/websiteProduct.js";
import createProductDetails from "../../models/seller/createProduct.js";

export const addToCart = async (req, res) => {
  try {
    const { productId, userId } = req.body;
    // validate Frontend Credentials
    if (!userId || !productId) {
      return res.status(404).json({
        success: false,
        message: "fields are required",
      });
    }
    const user = await userProfile.findById(userId).populate({
      path: "userCartDetails",
      ref: "userCartDetails",
    });
    // console.log(user);

    // Check if the product is already in the user's cart
    if (user.userCartDetails.products.includes(productId)) {
      return res.status(400).json({
        success: false,
        message: "Product is already in the cart",
        user,
      });
    }

    const userCartDetailId = user.userCartDetails._id;
    const updatedCart = await addToCartDetails.findByIdAndUpdate(
      { _id: userCartDetailId },
      { $push: { products: { productId: productId } } },
      { new: true }
    );

    // return response
    return res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      updatedCart,
    });
  } catch (error) {
    // console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to add product to cart",
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    // Extract data from the request, e.g., product ID
    const { productId, userId } = req.body;
    // validate Frontend Credentials
    if (!userId || !productId) {
      return res.status(404).json({
        success: false,
        message: "fields are required",
      });
    }
    // Find the user by ID or any unique identifier
    const user = await userProfile.findById(userId);

    // Check if the user has a cart
    if (!user.userCartDetails) {
      return res.status(400).json({
        success: false,
        message: "User does not have a cart",
      });
    }
    const id = user.userCartDetails;
    const updateCart = await addToCartDetails.findByIdAndUpdate(
      { _id: id },
      { $pull: { products: { productId: productId } } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Product removed from cart successfully",
      updateCart,
    });
  } catch (error) {
    // console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to remove product from cart",
    });
  }
};

export const likedProduct = async (req, res) => {
  try {
    const { productId, userId } = req.body;
    // console.log(productId,userId)
    if (!userId || !productId) {
      return res.status(404).json({
        success: false,
        message: "fields are required",
      });
    }
    // Create a userLikedDetails object if it doesn't exist
    const user = await userProfile.findById(userId).populate({
      path: "userLikedDetails",
      ref: "userLikedDetails",
    });
    // console.log(user);
    if (!user.userLikedDetails) {
      user.userLikedDetails = await UserLikedModel.create({ products: [] });
    }
    const productInfo=await websiteProductDetails.findById(productId)
    // Check if the product is already liked by the user
    if (user.userLikedDetails.products.includes(productInfo.productRef)) {
      return res.status(400).json({
        success: false,
        message: "Product is already liked",
        user,
      });
    }

    const userLikedId = user.userLikedDetails._id;
    const allLikeProduct = await UserLikedModel.findByIdAndUpdate(
      { _id: userLikedId },
      { $push: { products: { productId: productInfo.productRef } } },
      { new: true }
    );
    const product = await websiteProductDetails.findOne({ _id: productId });
    if (product) {
      const TotalLiked = product.TotalLiked || 0;

      try {
        const result = await websiteProductDetails
          .updateOne(
            { _id: productId },
            { $set: { TotalLiked: TotalLiked + 1 } }
          )
          .exec();
        // console.log(result);
      } catch (err) {
        // console.error(err);
        return res.status(505).json({
          success:false,
          message:"error in backend"
        })
      }
    }

    return res.status(200).json({
      success: true,
      message: "Product liked successfully",
      allLikeProduct,
    });
  } catch (error) {
    // console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to like the product",
    });
  }
};

export const removeLikedProduct = async (req, res) => {
  try {
    const { productId, userId } = req.body;
    if (!userId || !productId) {
      return res.status(404).json({
        success: false,
        message: "fields are required",
      });
    }
    const user = await userProfile.findById(userId);

    // Check if the user has liked products
    if (!user.userLikedDetails) {
      return res.status(400).json({
        success: false,
        message: "User has no liked products",
        user,
      });
    }
    const productInfo=await websiteProductDetails.findById(productId)
    // Remove the product from the liked products
    const id = user.userLikedDetails;
    const updateLiked = await UserLikedModel.findByIdAndUpdate(
      { _id: id },
      { $pull: { products: { productId: productInfo.productRef } } },
      { new: true }
    );
    // return response
    return res.status(200).json({
      success: true,
      message: "Product removed from liked products successfully",
      updateLiked,
    });
  } catch (error) {
    // console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to remove product from liked products",
    });
  }
};

// saveAddress,saveImage,getUserBuyDetail
export const saveAddress = async (req, res) => {
  try {
    const { userId, addresses } = req.body;
    if (!userId) {
      return res.status(404).json({
        success: false,
        message: "error in saveAddress",
      });
    }

    const userDetails = await userProfile.findById(userId);
    userDetails.saveAddress = [...addresses];
    await userDetails.save();
    return res.status(200).json({
      success: true,
      message: "saveAddress successfully",
      userDetails,
    });
  } catch (error) {
    // console.log(error);
    return res.status(505).json({
      success: false,
      message: error.message,
    });
  }
};

export const saveImage = async (req, res) => {
  try {
    const { userId, profileImage } = req.body;
    if (!userId) {
      return res.status(404).json({
        success: false,
        message: "error in profileImage",
      });
    }

    const userDetails = await userProfile.findById(userId);
    userDetails.profileImage = profileImage;
    await userDetails.save();
    return res.status(200).json({
      success: true,
      message: "profileImage successfully",
      userDetails,
    });
  } catch (error) {
    // console.log(error);
    return res.status(505).json({
      success: false,
      message: error.message,
    });
  }
};

export const buyProduct = async (req, res) => {
  try {
    // product details fetch karo and userId from token
    console.log("buyProduct");
    const {
      productName,
      productPrice,
      productQuantity,
      productDescription,
      sellerId,
      userId,
    } = req.body.allData;
    if (
      !productName ||
      !productPrice ||
      !productQuantity ||
      !productDescription ||
      !sellerId ||
      !userId
    ) {
      return res.status(404).json({
        success: false,
        message: "not get required details",
      });
    }

    // userDetail fetch
    const userDetails = await userProfile.findById(userId);
    // Create a userCartDetails object if it doesn't exist
    if (!userDetails.userBuyDetails) {
      userDetails.userBuyDetails = await userBuyDetails.create({
        allBuyProduct: [],
      });
    }

    // push new product Details in db
    const obj = {
      productName,
      productPrice,
      productQuantity,
      productDescription,
      sellerId,
    };
    const userBuyId = userDetails.userBuyDetails;
    const user_Buy_Detail = await userBuyDetails.findByIdAndUpdate(
      { _id: userBuyId },
      {
        $push: { allBuyProduct: [obj] },
      },
      { new: true }
    );
    // simillarly fetch  sellerId
    const sellerDetails = await sellerProfile.findById(sellerId);
    if (!sellerDetails.sellProductDetails) {
      sellerDetails.sellProductDetails = await sellerProduct.create({
        allSellProductDetails: [],
      });
    }
    // console.log(sellerDetails);

    const { allProduct } = await createProductDetails
      .findById(sellerDetails.createdProductDetails)
      .exec();
    // console.log(allProduct)
    const req_product = allProduct.filter(
      (eachProduct) =>
        eachProduct.productName === productName &&
        eachProduct.productDescription.text === productDescription.text &&
        eachProduct.productPrice === productPrice
    );
    // console.log(req_product);
    const sellobj = {
      userId,
      productId: req_product[0]._id,
      totalItem: productQuantity,
    };
    const sellBuyId = sellerDetails.sellProductDetails;
    const seller_Buy_Detail = await sellerProduct.findByIdAndUpdate(
      { _id: sellBuyId },
      {
        $push: { allSellProductDetails: [sellobj] },
      },
      { new: true }
    );
    // console.log(user_Buy_Detail, seller_Buy_Detail);
    // if all is perfect then return response
    return res.status(200).json({
      success: true,
      message: "buy Details successfully",
    });
  } catch (error) {
    // console.log(error);
    return res.status(500).json({
      success: false,
      message: "error in buyProduct component",
    });
  }
};

export const getUserBuyDetail = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(404).json({
        success: false,
        message: "error in getUserBuyDetails",
      });
    }
    const userDetails = await userProfile.findById(userId);
    const buyDetailId = userDetails.userBuyDetails;
    const { allBuyProduct } = await userBuyDetails.findById(buyDetailId).exec();
    // console.log(allBuyProduct);
    return res.status(200).json({
      success: true,
      message: "getbuyProduct successfully",
      allBuyProduct,
    });
  } catch (error) {
    // console.log(error);
    return res.status(505).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCartDetails = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(404).json({
        success: false,
        message: "error in getUserBuyDetails",
      });
    }
    const userDetails = await userProfile.findById(userId);
    const cartId = userDetails.userCartDetails;
    const { products } = await addToCartDetails.findById(cartId).exec();
    return res.status(200).json({
      success: true,
      message: "getbuyProduct successfully",
      products,
    });
  } catch (error) {
    // console.log(error);
    return res.status(505).json({
      success: false,
      message: error.message,
    });
  }
};

export const getLikedDetails = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(404).json({
        success: false,
        message: "error in getUserBuyDetails",
      });
    }
    const userDetails = await userProfile.findById(userId);
    const likedId = userDetails.userLikedDetails;
    const { products } = await UserLikedModel.findById(likedId).exec();
    return res.status(200).json({
      success: true,
      message: "getbuyProduct successfully",
      products,
    });
  } catch (error) {
    // console.log(error);
    return res.status(505).json({
      success: false,
      message: error.message,
    });
  }
};

export const getWebsiteProduct = async (req, res) => {
  try {
    const allProducts = await websiteProductDetails.find().maxTimeMS(50000);

    // Assuming you want to send the merged products as a JSON response
    return res.status(200).json({ success: true, allProducts });
  } catch (error) {
    // console.error("Error fetching products:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

export const getSingleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    // console.log(req.body)
    const getProduct = await websiteProductDetails.findById(productId).exec();
    // console.log(getProduct)
    if (getProduct) {
      return res.status(200).json({
        success: true,
        message: "get Single product Successfully",
        getProduct,
      });
    }
    return res.status(500).json({ success: false, error: "Unable to fetch data" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

