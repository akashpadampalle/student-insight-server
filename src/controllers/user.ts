import { Request, Response } from "express";
import handleInternalError from "../middlewares/handleError";
import User from "../models/User";
import { Types } from "mongoose";
import bcrypt from "bcrypt"


export const getAll = async (_: Request, res: Response) => {
    try {

        const users = await User.find();
        return res.status(200).json(users);

    } catch (error) {
        handleInternalError(res, error);
    }
}


export const get = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id || !Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid data provided. please check required data and it's types." });
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
        return res.status(404).json({ message: `User with ID ${id} not found.` });
    }

    return res.status(200).json(user);

}


/**
 * @description Create a new user
 * @route POST /users
 * @access Public
 */
export const create = async (req: Request, res: Response) => {
    const { username, password }: { username: string; password: string } = req.body;

    if (
        !username || typeof username != "string" ||
        !password || typeof password != "string"
    ) {
        return res.status(400).json({ message: 'Invalid data provided. Please check required data and its types.' });
    }

    const existringUser = await User.findOne({ username });

    

    if (existringUser) {
        return res.status(401).json({ message: `Username ${username} is already in use.` });
    }

    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = await User.create({ username, password: hashedPassword });

    if (!user) {
        return res.status(500).json({ message: 'Unable to create user' });
    }

    const userToSend = { username: user.username, type: user.type, _id: user._id };
    res.status(201).json(userToSend);
};


/**
 * @description Update a user
 * @route PUT /users/:id
 * @access Public
 */
export const update = async (req: Request, res: Response) => {
    const { id, username, password }: { id: string; username: string; password: string } = req.body;

    if (!id || !Types.ObjectId.isValid(id) || !username || typeof username !== 'string') {
        return res.status(400).json({ message: "Invalid data provided. Please check required data and its types." });
    }

    const user = await User.findById(id);

    if (!user) {
        return res.status(404).json({ message: `User with ID ${id} not found.` });
    }

    const existingUser = await User.findOne({ username });

    if (existingUser && user._id.toString() !== existingUser._id.toString()) {
        return res.status(401).json({ message: `Username ${username} is already taken.` });
    }

    user.username = username;

    if (password && typeof password === 'string') {
        const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        user.password = hashedPassword;
    }

    await user.save();

    const userToSend = { ...user.toJSON(), password: undefined };

    res.status(201).json(userToSend);
};



export const remove = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id || !Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid data provided. please check required data and it's types." });
    }

    await User.findByIdAndDelete(id);
    return res.status(204).json({});

}