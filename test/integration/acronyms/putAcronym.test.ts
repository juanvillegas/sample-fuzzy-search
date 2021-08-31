import {assert} from 'chai';
import request from 'supertest';
import App from '../../../src/app';
import ServiceProvider from '../../../src/modules/services/ServiceProvider';
import {generateAuthHeader, makePutAcronymRequest} from '../../../src/helpers/testHelpers';

describe('put acronyms', async function () {

    let repository: any;
    let endpoint = '/acronym';
    const authHeader = generateAuthHeader();

    beforeEach(function () {
        repository = ServiceProvider.singleton('AcronymRepository');
    });

    describe('Authorization header', function () {
        it('Should return a 401 when Authorization header is not provided', async function () {
            await repository.create({ value: 'exists', definition: 'def' });
            await request(App).put(`${endpoint}/exists`).send({
                definition: 'def_v2'
            }).expect(401);
        });

        it('Should return a 401 when invalid Authorization details are provided', async function () {
            await repository.create({ value: 'exists', definition: 'def' });
            await request(App).put(`${endpoint}/exists`).set('Authorization', '123').send({
                definition: 'def_v2'
            }).expect(401);

            await request(App).put(`${endpoint}/exists`).set('Authorization', 'Basic 123').send({
                definition: 'def_v2'
            }).expect(401);

            let buffer = new Buffer('admin:incorrect', 'base64');
            let data = buffer.toString('base64');
            await request(App).put(`${endpoint}/exists`).set('Authorization', `Basic ${data}`).send({
                definition: 'def_v2'
            }).expect(401);
        });

        it('Should return a 401 when invalid Authorization details are provided', async function () {
            await repository.create({ value: 'exists', definition: 'def' });

            let buffer = new Buffer('admin:123123123', 'base64');
            let data = buffer.toString('base64');

            await request(App).put(`${endpoint}/exists`).set('Authorization', `Basic ${data}`).send({
                definition: 'def_v2'
            }).expect(401);
        });
    });

    it('should update an acronym when given correct parameters', async function () {
        await repository.create({ value: 'exists', definition: 'def' });

        await request(App).put(`${endpoint}/exists`).set('authorization', authHeader).send({
            definition: 'def_v2'
        }).expect(200);

        assert.equal(repository.size(), 1);

        const found = await repository.retrieveByValue('exists');
        assert.equal(found.definition, 'def_v2');
    });

    it('should throw an error if the given `value` doesnt exist', async function () {
        await request(App).put(`${endpoint}/NOE`).set('authorization', authHeader).send({
            definition: 'def'
        }).expect(404);
    });

    describe('Error paths', function () {

        it('should return a 404 when `value` is not given', async function () {
            await makePutAcronymRequest(App, '/', {
                definition: 'def'
            }).expect(404);

            await makePutAcronymRequest(App, '', {
                definition: 'def'
            }).expect(404);
        });

        it('should return a 422 when `definition` is not given', async function () {
            await makePutAcronymRequest(App, '/value', {
            }).expect(422);
        });

    });

});
