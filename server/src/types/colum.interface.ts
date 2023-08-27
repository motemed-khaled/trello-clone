import { Document ,Schema } from "mongoose";


export interface Colum{
    title: string, 
    createdAt:Date,
    updatedAt: Date,
    userId: Schema.Types.ObjectId;
    boardId:Schema.Types.ObjectId;
}

export interface ColumDocument extends Colum , Document{}