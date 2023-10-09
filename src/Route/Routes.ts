import express from "express"
import { Login, SignUp } from "../Controllers/UserController"
import { CreateNewTask, DeleteTask, GetTaskByUser, UpdateStatus, UpdateTask } from "../Controllers/TaskController"
const Routes=express.Router()

Routes.post('/login',Login)
Routes.post('/signUp',SignUp)

Routes.get('/tasks',GetTaskByUser)
Routes.post('/newTask',CreateNewTask)
Routes.put('/:Taskid/updateTask',UpdateTask)
Routes.put('/:Taskid/updateStatus',UpdateStatus)
Routes.delete('/:Taskid/deleteTask',DeleteTask)
export default Routes