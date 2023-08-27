import mongoose from "mongoose";
import { ColumDocument } from "../types/colum.interface";

const coulmSchema = new mongoose.Schema<ColumDocument>({
    title: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    boardId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
}, { timestamps: true });

export const columModel = mongoose.model<ColumDocument>("colum", coulmSchema); 