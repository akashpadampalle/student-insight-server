import { Request, Response } from "express"
import Interview from "../models/Interview"
import handleInternalError from "../middlewares/handleError"
import Result from "../models/Result"

/**
 * Get all interviews
 * 
 * @param req - Express Request object (unused for this route).
 * @param res - Express Response object for sending the response.
 * @returns  A JSON array containing all interviews data or 500 Internal server error in case of error.
 */
export const getAll = async (_: Request, res: Response) => {
    try {

        const interviews = await Interview.find()
        return res.status(201).json(interviews)

    } catch (error) {
        handleInternalError(res, error)
    }
}

/**
 * Get interview by it's ID
 * 
 * @param req - Express Request object containing the interview ID in the path parameter.
 * @param res - Express Response object for sending the response.
 * @returns  A JSON object containing the interview data or a 404 Not Found or 500 Internal Server Error.
 */

export const get = async (req: Request, res: Response) => {
    try {

        const { id } = req.params
        const interview = await Interview.findById(id)

        if (!interview) {
            return res.status(404).json({ message: `Interview with ID ${id} is not fount.` })
        }

        return res.status(201).json(interview)

    } catch (error) {
        handleInternalError(res, error)
    }
}


/**
 * Create Interview
 * 
 * @param req - Express Request object containing companyName and date in body.
 * @param res - Express Response object for sending response.
 * @returns  A JSON object containing interview or 400 Unable to create Interview or 500 Internal serview error.
 */

export const create = async (req: Request, res: Response) => {
    try {

        const { companyName, date }: { companyName: string, date: string } = req.body

        if (
            !companyName || typeof companyName != "string" ||
            !date || typeof date != "string"
        ) {
            return res.status(400).json({ message: "Invalid data provide please check the required fields and their types." })
        }

        const newDate = new Date(date)
        const interview = await Interview.create({ companyName, date: newDate })

        if (!interview) {
            return res.status(400).json({ message: "Unable to create Interview. Please check the provided company name and date." })
        }

        return res.status(201).json(interview)

    } catch (error) {
        handleInternalError(res, error)
    }
}

/**
 * Update interview
 * 
 * @param req - Express Request Object contains id, companyName, and date in body.
 * @param res - Express Response Object for sending response.
 * @returns  A JSON object of updated interview, or error with appropriate status code.
 */

export const update = async (req: Request, res: Response) => {
    try {

        const { id, companyName, date }: { id: string, companyName: string, date: string } = req.body

        if (
            !id || typeof id != "string"

        ) {
            return res.status(400).json({ message: "Invalid data provide please check the required fields and their types." })
        }



        const existingInterview = await Interview.findById(id)

        if (!existingInterview) {
            return res.status(404).json({ message: `Interview with ID ${id} not found.` })
        }

        if (companyName && typeof companyName == "string") {
            existingInterview.companyName = companyName
        }

        if (date && typeof date == "string") {
            const newDate = new Date(date)
            existingInterview.date = newDate
        }

        const updatedInterview = await existingInterview.save()

        if (!updatedInterview) {
            return res.status(500).json({ message: `Unable to update interview with ID ${id}.` })
        }

        return res.status(201).json(updatedInterview)

    } catch (error) {
        handleInternalError(res, error)
    }
}



/**
 * Delete interview By it's id
 * 
 * @param req - Express Request object containing interview ID in path parameter.
 * @param res - Express Response object used for sending response.
 * @returns A JSON empty object or error with appropriate status code. 
 */
export const remove = async (req: Request, res: Response) => {
    try {

        const { id } = req.params

        if (!id || typeof id != "string") {
            return res.status(400).json({ message: "Invalid data provided please check required fields and their types." })
        }

        const existingInterview = await Interview.findById(id)

        if (!existingInterview) {
            return res.status(404).json({ message: `Interview with ID ${id} not found.` })
        }

        await Result.deleteMany({ interview: existingInterview._id });

        await Interview.findByIdAndDelete(id)

        return res.status(204).json({})

    } catch (error) {
        handleInternalError(res, error)
    }
}