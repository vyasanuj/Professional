import mongoose from 'mongoose';
import { DB_NAME } from "../constants.js";

const connectDb = async ()=>{
    try {
        const connectioninstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log (`\n MONGODB CONNECTED !! DB_HOST:${connectioninstance.connection.host}`);
    } catch (error) {
        console.error("MONGODB CONNECTION ERROR",error);
        process.exit(1)  
    }
}

export default connectDb 