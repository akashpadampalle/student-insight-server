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
exports.logout = exports.refresh = exports.login = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const handleError_1 = __importDefault(require("../middlewares/handleError"));
/**
 * @description Login
 * @route POST /auth
 * @access Public
 */
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        if (!username || typeof username != "string" ||
            !password || typeof password != "string") {
            return res.status(400).json({
                message: 'All fields are required',
            });
        }
        const foundUser = yield User_1.default.findOne({ username }).exec();
        if (!foundUser) {
            return res.status(401).json({
                message: 'Unauthorized',
            });
        }
        const match = yield bcrypt_1.default.compare(password, foundUser.password);
        if (!match) {
            return res.status(401).json({
                message: 'Unauthorized',
            });
        }
        const accessToken = jsonwebtoken_1.default.sign({
            UserInfo: {
                username: foundUser.username,
            },
        }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10s' });
        const refreshToken = jsonwebtoken_1.default.sign({ username: foundUser.username }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
        // create a secure cookie with refresh token
        res.cookie('jwt', refreshToken, {
            httpOnly: true, // accessible only by web browser
            // secure: true, // https
            sameSite: 'none', // cross-site cookie
            maxAge: 1000 * 60 * 60 * 24 * 7, // cookie-expiry: set to match refresh token
        });
        // send accessToken containing username and roles
        res.json({
            accessToken,
            user: Object.assign(Object.assign({}, foundUser.toJSON()), { password: undefined })
        });
    }
    catch (error) {
        (0, handleError_1.default)(res, error);
    }
});
exports.login = login;
/**
 * @description Refresh
 * @route GET /auth/refresh
 * @access Public - because access token has expired
 */
const refresh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cookies = req.cookies;
        console.log(cookies);
        if (!(cookies === null || cookies === void 0 ? void 0 : cookies.jwt)) {
            return res.status(400).json({ message: 'Unauthorized' });
        }
        const refreshToken = cookies.jwt;
        if (!process.env.REFRESH_TOKEN_SECRET || !process.env.ACCESS_TOKEN_SECRET) {
            return (0, handleError_1.default)(res, new Error('Unable to find token secret'));
        }
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const foundUser = yield User_1.default.findOne({ username: decoded.username });
        if (!foundUser) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const accessToken = jsonwebtoken_1.default.sign({
            UserInfo: {
                username: foundUser.username,
            },
        }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10s' });
        // send accessToken containing username
        res.json({
            accessToken,
            user: Object.assign(Object.assign({}, foundUser.toJSON()), { password: undefined })
        });
    }
    catch (error) {
        (0, handleError_1.default)(res, error);
    }
});
exports.refresh = refresh;
/**
 * @description Logout
 * @route POST /auth/logout
 * @access Public - just to clear cookie if exists
 */
const logout = (req, res) => {
    const cookies = req.cookies;
    if (!(cookies === null || cookies === void 0 ? void 0 : cookies.jwt)) {
        return res.sendStatus(204);
    }
    res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'none' });
    res.json({ message: 'Cookie cleared' });
};
exports.logout = logout;
