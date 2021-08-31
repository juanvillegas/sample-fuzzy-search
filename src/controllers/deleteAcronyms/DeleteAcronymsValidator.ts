import {validateAll} from 'indicative/validator';
import {Request} from 'express';

class DeleteAcronymsValidator {

    async validate(req: Request) : Promise<void> {
        const schema = {
            value: 'required|string',
        };

        await validateAll({
            value: req.params.value,
        }, schema);
    }

}

export default DeleteAcronymsValidator;
