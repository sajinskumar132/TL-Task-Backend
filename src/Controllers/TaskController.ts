import { RequestHandler } from "express";
import { Jwt } from "jsonwebtoken";
import { TokenAuthorization } from "../Authorization/TokenAuthorization";
import UserModel from "../Model/UserModel";
import TaskModel from "../Model/TaskModel";
import { startSession } from "mongoose";

export const GetTaskByUser:RequestHandler=async (req,res,next)=>{
    try {
        const extractedToken = req.headers.authorization?.split(" ")[1]
        if (!extractedToken && extractedToken?.trim() === "") return res.status(401).json({ message: "Token not found" })
        const token: string | undefined = extractedToken
        let Userid=TokenAuthorization.Verify(token!,res)
        if (Userid) {
            const tasks = await UserModel.findOne({_id:Userid}).populate('Tasks')
            if(tasks){
                return res.status(200).json({ data: tasks.Tasks, message: `Successfully got tasks.` })
            }else{
                return res.status(400).json({ data: tasks, message: `Failed to get tasks` })
            }
        }
    } catch (error) {
        console.log(error)
    }
}

export const CreateNewTask:RequestHandler=async (req,res,next)=>{
    const session=await startSession()
    try {
        session.startTransaction({session})
        const { title,description}=req.body
        console.log(title,description)
        const extractedToken = req.headers.authorization?.split(" ")[1]
        if (!extractedToken && extractedToken?.trim() === "") return res.status(401).json({ message: "Token not found" })
        const token: string | undefined = extractedToken
        let Userid=TokenAuthorization.Verify(token!,res)
        if (Userid) {
            const tasks = await UserModel.findOne({_id:Userid}).populate('Tasks')
            if(tasks){
                const newTask:any=new TaskModel({title,description,Status:"Open"})
                tasks.Tasks.push(newTask)
                await tasks.save({session})
                await newTask.save({session})
                return res.status(201).json({ data: newTask, message: `Sucessfully Created` })
            }else{
                return res.status(400).json({ data: tasks, message: `Userid not found` })
            }
        }
    } catch (error) {
        next(error)
    } finally{
        await session.commitTransaction()
    }
}

export const UpdateTask:RequestHandler=async (req,res,next)=>{
    try {
        const {Taskid}=req.params
        const {description,Status}=req.body
        const extractedToken = req.headers.authorization?.split(" ")[1]
        if (!extractedToken && extractedToken?.trim() === "") return res.status(401).json({ message: "Token not found" })
        const token: string | undefined = extractedToken
        let Userid=TokenAuthorization.Verify(token!,res)
        if (Userid) {
            const tasks = await UserModel.findOne({_id:Userid}).populate('Tasks')
            if(tasks){
                const UpdateTask=await TaskModel.findByIdAndUpdate(Taskid,{description,Status},{new:true})
                if(UpdateTask){
                    return res.status(200).json({ data: UpdateTask, message: `Sucessfully Updated` })
                }else{
                    return res.status(400).json({ data: UpdateTask, message: `Failed to update` })
                }
            }else{
                return res.status(400).json({ data: tasks, message: `Userid not found` })
            }
        }
    } catch (error) {
        next(error)
    }
}
export const UpdateStatus:RequestHandler=async (req,res,next)=>{
    try {
        const {Taskid}=req.params
        const {Status}=req.body
        const extractedToken = req.headers.authorization?.split(" ")[1]
        if (!extractedToken && extractedToken?.trim() === "") return res.status(401).json({ message: "Token not found" })
        const token: string | undefined = extractedToken
        let Userid=TokenAuthorization.Verify(token!,res)
        if (Userid) {
            const tasks = await UserModel.findOne({_id:Userid}).populate('Tasks')
            if(tasks){
                const UpdateTask=await TaskModel.findByIdAndUpdate(Taskid,{Status},{new:true})
                if(UpdateTask){
                    return res.status(200).json({ data: UpdateTask, message: `Sucessfully Updated` })
                }else{
                    return res.status(400).json({ data: UpdateTask, message: `Failed to update` })
                }
            }else{
                return res.status(400).json({ data: tasks, message: `Userid not found` })
            }
        }
    } catch (error) {
        next(error)
    }
}
export const DeleteTask:RequestHandler=async (req,res,next)=>{
    try {
        const {Taskid}=req.params
        const extractedToken = req.headers.authorization?.split(" ")[1]
        if (!extractedToken && extractedToken?.trim() === "") return res.status(401).json({ message: "Token not found" })
        const token: string | undefined = extractedToken
        let Userid=TokenAuthorization.Verify(token!,res)
        if (Userid) {
            const tasks = await UserModel.findOne({_id:Userid}).populate('Tasks')
            if(tasks){
                const UpdateTask=await TaskModel.findByIdAndDelete(Taskid)
                if(UpdateTask){
                    return res.status(200).json({ data: UpdateTask, message: `Sucessfully deleted` })
                }else{
                    return res.status(400).json({ data: UpdateTask, message: `Failed to delete` })
                }
            }else{
                return res.status(400).json({ data: tasks, message: `Userid not found` })
            }
        }
    } catch (error) {
        next(error)
    }
}