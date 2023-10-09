import { RequestHandler } from "express";
import TaskModel from "../Model/TaskModel";
import {compareSync, hashSync} from 'bcryptjs'
import UserModel from "../Model/UserModel";
import Jwt from 'jsonwebtoken'
export const SignUp:RequestHandler=async (req,res,next)=>{
    try {
        const {userName,email,password}=req.body
        const existingUser=await UserModel.findOne({email})
        if(existingUser) return res.status(400).json({message:`User with the email address ${email}  already exists.`,data:null})

        const errors = []
        if (!userName) {
          errors.push("User name is required.");
        }
        if (!email) {
          errors.push("Email address is required.");
        }
        if (!password) {
          errors.push("Password is required.");
        }

        if (errors.length > 0) return res.status(400).json({message:errors.toString(),data:null})
        if(password.length<6) return res.status(400).json({message:"The password length should be a minimum of 6 characters.",data:null})
        const encryptPassword=hashSync(password)
        const newUser= new UserModel({userName,email,password:encryptPassword})
        await newUser.save()
       
        if(newUser){
            const token=Jwt.sign({id:newUser._id},process.env.TokenKey!,{expiresIn:"7D"})
            const responseData={
                id:newUser._id,
                userName:newUser.userName,
                email:newUser.email,
                token:token
            }
            return res.status(201).json({message:"Signup Successfully",data:responseData})
        }else{
            return res.status(500).json({message:"Failed to Signup"})
        }
    } catch (error) {
        next(error)
    }
}

export const Login:RequestHandler=async (req,res,next)=>{
    try {
        const {email,password}=req.body
        console.log('executed')
        const existingUser=await UserModel.findOne({email})
        if(!existingUser) return   res.status(400).json({message:`User with the email address ${email} not found`,data:null})
        const decryptPassword=compareSync(password,existingUser!.password)
        if(!decryptPassword) res.status(400).json({message:"Wrong Password",data:null})
        console.log('executed')
        const token=Jwt.sign({id:existingUser._id},process.env.TokenKey!,{expiresIn:"7D"})
        const responseData={
                id:existingUser._id,
                userName:existingUser.userName,
                email:existingUser.email,
                token:token
        }
        return res.status(200).json({message:"Login Successfully", data:responseData})
    } catch (error) {
        next(error)
    }
}