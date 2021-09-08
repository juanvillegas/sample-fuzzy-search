import {Request, Response} from 'express';
import AuthorizationError from '../errors/AuthorizationError';
import checkAuthorizationHeader from './checkAuthorizationHeader';

export default function(req: Request, res: Response, next: Function) {
    if (!req.headers.authorization) {
        return next(new AuthorizationError());
    }

    checkAuthorizationHeader(req.headers.authorization);
    next();
};
