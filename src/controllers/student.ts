import { Request, Response } from "express";
import Student from "../models/Student";
import Batch from "../models/Batch";
import handleInternalError from "../middlewares/handleError";
import Result from "../models/Result";
import mongoose from "mongoose";


/**
 * GET all students
 * @param _ Express Request object (unused)
 * @param res Express Response object used to send response.
 * @returns A JSON object containing all students details or 500 internal server error
 */
export const getAll = async (_: Request, res: Response) => {
    try {

        const students = await Student.find()
        res.status(201).json(students)

    } catch (error) {

        handleInternalError(res, error)

    }

}




/**
 * Retrieve a student by their ID.
 * 
 * @param req  Express Request object containing the student ID in the params.
 * @param res  Express Response object used to send the response.
 * @returns  JSON object containing the student details or an error response with an appropriate status code.
 */
export const get = async (req: Request, res: Response) => {

    try {

        const { id } = req.params

        if (!id) {
            return res.status(400).json({ message: "Invalid data provided. please check required data and their type." })
        }

        const student = await Student.findById(id).populate("batch")

        if (!student) {
            return res.json(404).json({ message: `Student with ID ${id} not found.` })
        }

        return res.status(200).json(student)

    } catch (error) {

        handleInternalError(res, error)

    }


}


/**
 * Create a new student.
 *
 * @param  req - Express Request object containing the student details in the body.
 * @param  res - Express Response object used to send the response.
 * @returns  JSON object containing the newly created student details or an error response with an appropriate status code.
 */
export const create = async (req: Request, res: Response) => {

    try {

        const { name, college, batch }: { name: string, college: string, batch: string } = req.body

        if (
            !name || typeof name != "string" ||
            !college || typeof college != "string" ||
            !batch || typeof batch != "string"
        ) {
            return res.status(400).json({ message: "Invilide data provided. please check required data and it\'s type." })
        }

        const existingBatch = await Batch.findById(batch).lean()

        if (!existingBatch) {
            return res.status(404).json({ message: `Batch with ID ${batch} not found.` })
        }

        const student = await Student.create({ name, college, batch })

        if (!student) {
            return res.status(500).json({ message: "Unable to create a student" })
        }

        return res.status(200).json(student)

    } catch (error) {

        handleInternalError(res, error)

    }


}


export const update = async (req: Request, res: Response) => {
    try {

        const { id, name, college, status, dsaFinalScore, webFinalScore, reactFinalScore, batch } = req.body

        if (!id) {
            return res.status(400).json({ message: "Invalide data provided. please check required data and it\'s type." })
        }

        const updateObj: {
            name?: string,
            college?: string,
            status?: string
            dsaFinalScore?: number,
            webFinalScore?: number,
            reactFinalScore?: number,
            batch?: string
        } = {}

        if (name && typeof name == "string" ) {
            updateObj.name = name
        }

        if (college && typeof college == "string") {
            updateObj.college = college
        }

        if (status && (status == "placed" || status == "not_placed")) {
            updateObj.status = status
        }

        if (dsaFinalScore || dsaFinalScore == 0) {
            updateObj.dsaFinalScore = dsaFinalScore
        }

        if (webFinalScore || webFinalScore == 0) {
            updateObj.webFinalScore = webFinalScore
        }

        if (reactFinalScore || reactFinalScore == 0) {
            updateObj.reactFinalScore = reactFinalScore
        }

        if (batch && typeof batch == "string") {
            const existingBatch = await Batch.findById(batch)
            if(!existingBatch) {
                return res.status(404).json({ message: `Unable to update batch. Batch with ID ${batch} not found.`})
            }
            updateObj.batch = batch
        }

        const newStudent = await Student.findByIdAndUpdate(id, updateObj, { new: true })

        return res.status(201).json(newStudent)

    } catch (error) {
        handleInternalError(res, error)
    }
}



/**
 *  DELETE a student by ID
 * @param req Express Request object containing ID in path parameter.
 * @param res Express Response object used to send response.
 * @returns Empaty JSON object or error with appropriate status code
 */
export const remove = async (req: Request, res: Response) => {
    try {

        const { id } = req.params

        if (!id) {
            return res.status(400).json({ message: "Invalid data provided. please check required data ant it\'t type." })
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID provided" })
        }

        const student = await Student.findById(id)

        if (!student) {
            return res.status(404).json({ message: `Student with ID ${id} not found.` })
        }

        await Result.deleteMany({ student: student.id })
        await Student.findByIdAndDelete(id)

        return res.status(204).json({})

    } catch (error) {
        handleInternalError(res, error)
    }

}




