import { Schema, Document, model } from "mongoose"

export interface IInterview {
    companyName: string,
    date: Date,
    createdAt: string,
    updatedAt: string
}


export interface InterviewModel extends IInterview, Document { }


const interViewSchema = new Schema<InterviewModel>({
    companyName: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
})


const Interview = model<InterviewModel>("Interview", interViewSchema)
export default Interview