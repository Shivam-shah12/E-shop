import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config();

const connect=()=>{
    mongoose.connect(process.env.MONGODB_URL)
    .then(
        ()=>{
            console.log("Mongodb connected successfully");
        }
    )
    .catch((error)=>{
        console.log("Not connected with Mongodb");
        console.log(error);
        process.exit(1);
    })

};

export default connect;