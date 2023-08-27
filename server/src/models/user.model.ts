import mongoose from "mongoose";
import { UserDocument } from "../types/user.interface";
import bcryptjs from "bcryptjs";

const userSchema = new mongoose.Schema<UserDocument>({
    email: {
        type: String,
        required: [true, "email is required"],
        unique:true,
    },
    userName: {
        type: String,
        required: [true, "userName is required"],
    },
    password: {
        type: String,
        required: [true, "password is required"],
        select: false
    },
}, { timestamps: true });

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    try {
        this.password = await bcryptjs.hash(this.password, 10);
        return next();
    } catch (err) {
        return next(err as Error)
    }
});

userSchema.methods.validatePassword = async function (password: string) {
    return await bcryptjs.compare(password, this.password);
}

export const userModel = mongoose.model<UserDocument>("users" , userSchema)