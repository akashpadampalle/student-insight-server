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
exports.logExpressError = exports.logError = exports.logRequest = exports.logger = void 0;
const date_fns_1 = require("date-fns");
const fs_1 = __importDefault(require("fs"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const LOG_DIR = path_1.default.join(__dirname, "..", "..", "logs");
const logger = (file, message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!fs_1.default.existsSync(LOG_DIR)) {
            yield promises_1.default.mkdir(LOG_DIR);
        }
        const FILE_PATH = path_1.default.join(LOG_DIR, `${file.trim()}.log`);
        yield promises_1.default.appendFile(FILE_PATH, message);
        console.log(message);
    }
    catch (error) {
        console.log(error);
    }
});
exports.logger = logger;
const logRequest = (req, _, next) => {
    const date = (0, date_fns_1.format)(new Date(), "dd/MM/yyyy HH:mm:ss");
    const message = `[${date}]\t${req.method}\t${req.url}\t${req.ip}\n`;
    (0, exports.logger)('request', message);
    next();
};
exports.logRequest = logRequest;
const logError = (error) => {
    const date = (0, date_fns_1.format)(new Date(), "dd/MM/yyyy HH:mm:ss");
    const message = `[${date}]\t${error.message}\t${error.stack}]\n`;
    (0, exports.logger)('error', message);
};
exports.logError = logError;
// @ts-ignore - to ignore the warning of unused parameters
const logExpressError = (error, req, res, next) => {
    const date = (0, date_fns_1.format)(new Date(), "dd/MM/yyyy HH:mm:ss");
    const message = `[${date}]\t${req.method}\t${req.url}\t${error.message}\t${error.stack}]`;
    (0, exports.logger)('express-error', message);
};
exports.logExpressError = logExpressError;
