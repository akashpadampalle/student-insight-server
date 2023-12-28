"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const interViewSchema = new mongoose_1.Schema({
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
});
const Interview = (0, mongoose_1.model)("Interview", interViewSchema);
exports.default = Interview;
