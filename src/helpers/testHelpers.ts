import {assert} from 'chai';
import request from 'supertest';

function assertIsAcronym(acronym : any) {
    assert.isString(acronym.value);
    assert.isString(acronym.definition);
}

function makeDeleteRequest(App: any, path: string) {
    return makeRequest(App, path, 'delete', true);
}

function generateAuthHeader(): string {
    let buffer = new Buffer('admin:123123123');
    return `Basic ${buffer.toString('base64')}`;
}

function makeGetAcronymRequest(App: any, path: string) {
    return makeRequest(App, path, 'get', false);
}

function makePostAcronymRequest(App: any, body: object) {
    return makeRequest(App, '', 'post', false, body);
}

function makePutAcronymRequest(App: any, path: string, body: object) {
    return makeRequest(App, path, 'put', true, body);
}

function makeRequest(App: any, path: string, verb: string, auth: boolean, body: object|null = null) {
    let endpoint = '/acronym';
    // @ts-ignore
    let newRequest = request(App)[verb](`${endpoint}${path}`);

    if (body) {
        newRequest.send(body);
    }

    if (auth) {
        let authHeader = generateAuthHeader();
        newRequest.set('authorization', authHeader);
    }

    return newRequest;
}

export {
    makeRequest,
    makePutAcronymRequest,
    makeDeleteRequest,
    makePostAcronymRequest,
    makeGetAcronymRequest,
    assertIsAcronym,
    generateAuthHeader,
};
