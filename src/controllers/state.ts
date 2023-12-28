import { Request, Response } from "express";
import Student, { IStudent } from "../models/Student";
import Batch, { IBatch } from "../models/Batch";
import Interview, { IInterview } from "../models/Interview";
import Result, { IResult } from "../models/Result";
import handleInternalError from "../middlewares/handleError";

interface State {
    students: IStudent[],
    batches: IBatch[],
    interviews: IInterview[],
    results: IResult[]
}


/**
 * Get current state of backend
 * @param _ Express Request object.
 * @param res Express Response object to send response.
 * @returns AJSON object containing whole set of data or Internal error.
 */
export const getState = async (_: Request, res: Response) => {

    try {
        const students: IStudent[] = await Student.find().lean();
        const batches: IBatch[] = await Batch.find().lean();
        const interviews: IInterview[] = await Interview.find().lean();
        const results: IResult[] = await Result.find().lean();

        const state: State = { students, batches, interviews, results };

        return res.status(200).json(state)

    } catch (error) {
        handleInternalError(res, error)
    }


}