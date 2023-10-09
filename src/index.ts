import express from 'express'
import { DbConnect } from './connections/MongoDbConnection'
import { config } from 'dotenv'
import Routes from './Route/Routes'
config()

const app=express()

app.use(express.json())

app.use('/',Routes)

const Server=()=>{
  try {
    DbConnect(process.env.ConnectionUrl!).then(()=>{
        app.listen((process.env.Port),()=>{
            console.log("Server started")
        })
    })
  } catch (error) {
    console.log(error)
  }
}

Server()