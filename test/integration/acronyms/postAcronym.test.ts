import {assert} from 'chai';
import request from 'supertest';
import App from '../../../src/app';
import ServiceProvider from '../../../src/modules/services/ServiceProvider';
import {makePostAcronymRequest} from '../../../src/helpers/testHelpers';

describe('post acronyms', async function () {

    let repository: any;
    let endpoint = '/acronym';

    beforeEach(function () {
        repository = ServiceProvider.singleton('AcronymRepository');
    });

    it('should create a new acronym when given correct parameters', async function () {
        await request(App).post(`${endpoint}`).send({
            value: 'new',
            definition: 'def'
        }).expect(201);

        assert.equal(repository.size(), 1);
    });

    it('should throw an error if the acronym already exists', async function () {
        repository.create({ value: 'new', definition: 'def' });

        const response = await request(App).post(`${endpoint}`).send({
            value: 'new',
            definition: 'def'
        }).expect(422);

        assert.equal(response.body.error, 'resource_already_exists');
    });

    describe('Error paths', function () {

        it('should return a 422 when `value` is not given', async function () {
            await makePostAcronymRequest(App, {
                definition: 'def'
            }).expect(422);
        });

        it('should return a 422 when `value` exceeds 20 characters', async function () {
            await makePostAcronymRequest(App, {
                value: 'abcdeabcdeabcdeabcdeabcde',
                defintion: 'value',
            }).expect(422);
        });

        it('should return a 422 when `value` is not a string', async function () {
            await makePostAcronymRequest(App, { value: [], defintion: 'value' }).expect(422);
            await makePostAcronymRequest(App, { value: {}, defintion: 'value' }).expect(422);
            await makePostAcronymRequest(App, { value: 1, defintion: 'value' }).expect(422);
            await makePostAcronymRequest(App, { value: null, defintion: 'value' }).expect(422);
        });

        it('should return a 422 when `definition` is not given', async function () {
            await makePostAcronymRequest(App, {
                value: 'value'
            }).expect(422);
        });

        it('should return a 422 when `definition` exceeds 255 characters', async function () {
            const aVeryLongString = `Meaning excitement, approval or display of energy (i.e. throwing something)Meaning excitement, approval or display of energy (i.e. throwing something)Meaning excitement, approval or display of energy (i.e. throwing something)Meaning excitement, approval or display of energy (i.e. throwing something)`;
            await makePostAcronymRequest(App, {
                value: 'value',
                definition: aVeryLongString,
            }).expect(422);
        });

        it('should return a 422 when `definition` is not a string', async function () {
            await makePostAcronymRequest(App, { definition: [], value: 'value' }).expect(422);
            await makePostAcronymRequest(App, { definition: {}, value: 'value' }).expect(422);
            await makePostAcronymRequest(App, { definition: 1, value: 'value' }).expect(422);
            await makePostAcronymRequest(App, { definition: null, value: 'value' }).expect(422);
        });

    });

});
