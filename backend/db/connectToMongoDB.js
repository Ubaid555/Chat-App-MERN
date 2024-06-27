import mongoose from "mongoose";

const connectToMongoDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONOGO_DB_URL);
        console.log("Connected To  Mongo Db")
        
    } catch (error) {
        console.log("Error Connecting to MongoDb",error.message);
    }
}

export default connectToMongoDB