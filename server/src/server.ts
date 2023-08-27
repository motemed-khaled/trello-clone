import express from "express";
import mongoose from "mongoose";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

import { dbConnection } from "./config/dbConnection";
import { mountRoutes } from "./routes/mount.routes";
import { globalError } from "./middleWares/globalError.middleware";
import { SocketEventEnum } from "./types/socket.enum";
import { joinBoard, leaveBoard , boardUpdate , deleteBoard } from "./controllers/board.controller";
import { createColum ,deleteColum ,updateColum} from "./controllers/colum.controller";
import { createTask , updateTask , deleteTask } from "./controllers/task.controller";
import { userModel } from "./models/user.model";
import { Socket } from "./types/socket.interface";

dbConnection();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin:"*",
    }
});

//middleware
app.use(cors());
app.options("*",cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//mount routes
mountRoutes(app);

//socket io
io.use(async (socket: Socket, next) => {
    try {
        const token = (socket.handshake.auth.token as string) ?? "";
        const data = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET!) as { id: string };
        const user = await userModel.findById(data.id);
        if (!user) {
            next(new Error("authentication error"));
            return;
        }
        socket.user = user;
        next();
    } catch (err) {
        next(new Error("authentication error"))
    }
}).on("connection", (socket) => {
    socket.on(SocketEventEnum.boardsJoin, (data) => {
        joinBoard(io, socket, data);
    });
    socket.on(SocketEventEnum.boardsLeave, (data) => {
        leaveBoard(io, socket, data);
    });
    socket.on(SocketEventEnum.columsCreate, (data) => {
        createColum(io, socket, data);
    });
    socket.on(SocketEventEnum.taskCreate, (data) => {
        createTask(io, socket, data);
    });
    socket.on(SocketEventEnum.boardsUpdate, (data) => {
        boardUpdate(io, socket, data);
    });
    socket.on(SocketEventEnum.boardsDelete, (data) => {
        deleteBoard(io, socket, data);
    });
    socket.on(SocketEventEnum.columsDelete, (data) => {
        deleteColum(io, socket, data);
    });
    socket.on(SocketEventEnum.columsUpdate, (data) => {
        updateColum(io, socket, data);
    });
    socket.on(SocketEventEnum.taskUpdate, (data) => {
        updateTask(io, socket, data);
    });
    socket.on(SocketEventEnum.taskDelete, (data) => {
        deleteTask(io, socket, data);
    });
});

//global express error
app.use(globalError)
const port = process.env.PORT || 5000;
const server =httpServer.listen(port, () => {
    console.log(`app run in port :5000`);
});

// handle error rejection outside express
process.on("unhandledRejection" , (err:Error)=>{
    console.error(`unhandledRejection : ${err.name} | ${err.message}`);
    server.close(() => {
        console.log("server shutdown");
        process.exit(1);
    })
})