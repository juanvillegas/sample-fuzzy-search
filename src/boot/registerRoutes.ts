import {Express, Request, Response} from 'express';
import router from '../controllers/routes';

function registerRoutes(app : Express) {

    app.get('/ping', (req: Request, res: Response, next: Function) => {
        res.send('pong!');
    });

    router(app);

    app.all('*', function(req, res){
        res.status(404);
        res.send('');
    });

}

export default registerRoutes;
