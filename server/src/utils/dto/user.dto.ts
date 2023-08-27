import { UserDocument } from "../../types/user.interface";


export const normalizeUser = (user:UserDocument) => {
    return {
        email: user.email,
        userName: user.userName,
        userId:user.id
    }
}