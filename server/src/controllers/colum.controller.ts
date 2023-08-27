import asyncHandler from "express-async-handler";
import { NextFunction, Response } from "express";
import { ExpressRequestInterface } from "./../types/expressRequest.interface";
import { Server } from "socket.io";

import { columModel } from "../models/colum.model";
import { ApiError , getErrorMessage } from "../utils/api-error";
import { Socket } from "../types/socket.interface";
import { SocketEventEnum } from "../types/socket.enum";

export const getColums = asyncHandler(async (req: ExpressRequestInterface, res: Response, next: NextFunction) => {
    const colums = await columModel.find({ boardId: req.params.boardId });
    res.status(200).json(colums);
});

export const createColum = async(io: Server, socket: Socket, data: { boardId: string; title:string }) => {
    try {
        if (!socket.user) {
            socket.emit(SocketEventEnum.columsCreateFailure, "user not authenticated");
            return;
        }

        const colum = await columModel.create(
            {
                title: data.title,
                boardId: data.boardId,
                userId: socket.user.id
            }
        );
        io.to(data.boardId).emit(SocketEventEnum.columsCreateSuccess, colum);
        console.log("saved colum" , colum)
    } catch (err) {
        socket.emit(SocketEventEnum.columsCreateFailure, getErrorMessage(err));
    }
}

export const deleteColum = async (io: Server, socket: Socket, data: { boardId: string, columId: string }) => {
  try {
    if (!socket.user) {
      socket.emit(SocketEventEnum.columsDeleteFailure, "user not authenticated");
      return;
    }
    const colum = await columModel.findByIdAndDelete(data.columId);
    io.to(data.boardId).emit(SocketEventEnum.columsDeleteSuccess, data.columId);
  } catch (err) {
    socket.emit(SocketEventEnum.columsDeleteFailure, getErrorMessage(err));
  }
};
  
export const updateColum = async (io: Server, socket: Socket, data: { boardId: string, columId: string, fields: { title: string } }) => {
  try {
    if (!socket.user) {
      socket.emit(SocketEventEnum.columsUpdateFailure, "user not authenticated");
      return;
    }
    const colum = await columModel.findByIdAndUpdate(data.columId, { title: data.fields.title }, { new: true });
    io.to(data.boardId).emit(SocketEventEnum.columsUpdateSuccess, colum);
  } catch (err) {
    socket.emit(SocketEventEnum.columsUpdateFailure, getErrorMessage(err));
  }
};