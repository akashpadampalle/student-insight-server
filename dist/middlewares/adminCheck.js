"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const adminCheck = (req, res, next) => {
    const user = req.user;
    if (!user || user.type !== "Admin") {
        return res.status(401).json({ messag: "User don't have admin access" });
    }
    next();
};
exports.default = adminCheck;
