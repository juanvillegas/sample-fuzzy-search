import {Request, Response} from 'express';

export default function errorHandler(err: any, req: Request, res: Response, next: Function) {
    handleLogError(err);
    handleResponse(res, err);
}

function handleLogError(err: any) {
    console.error(err);
}

function handleResponse(res: Response, err: any) {
    res.status(err.status ? err.status : 500);
    res.send({
        error: err.code ? err.code : 'server_error'
    });
}
