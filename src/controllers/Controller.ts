import {Request, Response} from 'express';
import ValidationError from '../modules/errors/ValidationError';

abstract class Controller {

    req: Request;
    res: Response;

    protected constructor(req : Request, res : Response) {
        this.req = req;
        this.res = res;
    }

    async execute() {
        await this.validate();

        const data = await this.getData();

        const result = await this.handle(data);

        await this.respond(result);
    }

    async validate(): Promise<void> {
        try {
            await this.doValidation();
        } catch (e) {
            throw new ValidationError('Invalid request');
        }
    }

    abstract doValidation(): Promise<void>;

    getData() : object {
        return {};
    }

    async respond(result : Object) {
        return this.res.send(result);
    }

    async handle(data : object) : Promise<Object> {
        return {};
    }

}

export default Controller;
