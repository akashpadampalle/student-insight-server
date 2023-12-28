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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const handleError_1 = __importDefault(require("./handleError"));
const User_1 = __importDefault(require("../models/User"));
/**
 * @description Verify JWT token
 * @route GET /verify
 * @access Public
 */
const verifyJWT = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const authHeader = req.headers.authorization || req.headers.Authorization;
        if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (!process.env.ACCESS_TOKEN_SECRET) {
            return (0, handleError_1.default)(res, new Error('Unable to find access token secret'));
        }
        const token = authHeader.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
        // if (!decoded) {
        //     return res.status(403).json({ message: 'Forbidden' });
        // }
        if (!decoded || typeof decoded == "string" || !((_a = decoded === null || decoded === void 0 ? void 0 : decoded.UserInfo) === null || _a === void 0 ? void 0 : _a.username)) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const user = yield User_1.default.findOne({ username: decoded.UserInfo.username });
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = user;
        next();
    }
    catch (error) {
        if (error instanceof Error && error.message === 'jwt expired') {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        (0, handleError_1.default)(res, error);
    }
});
exports.default = verifyJWT;
