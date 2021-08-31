import Controller from '../Controller';
import {Request, Response} from 'express';
import AcronymsService from '../../modules/acronym/services/AcronymsService';
import DeleteAcronymsData from './DeleteAcronymsData';
import DeleteAcronymsValidator from './DeleteAcronymsValidator';

class DeleteAcronymsController extends Controller {

    private acronymsService: AcronymsService;

    constructor(acronymsService: AcronymsService, req : Request, res : Response) {
        super(req, res);
        this.acronymsService = acronymsService;
    }

    async handle(data: DeleteAcronymsData): Promise<object> {
        await this.acronymsService.deleteAcronym(data.value);

        this.res.status(200);

        return {};
    }

    getRequestData(): DeleteAcronymsData {
        return {
            value: this.req.params.value.toString(),
        };
    }

    async doValidation(): Promise<void> {
        return new DeleteAcronymsValidator().validate(this.req);
    }

}

export default DeleteAcronymsController;
