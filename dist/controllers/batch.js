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
const Batch_1 = __importDefault(require("../models/Batch"));
const handleError_1 = __importDefault(require("../middlewares/handleError"));
const Student_1 = __importDefault(require("../models/Student"));
/**
 * Get all batches.
 * @param _ Express Request object (unsused).
 * @param res Express Response object to send response.
 * @returns A JSON object containing all batches or 500 Internal Server Error.
 */
const getAll = (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const batches = yield Batch_1.default.find();
        return res.status(201).json(batches);
    }
    catch (error) {
        (0, handleError_1.default)(res, error);
    }
});
exports.getAll = getAll;
/**
 * Get Batch by it's ID.
 * @param req Express Request object containing the ID in path parameter.
 * @param res Express Response object used to send response.
 * @returns A JSON object containing batch details or error with appropriate status code.
 */
const get = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Invalid data provided please check required fileds." });
        }
        const batch = yield Batch_1.default.findById(id);
        if (!batch) {
            return res.status(404).json({ message: `Batch with ID ${id} not found.` });
        }
        return res.status(201).json(batch);
    }
    catch (error) {
        (0, handleError_1.default)(res, error);
    }
});
exports.get = get;
/**
 * Create batch by it's name.
 * @param req Express Request object containing name in it's body.
 * @param res Express Response object to send response.
 * @returns A JSON object containing newly created batch or error with appropriate status code.
 */
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        if (!name || typeof name != "string") {
            return res.status(400).json({ message: "Invalide data provided please check required fields and theire type." });
        }
        const existringBatch = yield Batch_1.default.findOne({ name });
        if (existringBatch) {
            return res.status(402).json({ message: `Batch ${name} is already available.` });
        }
        const batch = yield Batch_1.default.create({ name });
        if (!batch) {
            return res.status(500).json({ message: "Unable to create batch." });
        }
        return res.status(201).json(batch);
    }
    catch (error) {
        (0, handleError_1.default)(res, error);
    }
});
exports.create = create;
/**
 * Update batch name.
 * @param req Express Request object containing id and name in body.
 * @param res Express Response object to send response.
 * @returns A JSON object containing updated batch or error with appropriate status code.
 */
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, name } = req.body;
        if (!id || typeof id != "string" ||
            !name || typeof name != "string") {
            return res.status(400).json({ message: "Invalide data provided please check required fields and their type." });
        }
        const existingBatch = yield Batch_1.default.findById(id);
        if (!existingBatch) {
            return res.status(404).json({ message: `Batch with ID ${id} not found.` });
        }
        const duplicateBatch = yield Batch_1.default.findOne({ name });
        if (duplicateBatch && duplicateBatch.id != id) {
            return res.status(402).json({ message: `Batch name "${name}" is already used.` });
        }
        existingBatch.name = name;
        yield existingBatch.save();
        return res.status(201).json(existingBatch);
    }
    catch (error) {
        (0, handleError_1.default)(res, error);
    }
});
exports.update = update;
// /**
//  * Add student to the batch.
//  * @param req Express Request object containing batch id and student id in body.
//  * @param res Express Response object to send response.
//  * @returns A JSON object containig updated batch or error with appropriate status code.
//  */
// export const addStudent = async (req: Request, res: Response) => {
//     try {
//         const { batchId, studentId }: { batchId: string, studentId: string } = req.body
//         if (
//             !batchId || typeof batchId != "string" ||
//             !studentId || typeof studentId != "string"
//         ) {
//             return res.status(400).json({ message: "Invalid data provided please check required fields and types." })
//         }
//         const batch = await Batch.findById(batchId)
//         const student = await Student.findById(studentId)
//         if (!batch) {
//             return res.status(404).json({ message: `Batch with ID ${batchId} not found.` })
//         }
//         if (!student) {
//             return res.status(404).json({ message: `Student with ID ${studentId} not found.` })
//         }
//         if (student.batch) {
//             return res.status(402).json({ message: `Student with ID ${studentId} is already associated with another batch with batch ID ${student.batch}.` })
//         }
//         batch.students.push(studentId)
//         student.batch = batchId
//         await batch.save()
//         await student.save()
//         return res.status(201).json(batch)
//     } catch (error) {
//         handleInternalError(res, error)
//     }
// }
// /**
//  * Remove student from batch.
//  * @param req Express Request object containing batch id and student id in body.
//  * @param res Express Response object to send response.
//  * @returns A JSON object containing updated batch or error with appropriate status code.
//  */
// export const removeStudent = async (req: Request, res: Response) => {
//     try {
//         const { batchId, studentId }: { batchId: string, studentId: string } = req.body
//         if (
//             !batchId || typeof batchId != "string" ||
//             !studentId || typeof studentId != "string"
//         ) {
//             return res.status(400).json({ message: "Invalide data provided please check required fields and their type." })
//         }
//         const batch = await Batch.findById(batchId)
//         const student = await Student.findById(studentId)
//         if (!batch) {
//             return res.status(404).json({ message: `Batch with ID ${batchId} not found.` })
//         }
//         if (!student) {
//             return res.status(404).json({ message: `Student with ID ${studentId} not found.` })
//         }
//         if (student.batch != batchId) {
//             return res.status(402).json({ message: `Student is associated with other batch with batch ID ${student.batch}` })
//         }
//         batch.students = batch.students.filter(sid => sid != studentId)
//         student.batch = null
//         await batch.save()
//         await student.save()
//         return res.status(201).json(batch)
//     } catch (error) {
//         handleInternalError(res, error)
//     }
// }
/**
 * Remove batch by it's ID.
 * @param req Express Request object containing batch id in path parameter.
 * @param res Express Response object to send response.
 * @returns Empaty JSON object or error with appropriate status code.
 */
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Invalide data provided please check required data ant their types." });
        }
        const batch = yield Batch_1.default.findById(id);
        if (!batch) {
            return res.status(400).json({ message: `Batch with ID ${id} not found.` });
        }
        yield Student_1.default.updateMany({ batch: batch._id }, { batch: null });
        yield Batch_1.default.findByIdAndDelete(id);
        return res.status(204).json({});
    }
    catch (error) {
        (0, handleError_1.default)(res, error);
    }
});
exports.remove = remove;
