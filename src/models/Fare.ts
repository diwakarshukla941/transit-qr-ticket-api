import { timeStamp } from "console";
import mongoose from "mongoose";

const fareSchema = new mongoose.Schema({
    sourceId:{
        type:Number,
        required:true,
    },
    destinationId:{
        type:Number,
        required:true
    },
    source:{
        type:String,
        required:true
    },
    destination:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    }
}, {timestamps:true})
 
export const fareModel = mongoose.model("Fare", fareSchema);