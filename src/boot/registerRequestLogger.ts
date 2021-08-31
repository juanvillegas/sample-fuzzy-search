import {Express, Request, Response} from 'express';

function registerRequestLogger(app : Express) {

    app.use(function(req: Request, res: Response, next: Function) {
        console.log(`Request: ${req.method} ${req.url} Query: ${JSON.stringify(req.query)} Body: ${JSON.stringify(req.body)}`);

        next();
    });

}

export default registerRequestLogger;
