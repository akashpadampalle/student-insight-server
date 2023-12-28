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
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db_user = process.env.DB_USER || "";
        const db_password = process.env.DB_PASSWORD || "";
        const db_url = `mongodb+srv://${db_user}:${db_password}@cluster0.m47z4i4.mongodb.net/?retryWrites=true&w=majority`;
        yield mongoose_1.default.connect(db_url);
        console.log("connected to db");
        return mongoose_1.default.connection;
    }
    catch (error) {
        return error;
    }
});
exports.default = connectDB;
