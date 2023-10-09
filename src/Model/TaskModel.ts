import { Schema, model } from "mongoose";

const TaskModel=new Schema({
    title:{type:String,required:true},
    description:{type:String},
    Status:{type:String,required:true}
},{timestamps:true})

export default model('TaskModel',TaskModel)