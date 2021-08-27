import {Express, Request, Response} from 'express';

function registerRoutes(app : Express) {

    app.get('/', async (req: Request, res: Response, next: Function) => {
        res.send('Index of API-sample');
    });

    app.get('/TODO', async (req: Request, res: Response, next: Function) => {
        res.send('Works!');
        // TODO:
    });

}

export default registerRoutes;
