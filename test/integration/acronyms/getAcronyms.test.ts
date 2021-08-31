import {assert} from 'chai';
import request from 'supertest';
import App from '../../../src/app';
import {assertIsAcronym, makeGetAcronymRequest} from '../../../src/helpers/testHelpers';
import ServiceProvider from '../../../src/modules/services/ServiceProvider';

describe('get acronyms', async function () {

    let repository: any;
    let endpoint = '/acronym';

    beforeEach(function () {
        repository = ServiceProvider.singleton('AcronymRepository');
    });

    it('Should use default parameters', function () {
        it('should return an array of clinics', async function () {
            await repository.create({ value: 'a', definition: 'test' });

            const response = await request(App).get(`${endpoint}`).expect(200);

            assert.isArray(response.body);
            assert.isOk(response.body.length > 0);
            response.body.forEach((acronym:any) => {
                assertIsAcronym(acronym);
            });
        });
    });

    describe('When provided a search parameter', function () {

       it('should return results matching `search` doing a fuzzy search', async function () {
           await repository.create({ value: 'fuz', definition: 'test' });
           await repository.create({ value: 'fuzzy', definition: 'test1' });
           await repository.create({ value: 'fuzzyto', definition: 'test2' });

           const response = await request(App).get(`${endpoint}?search=fuz`).expect(200)

           assert.isArray(response.body);
           assert.equal(response.body.length, 3);
       });

       it('should return results matching `search` doing a fuzzy search', async function () {
           await repository.create({ value: 'fuz', definition: 'test' });
           await repository.create({ value: 'fuzzy', definition: 'test1' });
           await repository.create({ value: 'fuzzyto', definition: 'test2' });

           const response = await request(App).get(`${endpoint}?search=fuzz`).expect(200)

           assert.isArray(response.body);
           assert.equal(response.body.length, 2);
       });

       it('should return results matching `search` doing a fuzzy search', async function () {
           await repository.create({ value: 'fuz', definition: 'test' });
           await repository.create({ value: 'fuzzy', definition: 'test1' });
           await repository.create({ value: 'fuzzyto', definition: 'test2' });

           const response = await request(App).get(`${endpoint}?search=zzy`).expect(200)

           assert.isArray(response.body);
           assert.equal(response.body.length, 2);
       });

       it('should return results matching `search` doing a fuzzy search (II)', async function () {
           await repository.create({ value: 'fuz', definition: 'test' });
           await repository.create({ value: 'fuzzy', definition: 'test1' });
           await repository.create({ value: 'fuzzyto', definition: 'test2' });

           const response = await request(App).get(`${endpoint}?search=zyta`).expect(200);

           assert.isArray(response.body);
           assert.equal(response.body.length, 0);
       });
   });

    describe('When provided a limit parameter', function () {

        it('should return a maximum of `limit` entries', async function () {
            await repository.create({ value: 'a', definition: 'test' });
            await repository.create({ value: 'a', definition: 'test2' });
            await repository.create({ value: 'a', definition: 'test3' });

            const limits = [1, 3];

            for (let limit of limits) {
                const response = await request(App).get(`${endpoint}?limit=${limit}`);

                assert.isArray(response.body);
                assert.equal(response.body.length, limit);
                assert.equal(response.body[0].value, 'a');
            }
        });

    });

    describe('When provided a `from` parameter', function () {

        it('should skip `from` entries when `from` is provided', async function () {
            await repository.create({ value: 'from', definition: 'def1' });
            await repository.create({ value: 'from2', definition: 'def2' });
            await repository.create({ value: 'from3', definition: 'def3' });

            const response = await request(App).get(`${endpoint}?search=from&from=1`);

            assert.isArray(response.body);
            assert.equal(response.body.length, 2);
            assert.equal(response.body[0].value, 'from2');
            assert.equal(response.body[0].definition, 'def2');
        });
    });

    describe('Pagination', function () {
        it('should provide a Link header indicating that there are more entries', async function () {
            for (let i = 1; i <= 20; i++) {
                await repository.create({ value: `item${i}`, definition: `def${i}` });
            }

            let response = await request(App).get(`${endpoint}?from=0&limit=5`);
            assert.isString(response.headers.link);
            let nextRequest = response.headers.link;
            assert.equal(nextRequest, '/acronym?limit=5&from=5');

            response = await request(App).get(nextRequest);
            assert.isString(response.headers.link);
            nextRequest = response.headers.link;
            assert.equal(nextRequest, '/acronym?limit=5&from=10');

            response = await request(App).get(nextRequest);
            assert.isString(response.headers.link);
            nextRequest = response.headers.link;
            assert.equal(nextRequest, '/acronym?limit=5&from=15');

            response = await request(App).get(nextRequest);
            assert.isUndefined(response.headers.link); // because we reach the last element
        });
    })

    describe('Error paths', function () {

        it('should return a 422 when given an invalid `limit`', async function () {
            await makeGetAcronymRequest(App, '?limit=a').expect(422);
            await makeGetAcronymRequest(App, '?limit=_').expect(422);
            await makeGetAcronymRequest(App, '?limit=[]').expect(422);
        });

        it('should return a 422 when given an invalid `from`', async function () {
            await makeGetAcronymRequest(App, '?from=a').expect(422);
            await makeGetAcronymRequest(App, '?from=_').expect(422);
            await makeGetAcronymRequest(App, '?from=[]').expect(422);
        });

        it('should return a 422 when given `search` exceeds the max 20 chars allowed', async function () {
            await makeGetAcronymRequest(App, '?search=abcabcabcabcabcabcabc').expect(422);
        });

    });

});
