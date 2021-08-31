import {Request} from 'express';
import RequestValidator from '../RequestValidator';

class PutAcronymsValidator extends RequestValidator {

    getData(req: Request): object {
        return {
            value: req.params.value,
            definition: req.body.definition,
        };
    }

    getSchema(): any {
        return {
            value: 'required|string',
            definition: 'required|string',
        };
    }

}

export default PutAcronymsValidator;
