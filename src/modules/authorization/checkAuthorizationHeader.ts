import AuthorizationError from '../errors/AuthorizationError';

// NOTE: for demonstration purposes only. In a real scenario, these data would be properly stored in a database
// and the passwords would be one way hashed.
const hardCodedUsernamePasswordDatabase = {
    admin: '123123123',
    user1: '333333333'
};

export default function checkAuthorizationHeader(header: string) {
    if (!header) {
        throw new AuthorizationError('Missing authorization header.');
    }

    // @ts-ignore
    const [type, inputDetails] = header.split(' ');

    if (!type || type !== 'Basic' || !inputDetails) {
        throw new AuthorizationError('Invalid authorization details provided.');
    }

    let buffer = new Buffer(inputDetails, 'base64');
    let data = buffer.toString('ascii');
    let [username, password] = data.split(':');

    // @ts-ignore
    if (!hardCodedUsernamePasswordDatabase[username] || hardCodedUsernamePasswordDatabase[username] !== password) {
        throw new AuthorizationError();
    }
}
