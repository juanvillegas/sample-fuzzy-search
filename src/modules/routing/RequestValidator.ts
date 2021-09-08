import {Request} from 'express';
import {validateAll} from 'indicative/validator';

/**
 * An abstract class implementing the Template Method Pattern in order to
 * simplify how requests are validated. Implementors only have to provide concrete versions of
 * `getSchema` and `getData` in order to validate requests.
 */
export default abstract class RequestValidator {

    async validate(req: Request): Promise<void> {
        const schema = this.getSchema();
        const data = this.getData(req);

        await validateAll(data, schema);
    }

    abstract getSchema(): any;

    abstract getData(req: Request): object;

}
