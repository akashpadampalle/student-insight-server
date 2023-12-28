"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./logger");
const handleInternalError = (res, error) => {
    if (error instanceof Error) {
        (0, logger_1.logError)(error);
    }
    return res.status(500).json({ message: "Internal server error" });
};
exports.default = handleInternalError;
