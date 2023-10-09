import {Response } from 'express'
import jwt from 'jsonwebtoken'
export class TokenAuthorization{
    static Verify=(token:string,res:Response)=>{
        let Userid
        jwt.verify(token!, process.env.TokenKey!, (err: any, decrypt: any) => {
            if (err) {
                return res.status(401).json({ data: null, message: `${err.message}` })
            } else {
                Userid=decrypt.id
            }
        })
        return Userid
    }
}