import mongoose from "mongoose";

const userLikedSchema = new mongoose.Schema({
    products: [
        {
            productId: {
                type: String,
                required: true
            }
        }
    ]
});

const UserLikedModel = mongoose.model("userLikedDetails", userLikedSchema);

export default UserLikedModel;
