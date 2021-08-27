import {validateAll} from 'indicative/validator';

class GetClinicsValidator {

    async validate(data : object) : Promise<void> {
        const schema = {};

        await validateAll({ ...data }, schema);
    }

}

export default GetClinicsValidator;
