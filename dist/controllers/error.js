"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundError = void 0;
const notFoundError = (_, res) => {
    return res.status(404).json({ message: "Page Not Found." });
};
exports.notFoundError = notFoundError;
