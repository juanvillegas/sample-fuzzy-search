import {Request} from 'express';
import {validateAll} from 'indicative/validator';

export default abstract class RequestValidator {

    async validate(req: Request): Promise<void> {
        const schema = this.getSchema();
        const data = this.getData(req);

        await validateAll(data, schema);
    }

    abstract getSchema(): any;

    abstract getData(req: Request): object;

}
