import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
name:{type:String, required:true},
nickname:{type:String, unique:true},
email:{type:String , required:true, unique:true},
password:{type:String, required:true, unique:true},
friends:[{type: mongoose.Schema.Types.ObjectId, ref:"User"}],
groups:[{type: mongoose.Schema.Types.ObjectId, ref:'Conversation'}],
bio:String,
avatarUrl :String,
isVerified:{ type:Boolean, default:false},
verificationToken:String,
verificationTokenExpires:Date,
resetPasswordToken:String,
resetPasswordExpires:Date,
lastLogin:Date,
},{timestamps:true});



export default mongoose.model("User", userSchema );
