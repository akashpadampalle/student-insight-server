"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.create = exports.get = exports.getAll = void 0;
const Interview_1 = __importDefault(require("../models/Interview"));
const handleError_1 = __importDefault(require("../middlewares/handleError"));
const Result_1 = __importDefault(require("../models/Result"));
/**
 * Get all interviews
 *
 * @param req - Express Request object (unused for this route).
 * @param res - Express Response object for sending the response.
 * @returns  A JSON array containing all interviews data or 500 Internal server error in case of error.
 */
const getAll = (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const interviews = yield Interview_1.default.find();
        return res.status(201).json(interviews);
    }
    catch (error) {
        (0, handleError_1.default)(res, error);
    }
});
exports.getAll = getAll;
/**
 * Get interview by it's ID
 *
 * @param req - Express Request object containing the interview ID in the path parameter.
 * @param res - Express Response object for sending the response.
 * @returns  A JSON object containing the interview data or a 404 Not Found or 500 Internal Server Error.
 */
const get = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const interview = yield Interview_1.default.findById(id);
        if (!interview) {
            return res.status(404).json({ message: `Interview with ID ${id} is not fount.` });
        }
        return res.status(201).json(interview);
    }
    catch (error) {
        (0, handleError_1.default)(res, error);
    }
});
exports.get = get;
/**
 * Create Interview
 *
 * @param req - Express Request object containing companyName and date in body.
 * @param res - Express Response object for sending response.
 * @returns  A JSON object containing interview or 400 Unable to create Interview or 500 Internal serview error.
 */
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { companyName, date } = req.body;
        if (!companyName || typeof companyName != "string" ||
            !date || typeof date != "string") {
            return res.status(400).json({ message: "Invalid data provide please check the required fields and their types." });
        }
        const newDate = new Date(date);
        const interview = yield Interview_1.default.create({ companyName, date: newDate });
        if (!interview) {
            return res.status(400).json({ message: "Unable to create Interview. Please check the provided company name and date." });
        }
        return res.status(201).json(interview);
    }
    catch (error) {
        (0, handleError_1.default)(res, error);
    }
});
exports.create = create;
/**
 * Update interview
 *
 * @param req - Express Request Object contains id, companyName, and date in body.
 * @param res - Express Response Object for sending response.
 * @returns  A JSON object of updated interview, or error with appropriate status code.
 */
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, companyName, date } = req.body;
        if (!id || typeof id != "string") {
            return res.status(400).json({ message: "Invalid data provide please check the required fields and their types." });
        }
        const existingInterview = yield Interview_1.default.findById(id);
        if (!existingInterview) {
            return res.status(404).json({ message: `Interview with ID ${id} not found.` });
        }
        if (companyName && typeof companyName == "string") {
            existingInterview.companyName = companyName;
        }
        if (date && typeof date == "string") {
            const newDate = new Date(date);
            existingInterview.date = newDate;
        }
        const updatedInterview = yield existingInterview.save();
        if (!updatedInterview) {
            return res.status(500).json({ message: `Unable to update interview with ID ${id}.` });
        }
        return res.status(201).json(updatedInterview);
    }
    catch (error) {
        (0, handleError_1.default)(res, error);
    }
});
exports.update = update;
/**
 * Delete interview By it's id
 *
 * @param req - Express Request object containing interview ID in path parameter.
 * @param res - Express Response object used for sending response.
 * @returns A JSON empty object or error with appropriate status code.
 */
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id || typeof id != "string") {
            return res.status(400).json({ message: "Invalid data provided please check required fields and their types." });
        }
        const existingInterview = yield Interview_1.default.findById(id);
        if (!existingInterview) {
            return res.status(404).json({ message: `Interview with ID ${id} not found.` });
        }
        yield Result_1.default.deleteMany({ interview: existingInterview._id });
        yield Interview_1.default.findByIdAndDelete(id);
        return res.status(204).json({});
    }
    catch (error) {
        (0, handleError_1.default)(res, error);
    }
});
exports.remove = remove;
