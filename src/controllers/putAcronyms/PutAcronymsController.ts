import Controller from '../../modules/routing/Controller';
import {Request, Response} from 'express';
import AcronymsService from '../../modules/acronym/services/AcronymsService';
import PutAcronymsData from './PutAcronymsData';
import PutAcronymsValidator from './PutAcronymsValidator';

class PutAcronymsController extends Controller {

    private acronymsService: AcronymsService;

    constructor(acronymsService: AcronymsService, req : Request, res : Response) {
        super(req, res);
        this.acronymsService = acronymsService;
    }

    async handle(data: PutAcronymsData): Promise<object> {
        await this.acronymsService.updateAcronym(data);

        this.res.status(200);

        return {};
    }

    getRequestData(): PutAcronymsData {
        return {
            value: this.req.params.value.toString(),
            definition: this.req.body.definition.toString(),
        };
    }

    async doValidation(): Promise<void> {
        return await new PutAcronymsValidator().validate(this.req);
    }

}

export default PutAcronymsController;
