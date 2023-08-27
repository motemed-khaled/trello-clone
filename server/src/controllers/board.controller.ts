import asyncHandler from "express-async-handler";
import { NextFunction, Response } from "express";
import { Server } from "socket.io";

import { boardModel } from "../models/board.model";
import { ApiError, getErrorMessage } from "../utils/api-error";
import { ExpressRequestInterface } from "./../types/expressRequest.interface";
import { Socket } from "../types/socket.interface";
import { SocketEventEnum } from "../types/socket.enum";

export const getUserBoards = asyncHandler(
  async (req: ExpressRequestInterface, res: Response, next: NextFunction) => {
    const boards = await boardModel.find({ userId: req.user?.id });

    if (!boards) {
      next(new ApiError("no boards for this user...", 404));
      return;
    }
    res.status(200).json(boards);
  }
);

export const createBoard = asyncHandler(async (req: ExpressRequestInterface, res: Response, next: NextFunction) => {
  const board = await boardModel.create({ title: req.body.title, userId: req.user?.id });
  res.status(200).json(board);
});

export const getBoard = asyncHandler(async (req: ExpressRequestInterface, res: Response, next: NextFunction) => {
  const board = await boardModel.findById(req.params.id);
  if (!board) {
    next(new ApiError(`no board in this id : ${req.params.id}`, 404));
    return;
  }

  res.status(200).json(board);
});


export const joinBoard = (io: Server, socket: Socket, data: { boardId: string }) => {
  console.log("server socket io join ", socket.user);
  socket.join(data.boardId);
}

export const leaveBoard = (io: Server, socket: Socket, data: { boardId: string }) => {
  console.log("server socket io leave ", socket.user);
  socket.leave(data.boardId);
}

export const boardUpdate =async (io: Server, socket: Socket, data: { boardId: string , fields:{title:string} }) => {
  try {
    if (!socket.user) {
      socket.emit(SocketEventEnum.boardsUpdateFailure, "user not authenticated");
      return;
    }
    const board = await boardModel.findByIdAndUpdate(data.boardId, { title: data.fields.title }, { new: true });
    io.to(data.boardId).emit(SocketEventEnum.boardsUpdateSuccess, board);
  } catch (err) {
    socket.emit(SocketEventEnum.boardsUpdateFailure, getErrorMessage(err));
  }
}

export const deleteBoard =async (io: Server, socket: Socket, data: { boardId: string }) => {
  try {
    if (!socket.user) {
      socket.emit(SocketEventEnum.boardsDeleteFailure, "user not authenticated");
      return;
    }
    const board = await boardModel.findByIdAndDelete(data.boardId);
    io.to(data.boardId).emit(SocketEventEnum.boardsDeleteSuccess);
  } catch (err) {
    socket.emit(SocketEventEnum.boardsDeleteFailure, getErrorMessage(err));
  }
}