import jwt from "jsonwebtoken";


export const generateToken = (payload:{id:string}):string => {
    return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: process.env.JWT_EXPIRE! });
}