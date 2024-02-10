import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userProfile from "../../models/user/userProfile.js";
import userBuyDetails from "../../models/user/userBuyDetails.js";
import addToCartDetails from "../../models/user/userCartDetails.js";
import UserLikedModel from "../../models/user/userLikedDetails.js";

export const signup = async (req, res) => {
  try {
    // fetch data from the user
    const { name, email, password, profileImage } = req.body;
    console.log(req.body);
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
    const userExistence = await userProfile.findOne({ email });
    if (userExistence) {
      return res.status(404).json({
        success: false,
        message: "user is already registered",
      });
    }
    // Hash the password
    const hashpassword = await bcrypt.hash(password, 10);
    const userBuyDetail = await userBuyDetails.create({ allBuyProduct: [] });
    const addToCartDetail = await addToCartDetails.create({ products: [] });
    const allLikedProduct = await UserLikedModel.create({
      allLikedProduct: [],
    });
    // create userbuyDetails && userLikedDetails && userCartDetails
    const user = await userProfile.create({
      name,
      email,
      password: hashpassword,
      profileImage,
      userBuyDetails: userBuyDetail,
      userCartDetails: addToCartDetail,
      userLikedDetails: allLikedProduct,
    });
    // return response
    return res.status(200).json({
      success: true,
      message: "User signup successfully",
      user,
    });
  } catch (error) {
    // console.log(error);
    return res.status(505).json({
      success: false,
      message: "user are not able to signup ",
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
        message: "user data not fetched correctly",
      });
    }
    // check userExistence
    const userExistence = await userProfile
      .findOne({ email })
      .populate({
        path: "userCartDetails",
        model: "userCartDetails",
      })
      .populate({
        path: "userBuyDetails",
        model: "userBuyDetails",
      })
      .populate({
        path: "userLikedDetails",
        model: "userLikedDetails",
      });

    if (!userExistence) {
      return res.status(404).json({
        success: false,
        message: "User not registered",
      });
    }

    if (await bcrypt.compare(password, userExistence.password)) {
      // generate jwt token
      const payload = {
        email: userExistence.email,
        name: userExistence.name,
        _id: userExistence._id,
      };
      // create Token
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "3h",
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
    } else {
      // Incorrect password
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }
  } catch (error) {
    // console.log(error);
    return res.status(505).json({
      success: false,
      message: "error in login page",
    });
  }
};

export const changePassword = async (req, res) => {
  const { email, newPassword, confirmNewPassword } = req.body;

  if (!email || !newPassword || !confirmNewPassword) {
    return res.status(403).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const checkUser = await userProfile.findOne({ email: email }).exec();

    if (!checkUser) {
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

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    // console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
