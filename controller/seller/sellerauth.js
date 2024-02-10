import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import createProductDetails from "../../models/seller/createProduct.js";
import sellerProfile from "../../models/seller/sellerProfile.js";
import sellerProduct from "../../models/seller/sellProductDetails.js";

export const signup = async (req, res) => {
  try {
    // fetch data from the user
    const { name, email, password, profileImage } = req.body;
    // validate the frontend data
    if (!name || !email || !password) {
      return res.status(404).json({
        success: false,
        message: "data is not fetched from frontend",
        name,
        email,
        password,
        profileImage,
      });
    }
    // check user Existence
    const userExistence = await sellerProfile.findOne({ email });
    if (userExistence) {
      return res.status(404).json({
        success: false,
        message: "seller is already registered",
      });
    }
    // Hash the password
    const hashpassword = await bcrypt.hash(password, 10);
    // create userbuyDetails && userLikedDetails && userCartDetails
    const sellProductDetails = await sellerProduct.create({
      allSellProductDetails: [],
    });
    const createdProductDetails = await createProductDetails.create({
      allProduct: [],
    });
    // save Details in DB
    const user = await sellerProfile.create({
      name,
      email,
      password: hashpassword,
      profileImage,
      sellProductDetails,
      createdProductDetails,
    });
    // return response
    return res.status(200).json({
      success: true,
      message: "seller signup successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(505).json({
      success: false,
      message: "seller are not able to signup ",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // validate the user credentials
    if (!email || !password) {
      return res.status(404).json({
        success: false,
        message: "seller data not fetched correctly",
      });
    }
    // check userExistence
    const userExistence = await sellerProfile
      .findOne({ email })
      .populate({
        path: "createdProductDetails",
        model: "createProduct",
      })
      .populate({
        path: "sellProductDetails",
        model: "sellProduct",
      });

    // check user was already registered or not
    if (!userExistence) {
      return res.status(404).json({
        success: false,
        message: "seller not registered",
      });
    }
    // Compare password or validate it
    if (await bcrypt.compare(password, userExistence.password)) {
      // generate jwt token
      const payload = {
        email: userExistence.email,
        name: userExistence.name,
        _id: userExistence._id,
      };
      // Create Token
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "8h",
      });
      userExistence.password = undefined;

      const options = {
        expiresIn: new Date(Date.now() * 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      // return response
      return res.cookie("token", token, options).status(200).json({
        success: true,
        message: "user logged in successfully",
        userExistence,
        token,
      });
    }
    return res.status(505).json({
      success: false,
      message: "error in password",
    });
  } catch (error) {
    console.log(error);
    return res.status(505).json({
      success: false,
      message: "error in login page",
    });
  }
};

export const changePassword = async (req, res) => {
  const { email, oldPassword, newPassword, confirmNewPassword } = req.body;
  // validate Frontend Credentials
  if (!email || !oldPassword) {
    return res.status(403).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const checkUser = await sellerProfile.findOne({ email: email }).exec();

    if (
      !checkUser ||
      !(await bcrypt.compare(oldPassword, checkUser.password))
    ) {
      return res.status(404).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm password do not match",
      });
    }

    // Hash the new password before saving
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    checkUser.password = hashedPassword;

    await checkUser.save();
    // return response
    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
