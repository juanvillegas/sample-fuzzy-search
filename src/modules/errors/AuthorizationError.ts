class AuthorizationError extends Error {

    status: number;
    code: string;

    constructor(message: string = 'Authorization Error', code:string = 'authorization_error', status: number = 401) {
        super(message);
        this.status = status;
        this.code = code;
    }

}

export default AuthorizationError;
