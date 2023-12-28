"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const studentSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Batch"
    }
}, { timestamps: true });
const Student = (0, mongoose_1.model)("Student", studentSchema);
exports.default = Student;
