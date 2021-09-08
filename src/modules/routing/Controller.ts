import {Request, Response} from 'express';
import ValidationError from '../errors/ValidationError';

/**
 * This abstract Controller allows for simpler and faster controller creation.
 * It uses the Template Method Pattern to define a set of steps that every request should go through, and
 * allows subclasses to override the different steps as needed.
 */
abstract class Controller {

    req: Request;
    res: Response;

    protected constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }

    async execute() {
        await this.validate();

        const data = await this.getRequestData();

        const result = await this.handle(data);

        this.respond(result);
    }

    async validate(): Promise<void> {
        try {
            await this.doValidation();
        } catch (e) {
            throw new ValidationError('Invalid request');
        }
    }

    /**
     * Each controller must implement the required validation.
     * doValidation returns a void on success, and throws an Error on failure.
     * Returns a Promise in order to allow usage of async validators.
     */
    abstract doValidation(): Promise<void>;

    /**
     * Each controller should override this and build the required
     * data object using the current Request as source.
     */
    getRequestData(): object {
        return {};
    }

    respond(result: Object) {
        return this.res.send(result);
    }

    /**
     * This is the main handler method that should be implemented by each controller.
     * It must return a Promise that resolves to an Object, which is then used as the response's body.
     * @param data
     */
    abstract handle(data: object): Promise<Object>;

}


export default Controller;
