import { Schema, model, Document } from "mongoose";

export type UserType = "Empolyee" | "Admin";

export interface IUser {
    username: string,
    password: string,
    type: UserType,
    createdAt: string,
    updatedAt: string
};


export interface UserModel extends IUser, Document {};

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["Empolyee", "Admin"],
        default: "Empolyee"
    }
});


const User = model<UserModel>("User", userSchema);

export default User