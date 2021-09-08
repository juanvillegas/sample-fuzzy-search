import {Express, Request, Response} from 'express';
import router from '../controllers/routes';

function registerRoutes(app : Express) {

    app.get('/ping', (req: Request, res: Response, next: Function) => {
        res.send('pong!');
    });

    router(app);

}

export default registerRoutes;
