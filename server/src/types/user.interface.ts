import { Document } from "mongoose";

export interface User{
    email: string,
    userName: string,
    password: string,
    createAt: Date,
    updatedAt: Date,
}

export interface UserDocument extends User, Document{
    validatePassword(value: string): Promise<boolean>;
}