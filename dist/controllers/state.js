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
exports.getState = void 0;
const Student_1 = __importDefault(require("../models/Student"));
const Batch_1 = __importDefault(require("../models/Batch"));
const Interview_1 = __importDefault(require("../models/Interview"));
const Result_1 = __importDefault(require("../models/Result"));
const handleError_1 = __importDefault(require("../middlewares/handleError"));
/**
 * Get current state of backend
 * @param _ Express Request object.
 * @param res Express Response object to send response.
 * @returns AJSON object containing whole set of data or Internal error.
 */
const getState = (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const students = yield Student_1.default.find().lean();
        const batches = yield Batch_1.default.find().lean();
        const interviews = yield Interview_1.default.find().lean();
        const results = yield Result_1.default.find().lean();
        const state = { students, batches, interviews, results };
        return res.status(200).json(state);
    }
    catch (error) {
        (0, handleError_1.default)(res, error);
    }
});
exports.getState = getState;
