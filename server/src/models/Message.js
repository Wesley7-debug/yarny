import mongoose from "mongoose";



const messageSchema = new mongoose.Schema({
    senderId:{ type: mongoose.Schema.Types.ObjectId, ref:"User", required:true},
    recieverId:{ type: mongoose.Schema.Types.ObjectId, ref:"User", required:true},
    image:{ type:String},
    text:{ type:String},
},{timestamps:true});

export default mongoose.model("Message", messageSchema);
