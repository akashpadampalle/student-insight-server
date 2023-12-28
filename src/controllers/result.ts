import { Request, Response } from "express";
import Result from "../models/Result";
import handleInternalError from "../middlewares/handleError";
import Student from "../models/Student";
import Interview from "../models/Interview";
import { json2csv } from "json-2-csv";


/**
 * Get all results
 * @param _ Express Request object (unused).
 * @param res Express Response object used to send response.
 * @returns A JSON Array containing all result objects or Error
 */
export const getAll = async (_: Request, res: Response) => {
    try {

        const results = await Result.find()
        return res.status(201).json(results)

    } catch (error) {

        handleInternalError(res, error)

    }
}




/**
 * GET result by id
 * @param req Express Request object containing id in path parameter
 * @param res Express Response object used to send response.
 * @returns A JSON object containing result object or error with appropriate status code
 */
export const get = async (req: Request, res: Response) => {
    try {

        const { id } = req.params

        if (!id) {
            return res.status(400).json({ message: "Invalide data provide. please check required data and it\'s type." })
        }

        const result = await Result.findById(id)

        if (!result) {
            return res.status(404).json({ message: `Result with ID ${id} not found.` })
        }

        return res.status(201).json(result)

    } catch (error) {
        handleInternalError(res, error)
    }
}



/**
 * Create a result 
 * @param req Express Request object containing student id , interview id, and status in request body object.
 * @param res Express Response object used to send response.
 * @returns A JSON object containig newly created result or error with appropriate status code
 */
export const create = async (req: Request, res: Response) => {
    try {
        const { student, interview, status }: { student: string, interview: string, status?: string } = req.body

        if (!student || typeof student != "string" || !interview || typeof interview != "string") {
            return res.status(400).json({ message: "Invalide data provided. Please check required data and it\'s type." })
        }

        const studentDoc = await Student.findById(student)

        if (!studentDoc) {
            return res.status(404).json({ message: `Student with ID ${student} not found.` })
        }

        const interviewDoc = await Interview.findById(interview)

        if (!interviewDoc) {
            return res.status(404).json({ message: `Interview with ID ${interview} not found.` })
        }

        const resultObj: {
            student: string,
            interview: string,
            status?: string
        } = {
            student,
            interview
        }

        if (status && (status == "PASS" || status == "FAIL" || status == "On Hold" || status == "Didn\’t Attempt")) {
            resultObj.status = status
        }

        const result = await Result.create(resultObj)
        return res.status(201).json(result)

    } catch (error) {
        handleInternalError(res, error)
    }
}



/**
 * Update result object
 * @param req Express Request object containing result id, student id, interview id and status in request body. 
 * @param res Express Response object used to send response.
 * @returns A JSON object containig new Result object or error with appropriate status code.
 */
export const update = async (req: Request, res: Response) => {

    try {

        const { id, student, interview, status }: { id: string, student?: string, interview?: string, status?: string } = req.body

        if (!id || typeof id != "string") {
            return res.status(400).json({ message: "Invalide data provided. Please check required data and it\'s type." })
        }

        const result = await Result.findById(id)

        if (!result) {
            return res.status(404).json({ message: `Result with ID ${id} not found.` })
        }

        const resultUpdate: { student?: string, interview?: string, status?: string } = {}

        if (student) {
            const studentDoc = await Student.findById(student)
            if (!studentDoc) {
                return res.status(404).json({ message: `Student with ID ${student} not found.` })
            }
            resultUpdate.student = student
        }

        if (interview) {
            const interviewDoc = await Interview.findById(interview)
            if (!interviewDoc) {
                return res.status(404).json({ message: `Interview with ID ${interview} not found.` })
            }
            resultUpdate.interview = interview
        }

        if (status && (status == "PASS" || status == "FAIL" || status == "On Hold" || status == "Didn\’t Attempt")) {
            resultUpdate.status = status
        }


        const updateResult = await Result.findByIdAndUpdate(id, resultUpdate, { new: true })

        return res.status(201).json(updateResult)

    } catch (error) {
        handleInternalError(res, error)
    }


}



/**
 * DELETE result
 * @param req Express Request object containing id in path parameter.
 * @param res Express Response object used to send response.
 * @returns Empaty JSON object or error with appropriate status code.
 */
export const remove = async (req: Request, res: Response) => {
    try {

        const { id } = req.params

        if (!id) {
            return res.status(400).json({ message: "Invalide data provided. Please check required data and it\'s type." })
        }

        const result = await Result.findById(id)

        if (!result) {
            return res.status(404).json({ message: `Result with ID ${id} not found.` })
        }

        await Result.findByIdAndDelete(id)

        return res.status(204).json({})

    } catch (error) {
        handleInternalError(res, error)
    }
}


export const getCSV = async (_: Request, res: Response) => {

    try {

        const results = await Result.find({}).populate(["student", "interview"]);

        const resultsToCSV = results.map(result => {

            if (result.student instanceof Student && result.interview instanceof Interview) {
                return {
                    "student id": result.student._id.toString(),
                    "student name": result.student.name,
                    "student college": result.student.college,
                    "student status": result.student.status,
                    "DSA Final Score": result.student.dsaFinalScore,
                    "WebD Final Score": result.student.webFinalScore,
                    "React Final Score": result.student.reactFinalScore,
                    "interview date": new Date(result.interview.date).toLocaleDateString(),
                    "interview company": result.interview.companyName,
                    "interview student result": result.status
                }
            } else {
                return {
                    "student id": result.student.toString(),
                    "interview id": result.interview.toString(),
                    "interview student result": result.status
                }
            }
        });

        const csv = json2csv(resultsToCSV)

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=results.csv');

        return res.status(200).send(csv);

    } catch (error) {
        handleInternalError(res, error)
    }


}