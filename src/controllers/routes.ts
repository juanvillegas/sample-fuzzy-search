import {Express, Request, Response} from 'express';
import ServiceProvider from '../modules/services/ServiceProvider';
import GetAcronymsController from './getAcronyms/GetAcronymsController';
import PostAcronymsController from './postAcronyms/PostAcronymsController';
import authorizationMiddleware from '../modules/authorization/authorizationMiddleware';
import PutAcronymsController from './putAcronyms/PutAcronymsController';
import DeleteAcronymsController from './deleteAcronyms/DeleteAcronymsController';

function router(app: Express) {

    app.get('/acronym', [
        (req: Request, res: Response, next: Function) => {
            const acronymService = ServiceProvider.singleton('AcronymService');
            return new GetAcronymsController(acronymService, req, res).execute().catch(e => next(e));
        }]
    );

    app.post('/acronym', [
        (req: Request, res: Response, next: Function) => {
            const acronymService = ServiceProvider.singleton('AcronymService');
            return new PostAcronymsController(acronymService, req, res).execute().catch(e => next(e));
        }
    ]);

    app.put('/acronym/:value', [
        authorizationMiddleware,
        (req: Request, res: Response, next: Function) => {
            const acronymService = ServiceProvider.singleton('AcronymService');
            return new PutAcronymsController(acronymService, req, res).execute().catch(e => next(e));
        }
    ]);

    app.delete('/acronym/:value', [
        authorizationMiddleware,
        (req: Request, res: Response, next: Function) => {
            const acronymService = ServiceProvider.singleton('AcronymService');
            return new DeleteAcronymsController(acronymService, req, res).execute().catch(e => next(e));
        }
    ]);

}

export default router;
