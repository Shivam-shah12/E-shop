import dotenv from "dotenv";
import jwt from "jsonwebtoken";

export const verify = (req, res, next) => {
  try {
    const authHeader = req.body.token;
    const token = authHeader;

    if (!token) {
      return res.status(404).json({
        success: false,
        message: "INVALID_TOKEN",
      });
    }
    // console.log(token)
    // verify the token
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.payload = decode;
      next();
    } catch (error) {
      console.log(error);
      return res.status(403).json({
        success: false,
        message: "INVALID_TOKEN",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in auth middleware",
    });
  }
};
