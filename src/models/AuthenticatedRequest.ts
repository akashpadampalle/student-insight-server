import { Request } from "express";
import { IUser } from "./User";

export default interface AuthenticatedRequest extends Request{
    user?: IUser
}