import Controller from '../../modules/routing/Controller';
import {Request, Response} from 'express';
import AcronymsService from '../../modules/acronym/services/AcronymsService';
import PostAcronymsData from './PostAcronymsData';
import PostAcronymsValidator from './PostAcronymsValidator';

class PostAcronymsController extends Controller {

    private acronymsService: AcronymsService;

    constructor(acronymsService: AcronymsService, req : Request, res : Response) {
        super(req, res);
        this.acronymsService = acronymsService;
    }

    async handle(data: PostAcronymsData): Promise<object> {
        await this.acronymsService.createAcronym(data);

        this.res.status(201);

        return {};
    }

    getRequestData(): PostAcronymsData {
        return {
            value: this.req.body.value.toString(),
            definition: this.req.body.definition.toString(),
        };
    }

    async doValidation(): Promise<void> {
        return await new PostAcronymsValidator().validate(this.req);
    }

}

export default PostAcronymsController;
