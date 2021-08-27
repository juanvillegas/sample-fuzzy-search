class ValidationError extends Error {

    status: number;

    constructor(message: string, status: number = 422) {
        super(message);
        this.status = status;
    }

}

export default ValidationError;
