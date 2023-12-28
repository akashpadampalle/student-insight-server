import { Document, Schema, model } from "mongoose"

export type Status = "PASS" | "FAIL" | "On Hold" | "Didn’t Attempt"

export interface IResult {
    student: Schema.Types.ObjectId,
    interview: Schema.Types.ObjectId,
    status: Status, 
    createdAt: string,
    updatedAt: string
}

export interface ResultModel extends IResult, Document { }


const resultSchema = new Schema<ResultModel>({
    student: {
        type: Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },
    interview: {
        type: Schema.Types.ObjectId,
        ref: "Interview",
        required: true
    },
    status: {
        type: String,
        enum: ["PASS", "FAIL", "On Hold", "Didn\’t Attempt"],
        default: "Didn\’t Attempt"
    }
}, {
    timestamps: true
})


const Result = model<ResultModel>("Result", resultSchema)
export default Result
