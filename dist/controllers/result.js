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
exports.getCSV = exports.remove = exports.update = exports.create = exports.get = exports.getAll = void 0;
const Result_1 = __importDefault(require("../models/Result"));
const handleError_1 = __importDefault(require("../middlewares/handleError"));
const Student_1 = __importDefault(require("../models/Student"));
const Interview_1 = __importDefault(require("../models/Interview"));
const json_2_csv_1 = require("json-2-csv");
/**
 * Get all results
 * @param _ Express Request object (unused).
 * @param res Express Response object used to send response.
 * @returns A JSON Array containing all result objects or Error
 */
const getAll = (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const results = yield Result_1.default.find();
        return res.status(201).json(results);
    }
    catch (error) {
        (0, handleError_1.default)(res, error);
    }
});
exports.getAll = getAll;
/**
 * GET result by id
 * @param req Express Request object containing id in path parameter
 * @param res Express Response object used to send response.
 * @returns A JSON object containing result object or error with appropriate status code
 */
const get = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Invalide data provide. please check required data and it\'s type." });
        }
        const result = yield Result_1.default.findById(id);
        if (!result) {
            return res.status(404).json({ message: `Result with ID ${id} not found.` });
        }
        return res.status(201).json(result);
    }
    catch (error) {
        (0, handleError_1.default)(res, error);
    }
});
exports.get = get;
/**
 * Create a result
 * @param req Express Request object containing student id , interview id, and status in request body object.
 * @param res Express Response object used to send response.
 * @returns A JSON object containig newly created result or error with appropriate status code
 */
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { student, interview, status } = req.body;
        if (!student || typeof student != "string" || !interview || typeof interview != "string") {
            return res.status(400).json({ message: "Invalide data provided. Please check required data and it\'s type." });
        }
        const studentDoc = yield Student_1.default.findById(student);
        if (!studentDoc) {
            return res.status(404).json({ message: `Student with ID ${student} not found.` });
        }
        const interviewDoc = yield Interview_1.default.findById(interview);
        if (!interviewDoc) {
            return res.status(404).json({ message: `Interview with ID ${interview} not found.` });
        }
        const resultObj = {
            student,
            interview
        };
        if (status && (status == "PASS" || status == "FAIL" || status == "On Hold" || status == "Didn\’t Attempt")) {
            resultObj.status = status;
        }
        const result = yield Result_1.default.create(resultObj);
        return res.status(201).json(result);
    }
    catch (error) {
        (0, handleError_1.default)(res, error);
    }
});
exports.create = create;
/**
 * Update result object
 * @param req Express Request object containing result id, student id, interview id and status in request body.
 * @param res Express Response object used to send response.
 * @returns A JSON object containig new Result object or error with appropriate status code.
 */
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, student, interview, status } = req.body;
        if (!id || typeof id != "string") {
            return res.status(400).json({ message: "Invalide data provided. Please check required data and it\'s type." });
        }
        const result = yield Result_1.default.findById(id);
        if (!result) {
            return res.status(404).json({ message: `Result with ID ${id} not found.` });
        }
        const resultUpdate = {};
        if (student) {
            const studentDoc = yield Student_1.default.findById(student);
            if (!studentDoc) {
                return res.status(404).json({ message: `Student with ID ${student} not found.` });
            }
            resultUpdate.student = student;
        }
        if (interview) {
            const interviewDoc = yield Interview_1.default.findById(interview);
            if (!interviewDoc) {
                return res.status(404).json({ message: `Interview with ID ${interview} not found.` });
            }
            resultUpdate.interview = interview;
        }
        if (status && (status == "PASS" || status == "FAIL" || status == "On Hold" || status == "Didn\’t Attempt")) {
            resultUpdate.status = status;
        }
        const updateResult = yield Result_1.default.findByIdAndUpdate(id, resultUpdate, { new: true });
        return res.status(201).json(updateResult);
    }
    catch (error) {
        (0, handleError_1.default)(res, error);
    }
});
exports.update = update;
/**
 * DELETE result
 * @param req Express Request object containing id in path parameter.
 * @param res Express Response object used to send response.
 * @returns Empaty JSON object or error with appropriate status code.
 */
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Invalide data provided. Please check required data and it\'s type." });
        }
        const result = yield Result_1.default.findById(id);
        if (!result) {
            return res.status(404).json({ message: `Result with ID ${id} not found.` });
        }
        yield Result_1.default.findByIdAndDelete(id);
        return res.status(204).json({});
    }
    catch (error) {
        (0, handleError_1.default)(res, error);
    }
});
exports.remove = remove;
const getCSV = (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const results = yield Result_1.default.find({}).populate(["student", "interview"]);
        const resultsToCSV = results.map(result => {
            if (result.student instanceof Student_1.default && result.interview instanceof Interview_1.default) {
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
                };
            }
            else {
                return {
                    "student id": result.student.toString(),
                    "interview id": result.interview.toString(),
                    "interview student result": result.status
                };
            }
        });
        const csv = (0, json_2_csv_1.json2csv)(resultsToCSV);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=results.csv');
        return res.status(200).send(csv);
    }
    catch (error) {
        (0, handleError_1.default)(res, error);
    }
});
exports.getCSV = getCSV;
