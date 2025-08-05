import express from "express";
import {Server, Socket} from "socket.io"
import http from http ;


const app = express();
const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin:['http://localhost:5000']
    }
})


io.on("connection", (socket) =>{
    console.log(socket.id,"connected");
})


export {app, io,server}