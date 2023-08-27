import { Request , Response , NextFunction } from "express";

import { ApiError } from '../utils/api-error'


const jwtInvalidSigniture = () => new ApiError("Invalid Token Blease Login Again !", 401);
const TokenExpiredError = () => new ApiError("Expired Token Blease Login Again !", 401);


export const globalError = (err:ApiError, req:Request, res:Response,next:NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error"
    if (process.env.NODE_ENV === "development") {
        sendErrorForDevelopment(res, err);
    } else {
        if (err.name === "JsonWebTokenError") err =jwtInvalidSigniture();
        if (err.name === "TokenExpiredError") err =TokenExpiredError();
        sendErrorForProduction(res, err);
    }
}

const sendErrorForDevelopment = (res:Response , err:ApiError) => {
    return res.status(err.statusCode).json({
        status: err.status,
        error : err,
        message: err.message,
        stack: err.stack
    });
}

const sendErrorForProduction = (res:Response , err:ApiError) => {
    return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
}