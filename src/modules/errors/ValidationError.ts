class ValidationError extends Error {

    status: number;
    code: string;

    constructor(message: string, code:string = 'validation_error', status: number = 422) {
        super(message);
        this.status = status;
        this.code = code;
    }

}

export default ValidationError;
