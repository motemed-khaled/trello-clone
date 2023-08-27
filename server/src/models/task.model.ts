import mongoose from "mongoose";
import { ColumDocument } from "../types/colum.interface";
import { TaskDocument } from "../types/task.interface";

const taskSchema = new mongoose.Schema<TaskDocument>({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    boardId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    columId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
}, { timestamps: true });

export const taskModel = mongoose.model<TaskDocument>("task", taskSchema); 