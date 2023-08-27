import asyncHandler from "express-async-handler";
import { Response, Request, NextFunction } from "express";

import { generateToken } from "../utils/generateToken";

import { userModel } from "../models/user.model";
import { normalizeUser } from "../utils/dto/user.dto";
import { ApiError } from "../utils/api-error";
import { ExpressRequestInterface } from "../types/expressRequest.interface";


export const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = await userModel.create(req.body);
    const token = generateToken({id:user._id});
    res.status(200).json({...normalizeUser(user) , token:token});
});

export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = await userModel.findOne({ email: req.body.email }).select("+password");
    if (!user) {
        next(new ApiError("invalid creditional", 401));
        return;
    }
    if (!(await user.validatePassword(req.body.password))) {
        next(new ApiError("invalid creditional", 401));
        return;
    }
    const token = generateToken({id:user._id});
    res.status(200).json({...normalizeUser(user) , token:token});
});

export const getCurrentUser = asyncHandler(async (req: ExpressRequestInterface, res: Response, next: NextFunction)=>{
    if (!req.user) {
        next(new ApiError("not authenticated please login first..", 401));
        return;
    }
    res.status(200).json( normalizeUser(req.user) );
})