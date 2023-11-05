import mongoose from "mongoose";
import pkg from "colors";
const initDb = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URl);
        console.log(`Connected to MongoDB ${connect.connection.host}`.bgGreen.white);
    } catch (error) {
        console.log(`Error in MongoDB ${error}`.bgRed.white)
    }
}

export default initDb;