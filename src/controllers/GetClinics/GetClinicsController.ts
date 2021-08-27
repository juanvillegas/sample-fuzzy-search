import Controller from '../Controller';
import {Request, Response} from 'express';
import GetClinicsData from './GetClinicsData';

class GetClinicsController extends Controller {

    // private clinicsService: GetClinicsService;

    constructor(req : Request, res : Response) {
        super(req, res);
        // this.clinicsService = clinicsService;
    }

    async handle(data : GetClinicsData): Promise<Object> {
        return {};
        // return this.clinicsService.execute(data);
    }

    getData(): GetClinicsData {
        // TODO:
        return {
            name: this.req.query.name?.toString(),
            state: this.req.query.state?.toString(),
            from: this.req.query.from?.toString(),
            to: this.req.query.to?.toString(),
        };
    }

    async doValidation(): Promise<void> {
        // return new GetClinicsValidator().validate(this.req.query);
    }

}

export default GetClinicsController;
