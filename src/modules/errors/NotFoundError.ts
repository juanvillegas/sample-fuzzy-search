class NotFoundError extends Error {

    status: number;
    code: string;

    constructor(message: string = 'Resource not found', code:string = 'not_found_error', status: number = 404) {
        super(message);
        this.status = status;
        this.code = code;
    }

}

export default NotFoundError;
