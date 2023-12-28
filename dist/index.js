"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./config/config");
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const db_1 = __importDefault(require("./config/db"));
const cors_1 = __importDefault(require("cors"));
const logger_1 = require("./middlewares/logger");
const index_1 = __importDefault(require("./router/index"));
const port = process.env.PORT ? Number(process.env.PORT) : 1337;
(0, db_1.default)()
    .then(() => {
    const app = (0, express_1.default)();
    app.use(logger_1.logExpressError);
    app.use((0, cors_1.default)({
        origin: "http://localhost:5173",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"],
    }));
    app.use(logger_1.logRequest);
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use((0, cookie_parser_1.default)());
    app.use('/', index_1.default);
    app.listen(port, () => console.log(`server is running at port ${port}`));
})
    .catch((error) => {
    (0, logger_1.logError)(error);
    console.log(error);
});
