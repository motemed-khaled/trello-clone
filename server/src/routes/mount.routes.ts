import { Application } from "express";
import { router as userRoutes } from "./user.routes";
import { router as boardRoutes } from "./board.routes";



export const mountRoutes = (app:Application) => {
    app.use("/api/user", userRoutes);
    app.use("/api/boards", boardRoutes);
}