import { Response, NextFunction } from "express";
import AuthenticatedRequest from "../models/AuthenticatedRequest";

const adminCheck = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    if(!user || user.type !== "Admin") {
        return res.status(401).json({ messag: "User don't have admin access" });
    }

    next();

};


export default adminCheck;