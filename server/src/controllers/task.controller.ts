import asyncHandler from "express-async-handler";
import { NextFunction, Response } from "express";
import { ExpressRequestInterface } from "../types/expressRequest.interface";
import { Server } from "socket.io";

import { taskModel } from "../models/task.model";
import { ApiError , getErrorMessage } from "../utils/api-error";
import { Socket } from "../types/socket.interface";
import { SocketEventEnum } from "../types/socket.enum";


export const getTasks = asyncHandler(async (req: ExpressRequestInterface, res: Response, next: NextFunction) => {
    const tasks = await taskModel.find({ boardId: req.params.boardId });
    res.status(200).json(tasks);
});

export const createTask = async (io: Server, socket: Socket, data: { boardId: string; title: string, columId: string }) => {
    try {
        if (!socket.user) {
            socket.emit(SocketEventEnum.taskCreateFailure, "user not authenticated");
            return;
        }

        const task = await taskModel.create(
            {
                title: data.title,
                boardId: data.boardId,
                userId: socket.user.id,
                columId: data.columId
            }
        );
        io.to(data.boardId).emit(SocketEventEnum.taskCreateSuccess, task);
    } catch (err) {
        socket.emit(SocketEventEnum.taskCreateFailure, getErrorMessage(err));
    }
};

export const updateTask =async (io: Server, socket: Socket, data: { boardId: string ,taskId:string , fields:{title?:string , description?:string , columId?:string} }) => {
    try {
      if (!socket.user) {
        socket.emit(SocketEventEnum.taskUpdateFailure, "user not authenticated");
        return;
      }
      const task = await taskModel.findByIdAndUpdate(data.taskId, data.fields, { new: true });
      io.to(data.boardId).emit(SocketEventEnum.taskUpdateSuccess, task);
    } catch (err) {
      socket.emit(SocketEventEnum.taskUpdateFailure, getErrorMessage(err));
    }
}
  
export const deleteTask = async (io: Server, socket: Socket, data: { boardId: string, taskId: string }) => {
    try {
      if (!socket.user) {
        socket.emit(SocketEventEnum.taskDeleteFailure, "user not authenticated");
        return;
      }
      const task = await taskModel.findByIdAndDelete(data.taskId);
      io.to(data.boardId).emit(SocketEventEnum.taskDeleteSuccess, data.taskId);
    } catch (err) {
      socket.emit(SocketEventEnum.taskDeleteFailure, getErrorMessage(err));
    }
  };