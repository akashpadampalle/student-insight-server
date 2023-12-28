import { Schema, Document, model } from "mongoose";

export interface IStudent {
    name: string,
    college: string,
    status: "placed" | "not_placed",
    dsaFinalScore: number,
    webFinalScore: number,
    reactFinalScore: number,
    batch: Schema.Types.ObjectId | string | null,
    createdAt: string,
    updatedAt: string
}

interface StudentModel extends IStudent, Document { }

const studentSchema = new Schema<StudentModel>({
    name: {
        type: String,
        required: true
    },
    college: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["placed", "not_placed"],
        default: "not_placed"
    },
    dsaFinalScore: {
        type: Number,
        default: 0
    },
    webFinalScore: {
        type: Number,
        default: 0
    },
    reactFinalScore: {
        type: Number,
        default: 0
    },
    batch: {
        type: Schema.Types.ObjectId,
        ref: "Batch"
    }

}, { timestamps: true });


const Student = model<StudentModel>("Student", studentSchema)

export default Student