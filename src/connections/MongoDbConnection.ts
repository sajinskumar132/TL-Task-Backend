import { connect } from "mongoose"

export const DbConnect=async (url:string)=>{
    try {
        await connect(url).then(()=>{
            console.log('dbconnected')
        }).catch((error)=>{
            console.log(error)
        })
    } catch (error) {
        console.log(error)
    }
}