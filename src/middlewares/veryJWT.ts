import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import handleInternalError from './handleError';
import AuthenticatedRequest from '../models/AuthenticatedRequest';
import User from '../models/User';

/**
 * @description Verify JWT token
 * @route GET /verify
 * @access Public
 */
const verifyJWT = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {

    try {

        const authHeader = req.headers.authorization || req.headers.Authorization;

        if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (!process.env.ACCESS_TOKEN_SECRET) {
            return handleInternalError(res, new Error('Unable to find access token secret'));
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // if (!decoded) {
        //     return res.status(403).json({ message: 'Forbidden' });
        // }

        if (!decoded || typeof decoded == "string" || !decoded?.UserInfo?.username) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = await User.findOne({ username: decoded.UserInfo.username })

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.user = user;
        next();


    } catch (error) {
        if (error instanceof Error && error.message === 'jwt expired') {
            return res.status(401).json({ message: 'Unauthorized' });             
        }
        handleInternalError(res, error);
    }


};

export default verifyJWT;
