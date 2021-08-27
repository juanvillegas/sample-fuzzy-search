import {Request, Response} from 'express';

export default function globalErrorHandler(err: any, req: Request, res: Response, next: Function) {
    res.status(err.status ? err.status : 500);
    res.send();
}
