import { Request, Response } from "express";
import Batch from "../models/Batch";
import handleInternalError from "../middlewares/handleError";
import Student from "../models/Student";



/**
 * Get all batches.
 * @param _ Express Request object (unsused).
 * @param res Express Response object to send response.
 * @returns A JSON object containing all batches or 500 Internal Server Error.
 */

export const getAll = async (_: Request, res: Response) => {
    try {

        const batches = await Batch.find()
        return res.status(201).json(batches)

    } catch (error) {
        handleInternalError(res, error)
    }
}


/**
 * Get Batch by it's ID.
 * @param req Express Request object containing the ID in path parameter.
 * @param res Express Response object used to send response.
 * @returns A JSON object containing batch details or error with appropriate status code.
 */

export const get = async (req: Request, res: Response) => {
    try {

        const { id } = req.params

        if (!id) {
            return res.status(400).json({ message: "Invalid data provided please check required fileds." })
        }

        const batch = await Batch.findById(id)

        if (!batch) {
            return res.status(404).json({ message: `Batch with ID ${id} not found.` })
        }

        return res.status(201).json(batch)

    } catch (error) {
        handleInternalError(res, error)
    }
}



/**
 * Create batch by it's name.
 * @param req Express Request object containing name in it's body.
 * @param res Express Response object to send response.
 * @returns A JSON object containing newly created batch or error with appropriate status code.
 */

export const create = async (req: Request, res: Response) => {
    try {

        const { name }: { name: string } = req.body

        if (!name || typeof name != "string") {
            return res.status(400).json({ message: "Invalide data provided please check required fields and theire type." })
        }

        const existringBatch = await Batch.findOne({ name })

        if (existringBatch) {
            return res.status(402).json({ message: `Batch ${name} is already available.` })
        }

        const batch = await Batch.create({ name })

        if (!batch) {
            return res.status(500).json({ message: "Unable to create batch." })
        }

        return res.status(201).json(batch)

    } catch (error) {
        handleInternalError(res, error)
    }

}


/**
 * Update batch name.
 * @param req Express Request object containing id and name in body.
 * @param res Express Response object to send response.
 * @returns A JSON object containing updated batch or error with appropriate status code.
 */

export const update = async (req: Request, res: Response) => {
    try {

        const { id, name }: { id: string, name: string } = req.body

        if (
            !id || typeof id != "string" ||
            !name || typeof name != "string"
        ) {
            return res.status(400).json({ message: "Invalide data provided please check required fields and their type." })
        }

        const existingBatch = await Batch.findById(id)

        if (!existingBatch) {
            return res.status(404).json({ message: `Batch with ID ${id} not found.` })
        }

        const duplicateBatch = await Batch.findOne({ name })

        if (duplicateBatch && duplicateBatch.id != id) {
            return res.status(402).json({ message: `Batch name "${name}" is already used.` })
        }

        existingBatch.name = name
        await existingBatch.save()

        return res.status(201).json(existingBatch)

    } catch (error) {
        handleInternalError(res, error)
    }
}


// /**
//  * Add student to the batch.
//  * @param req Express Request object containing batch id and student id in body.
//  * @param res Express Response object to send response.
//  * @returns A JSON object containig updated batch or error with appropriate status code.
//  */

// export const addStudent = async (req: Request, res: Response) => {
//     try {

//         const { batchId, studentId }: { batchId: string, studentId: string } = req.body

//         if (
//             !batchId || typeof batchId != "string" ||
//             !studentId || typeof studentId != "string"
//         ) {
//             return res.status(400).json({ message: "Invalid data provided please check required fields and types." })
//         }

//         const batch = await Batch.findById(batchId)
//         const student = await Student.findById(studentId)

//         if (!batch) {
//             return res.status(404).json({ message: `Batch with ID ${batchId} not found.` })
//         }

//         if (!student) {
//             return res.status(404).json({ message: `Student with ID ${studentId} not found.` })
//         }

//         if (student.batch) {
//             return res.status(402).json({ message: `Student with ID ${studentId} is already associated with another batch with batch ID ${student.batch}.` })
//         }

//         batch.students.push(studentId)
//         student.batch = batchId

//         await batch.save()
//         await student.save()

//         return res.status(201).json(batch)

//     } catch (error) {
//         handleInternalError(res, error)
//     }
// }


// /**
//  * Remove student from batch.
//  * @param req Express Request object containing batch id and student id in body.
//  * @param res Express Response object to send response.
//  * @returns A JSON object containing updated batch or error with appropriate status code.
//  */

// export const removeStudent = async (req: Request, res: Response) => {
//     try {

//         const { batchId, studentId }: { batchId: string, studentId: string } = req.body

//         if (
//             !batchId || typeof batchId != "string" ||
//             !studentId || typeof studentId != "string"
//         ) {
//             return res.status(400).json({ message: "Invalide data provided please check required fields and their type." })
//         }

//         const batch = await Batch.findById(batchId)
//         const student = await Student.findById(studentId)

//         if (!batch) {
//             return res.status(404).json({ message: `Batch with ID ${batchId} not found.` })
//         }

//         if (!student) {
//             return res.status(404).json({ message: `Student with ID ${studentId} not found.` })
//         }

//         if (student.batch != batchId) {
//             return res.status(402).json({ message: `Student is associated with other batch with batch ID ${student.batch}` })
//         }

//         batch.students = batch.students.filter(sid => sid != studentId)
//         student.batch = null
//         await batch.save()
//         await student.save()

//         return res.status(201).json(batch)

//     } catch (error) {
//         handleInternalError(res, error)
//     }
// }



/**
 * Remove batch by it's ID.
 * @param req Express Request object containing batch id in path parameter.
 * @param res Express Response object to send response.
 * @returns Empaty JSON object or error with appropriate status code.
 */

export const remove = async (req: Request, res: Response) => {
    try {

        const { id } = req.params

        if (!id) {
            return res.status(400).json({ message: "Invalide data provided please check required data ant their types." })
        }

        const batch = await Batch.findById(id)

        if (!batch) {
            return res.status(400).json({ message: `Batch with ID ${id} not found.` })
        }

        await Student.updateMany({ batch: batch._id }, { batch: null })

        await Batch.findByIdAndDelete(id)
        return res.status(204).json({})

    } catch (error) {
        handleInternalError(res, error)
    }
}