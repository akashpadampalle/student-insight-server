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
const Student_1 = __importDefault(require("../models/Student"));
const Batch_1 = __importDefault(require("../models/Batch"));
const handleError_1 = __importDefault(require("../middlewares/handleError"));
const Result_1 = __importDefault(require("../models/Result"));
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * GET all students
 * @param _ Express Request object (unused)
 * @param res Express Response object used to send response.
 * @returns A JSON object containing all students details or 500 internal server error
 */
const getAll = (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const students = yield Student_1.default.find();
        res.status(201).json(students);
    }
    catch (error) {
        (0, handleError_1.default)(res, error);
    }
});
exports.getAll = getAll;
/**
 * Retrieve a student by their ID.
 *
 * @param req  Express Request object containing the student ID in the params.
 * @param res  Express Response object used to send the response.
 * @returns  JSON object containing the student details or an error response with an appropriate status code.
 */
const get = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Invalid data provided. please check required data and their type." });
        }
        const student = yield Student_1.default.findById(id).populate("batch");
        if (!student) {
            return res.json(404).json({ message: `Student with ID ${id} not found.` });
        }
        return res.status(200).json(student);
    }
    catch (error) {
        (0, handleError_1.default)(res, error);
    }
});
exports.get = get;
/**
 * Create a new student.
 *
 * @param  req - Express Request object containing the student details in the body.
 * @param  res - Express Response object used to send the response.
 * @returns  JSON object containing the newly created student details or an error response with an appropriate status code.
 */
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, college, batch } = req.body;
        if (!name || typeof name != "string" ||
            !college || typeof college != "string" ||
            !batch || typeof batch != "string") {
            return res.status(400).json({ message: "Invilide data provided. please check required data and it\'s type." });
        }
        const existingBatch = yield Batch_1.default.findById(batch).lean();
        if (!existingBatch) {
            return res.status(404).json({ message: `Batch with ID ${batch} not found.` });
        }
        const student = yield Student_1.default.create({ name, college, batch });
        if (!student) {
            return res.status(500).json({ message: "Unable to create a student" });
        }
        return res.status(200).json(student);
    }
    catch (error) {
        (0, handleError_1.default)(res, error);
    }
});
exports.create = create;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, name, college, status, dsaFinalScore, webFinalScore, reactFinalScore, batch } = req.body;
        if (!id) {
            return res.status(400).json({ message: "Invalide data provided. please check required data and it\'s type." });
        }
        const updateObj = {};
        if (name && typeof name == "string") {
            updateObj.name = name;
        }
        if (college && typeof college == "string") {
            updateObj.college = college;
        }
        if (status && (status == "placed" || status == "not_placed")) {
            updateObj.status = status;
        }
        if (dsaFinalScore || dsaFinalScore == 0) {
            updateObj.dsaFinalScore = dsaFinalScore;
        }
        if (webFinalScore || webFinalScore == 0) {
            updateObj.webFinalScore = webFinalScore;
        }
        if (reactFinalScore || reactFinalScore == 0) {
            updateObj.reactFinalScore = reactFinalScore;
        }
        if (batch && typeof batch == "string") {
            const existingBatch = yield Batch_1.default.findById(batch);
            if (!existingBatch) {
                return res.status(404).json({ message: `Unable to update batch. Batch with ID ${batch} not found.` });
            }
            updateObj.batch = batch;
        }
        const newStudent = yield Student_1.default.findByIdAndUpdate(id, updateObj, { new: true });
        return res.status(201).json(newStudent);
    }
    catch (error) {
        (0, handleError_1.default)(res, error);
    }
});
exports.update = update;
/**
 *  DELETE a student by ID
 * @param req Express Request object containing ID in path parameter.
 * @param res Express Response object used to send response.
 * @returns Empaty JSON object or error with appropriate status code
 */
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Invalid data provided. please check required data ant it\'t type." });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID provided" });
        }
        const student = yield Student_1.default.findById(id);
        if (!student) {
            return res.status(404).json({ message: `Student with ID ${id} not found.` });
        }
        yield Result_1.default.deleteMany({ student: student.id });
        yield Student_1.default.findByIdAndDelete(id);
        return res.status(204).json({});
    }
    catch (error) {
        (0, handleError_1.default)(res, error);
    }
});
exports.remove = remove;
