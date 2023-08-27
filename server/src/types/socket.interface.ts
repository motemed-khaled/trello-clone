import { Socket as SocketioSocket } from "socket.io";
import { UserDocument } from "./user.interface";

export interface Socket extends SocketioSocket{
    user?: UserDocument;
}