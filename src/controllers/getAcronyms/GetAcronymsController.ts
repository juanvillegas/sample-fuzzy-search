import Controller from '../../modules/routing/Controller';
import {Request, Response} from 'express';
import GetAcronymsData from './GetAcronymsData';
import Acronym from '../../modules/acronym/types/Acronym';
import AcronymsService from '../../modules/acronym/services/AcronymsService';
import GetAcronymsValidator from './GetAcronymsValidator';

class GetAcronymsController extends Controller {

    private acronymsService: AcronymsService;

    constructor(acronymsService: AcronymsService, req : Request, res : Response) {
        super(req, res);
        this.acronymsService = acronymsService;
    }

    async handle(data: GetAcronymsData): Promise<Acronym[]> {
        const retrieveResult = await this.acronymsService.retrieveAcronyms(data);

        if (retrieveResult.hasMore) {
            this.res.setHeader('Link', `/acronym?limit=${data.limit}&from=${data.limit + data.from}; rel="next"`);
        }

        return retrieveResult.entries;
    }

    getRequestData(): GetAcronymsData {
        return {
            from: this.req.query.from ? parseInt(this.req.query.from.toString()) : 0,
            limit: this.req.query.limit ? parseInt(this.req.query.limit.toString()) : 20,
            search: this.req.query.search ? this.req.query.search.toString() : '',
        };
    }

    async doValidation(): Promise<void> {
        return await new GetAcronymsValidator().validate(this.req);
    }

}

export default GetAcronymsController;
