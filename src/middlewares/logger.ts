import { Request, Response, NextFunction } from "express"
import { format } from "date-fns"
import fs from "fs"
import fsPromise from "fs/promises"
import path from "path"



const LOG_DIR = path.join(__dirname, "..", "..", "logs")

export const logger = async (file: string, message: string) => {
    try {

        if (!fs.existsSync(LOG_DIR)) {
            await fsPromise.mkdir(LOG_DIR)
        }

        const FILE_PATH = path.join(LOG_DIR, `${file.trim()}.log`)
        await fsPromise.appendFile(FILE_PATH, message)
        console.log(message)

    } catch (error) {

        console.log(error)

    }

}



export const logRequest = (req: Request, _: Response, next: NextFunction) => {
   
    const date = format(new Date(), "dd/MM/yyyy HH:mm:ss")
    const message = `[${date}]\t${req.method}\t${req.url}\t${req.ip}\n`
    logger('request', message)
    next()

} 


export const logError = (error: Error) => {

    const date = format(new Date(), "dd/MM/yyyy HH:mm:ss")
    const message = `[${date}]\t${error.message}\t${error.stack}]\n`
    logger('error', message)

}

// @ts-ignore - to ignore the warning of unused parameters
export const logExpressError = (error: Error, req: Request, res: Response, next: NextFunction) => {

    const date = format(new Date(), "dd/MM/yyyy HH:mm:ss")
    const message = `[${date}]\t${req.method}\t${req.url}\t${error.message}\t${error.stack}]`
    logger('express-error', message)

} 