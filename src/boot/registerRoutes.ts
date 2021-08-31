import {Express, Request, Response} from 'express';
import GetAcronymsController from '../controllers/getAcronyms/GetAcronymsController';
import AcronymsService from '../modules/acronym/services/AcronymsService';
import ServiceProvider from '../modules/services/ServiceProvider';
import PostAcronymsController from '../controllers/postAcronyms/PostAcronymsController';
import PutAcronymsController from '../controllers/putAcronyms/PutAcronymsController';
import DeleteAcronymsController from '../controllers/deleteAcronyms/DeleteAcronymsController';
import AuthorizationError from '../modules/errors/AuthorizationError';
import checkAuthorizationHeader from '../modules/authorization/checkAuthorizationHeader';

function registerRoutes(app : Express) {

    app.use(function(req: Request, res: Response, next: Function) {
        if (req.method === 'PUT' || req.method === 'DELETE') {
            if (!req.headers.authorization) {
                return next(new AuthorizationError());
            }

            checkAuthorizationHeader(req.headers.authorization);
        }

        next();
    });

    app.get('/', async (req: Request, res: Response, next: Function) => {
        res.send('Index of API-sample');
    });

    app.get('/acronym', async (req: Request, res: Response, next: Function) => {
        const repository = ServiceProvider.singleton('AcronymRepository');
        return new GetAcronymsController(new AcronymsService(repository), req, res).execute().catch(e => next(e));
    });

    app.post('/acronym', async (req: Request, res: Response, next: Function) => {
        const repository = ServiceProvider.singleton('AcronymRepository');
        return new PostAcronymsController(new AcronymsService(repository), req, res).execute().catch(e => next(e));
    });

    app.put('/acronym/:value', async (req: Request, res: Response, next: Function) => {
        const repository = ServiceProvider.singleton('AcronymRepository');
        return new PutAcronymsController(new AcronymsService(repository), req, res).execute().catch(e => next(e));
    });

    app.delete('/acronym/:value', async (req: Request, res: Response, next: Function) => {
        const repository = ServiceProvider.singleton('AcronymRepository');
        return new DeleteAcronymsController(new AcronymsService(repository), req, res).execute().catch(e => next(e));
    });

}

export default registerRoutes;
