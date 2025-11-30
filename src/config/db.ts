import mongoose from "mongoose";

export const dbConnect = async () => {
   try{
        const DB_URI = process.env.MONGO_URI as string;
        await mongoose.connect(DB_URI);
        console.log(`Connected SuccessFully`)
     }catch(error){
            throw new Error(`Something Went Wrong ${error}`)
     }
}