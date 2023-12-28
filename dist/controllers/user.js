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
const handleError_1 = __importDefault(require("../middlewares/handleError"));
const User_1 = __importDefault(require("../models/User"));
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const getAll = (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.find();
        return res.status(200).json(users);
    }
    catch (error) {
        (0, handleError_1.default)(res, error);
    }
});
exports.getAll = getAll;
const get = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id || !mongoose_1.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid data provided. please check required data and it's types." });
    }
    const user = yield User_1.default.findById(id).select("-password");
    if (!user) {
        return res.status(404).json({ message: `User with ID ${id} not found.` });
    }
    return res.status(200).json(user);
});
exports.get = get;
/**
 * @description Create a new user
 * @route POST /users
 * @access Public
 */
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (!username || typeof username != "string" ||
        !password || typeof password != "string") {
        return res.status(400).json({ message: 'Invalid data provided. Please check required data and its types.' });
    }
    const existringUser = yield User_1.default.findOne({ username });
    if (existringUser) {
        return res.status(401).json({ message: `Username ${username} is already in use.` });
    }
    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
    const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
    const user = yield User_1.default.create({ username, password: hashedPassword });
    if (!user) {
        return res.status(500).json({ message: 'Unable to create user' });
    }
    const userToSend = { username: user.username, type: user.type, _id: user._id };
    res.status(201).json(userToSend);
});
exports.create = create;
/**
 * @description Update a user
 * @route PUT /users/:id
 * @access Public
 */
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, username, password } = req.body;
    if (!id || !mongoose_1.Types.ObjectId.isValid(id) || !username || typeof username !== 'string') {
        return res.status(400).json({ message: "Invalid data provided. Please check required data and its types." });
    }
    const user = yield User_1.default.findById(id);
    if (!user) {
        return res.status(404).json({ message: `User with ID ${id} not found.` });
    }
    const existingUser = yield User_1.default.findOne({ username });
    if (existingUser && user._id.toString() !== existingUser._id.toString()) {
        return res.status(401).json({ message: `Username ${username} is already taken.` });
    }
    user.username = username;
    if (password && typeof password === 'string') {
        const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
        const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
        user.password = hashedPassword;
    }
    yield user.save();
    const userToSend = Object.assign(Object.assign({}, user.toJSON()), { password: undefined });
    res.status(201).json(userToSend);
});
exports.update = update;
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id || !mongoose_1.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid data provided. please check required data and it's types." });
    }
    yield User_1.default.findByIdAndDelete(id);
    return res.status(204).json({});
});
exports.remove = remove;
