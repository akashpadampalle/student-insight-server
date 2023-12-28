import { Document, Schema, model } from "mongoose";

export interface IBatch {
    name: string,
    createdAt: string,
    updatedAt: string
}

export interface BatchModel extends IBatch, Document { }

const batchSchema = new Schema<BatchModel>({
    name: {
        type: String,
        required: true
    }
}, { timestamps: true })


const Batch = model<BatchModel>("Batch", batchSchema)

export default Batch