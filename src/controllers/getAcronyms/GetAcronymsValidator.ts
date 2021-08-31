import RequestValidator from '../RequestValidator';
import {Request} from 'express';

class GetAcronymsValidator extends RequestValidator {

    getData(req: Request): object {
        return {
            ...req.query
        };
    }

    getSchema(): any {
        return {
            from: 'number|above:-1',
            limit: 'number|above:0',
            search: 'string|max:20'
        };
    }

}

export default GetAcronymsValidator;
