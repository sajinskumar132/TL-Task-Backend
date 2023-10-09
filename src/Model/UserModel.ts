import { Schema, model } from "mongoose";

const UserModel=new Schema({
    userName:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true,minlength:6},
    Tasks:[{type:Schema.Types.ObjectId,ref:'TaskModel'}]
})

export default model("UserModel",UserModel)