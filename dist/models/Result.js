"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const resultSchema = new mongoose_1.Schema({
    student: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },
    interview: {
        type: mongoose_1.Schema.Types.ObjectId,
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
});
const Result = (0, mongoose_1.model)("Result", resultSchema);
exports.default = Result;
