import RequestValidator from '../../modules/routing/RequestValidator';
import {Request} from 'express';

class PostAcronymsValidator extends RequestValidator {

    getData(req: Request): any {
        return {
            ...req.body
        }
    }

    getSchema() {
        return {
            value: 'required|string|max:20',
            definition: 'required|string|max:255',
        };
    }

}

export default PostAcronymsValidator;
