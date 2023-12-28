import { Request, Response } from "express";


export const notFoundError = (_: Request, res: Response) => {
    return res.status(404).json({ message: "Page Not Found."})
}