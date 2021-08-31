import {assert} from 'chai';
import App from '../../../src/app';
import ServiceProvider from '../../../src/modules/services/ServiceProvider';
import {makeDeleteRequest} from '../../../src/helpers/testHelpers';

describe('delete acronyms', async function () {

    let repository: any;

    beforeEach(function () {
        repository = ServiceProvider.singleton('AcronymRepository');
    });

    it('should delete an acronym when given a `value` that exists in the database', async function () {
        await repository.create({ value: 'exists', definition: 'def' });

        const response = await makeDeleteRequest(App, '/exists').expect(200);

        assert.equal(repository.size(), 0);
        assert.isEmpty(response.body);
    });

    it('should throw an error if the given `value` doesnt exist', async function () {
        await makeDeleteRequest(App, '/NOE').send({
            definition: 'def'
        }).expect(404);
    });

    describe('Error paths', function () {

        it('should return a 404 when the :acronym parameter is missing', async function () {
            await makeDeleteRequest(App, '/').expect(404);
            await makeDeleteRequest(App, '').expect(404);
        });

    });

});
