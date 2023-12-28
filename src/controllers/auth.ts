

import User from '../models/User'
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import handleInternalError from '../middlewares/handleError'
import { Request, Response } from 'express'

/**
 * @description Login
 * @route POST /auth
 * @access Public
 */
export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;


        if (
            !username || typeof username != "string" ||
            !password || typeof password != "string"
        ) {
            return res.status(400).json({
                message: 'All fields are required',
            });
        }

        const foundUser = await User.findOne({ username }).exec();

        if (!foundUser) {
            return res.status(401).json({
                message: 'Unauthorized',
            });
        }

        const match = await bcrypt.compare(password, foundUser.password);

        if (!match) {
            return res.status(401).json({
                message: 'Unauthorized',
            });
        }

        const accessToken = jwt.sign(
            {
                UserInfo: {
                    username: foundUser.username,
                },
            },
            process.env.ACCESS_TOKEN_SECRET!,
            { expiresIn: '10s' }
        );

        const refreshToken = jwt.sign(
            { username: foundUser.username },
            process.env.REFRESH_TOKEN_SECRET!,
            { expiresIn: '7d' }
        );

        // create a secure cookie with refresh token
        res.cookie('jwt', refreshToken, {
            httpOnly: true, // accessible only by web browser
            secure: true, // https
            sameSite: 'none', // cross-site cookie
            maxAge: 1000 * 60 * 60 * 24 * 7, // cookie-expiry: set to match refresh token
        });

        // send accessToken containing username and roles
        res.json({
            accessToken,
            user: { ...foundUser.toJSON(), password: undefined }
        });
    } catch (error) {
        handleInternalError(res, error);
    }
};



/**
 * @description Refresh
 * @route GET /auth/refresh
 * @access Public - because access token has expired
 */
export const refresh = async (req: Request, res: Response) => {
    try {
        const cookies = req.cookies;

        console.log(cookies)

        if (!cookies?.jwt) {
            return res.status(400).json({ message: 'Unauthorized' });
        }

        const refreshToken = cookies.jwt;

        if (!process.env.REFRESH_TOKEN_SECRET || !process.env.ACCESS_TOKEN_SECRET) {
            return handleInternalError(
                res,
                new Error('Unable to find token secret')
            );
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET) as { username: string };
        const foundUser = await User.findOne({ username: decoded.username });

        if (!foundUser) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const accessToken = jwt.sign(
            {
                UserInfo: {
                    username: foundUser.username,
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '10s' }
        );

        // send accessToken containing username
        res.json({
            accessToken,
            user: { ...foundUser.toJSON(), password: undefined }
        });
    } catch (error) {
        handleInternalError(res, error);
    }
};



/**
 * @description Logout
 * @route POST /auth/logout
 * @access Public - just to clear cookie if exists
 */
export const logout = (req: Request, res: Response) => {
    const cookies = req.cookies

    if (!cookies?.jwt) {
        return res.sendStatus(204)
    }

    res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'none' })

    res.json({ message: 'Cookie cleared' })
}
