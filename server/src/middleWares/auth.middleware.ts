import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

import { ApiError } from "../utils/api-error";
import { userModel } from "../models/user.model";
import { ExpressRequestInterface } from "../types/expressRequest.interface";
import { Socket } from "socket.io";

export const auth = asyncHandler(async (req: ExpressRequestInterface, res: Response, next: NextFunction) => {
    let token: string = "";
    if (req.headers.authorization && req.headers.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
        
    }

    if (!token) {
        next(new ApiError("not authenticated please login first", 401));
        return;
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const userLogin = await userModel.findById(decode.id);
    if (!userLogin) {
        next(new ApiError("user dosent exist...", 404));
        return;
    }
     
    req.user = userLogin;
    next();
});
