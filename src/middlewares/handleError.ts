import {  Response } from "express"
import { logError } from "./logger"

const handleInternalError = ( res: Response, error: unknown) => {
    if (error instanceof Error) { logError(error) }
    return res.status(500).json({ message: "Internal server error" })
}


export default handleInternalError;