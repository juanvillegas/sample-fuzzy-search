import {assert} from 'chai';
import request from 'supertest';
import App from '../../../src/index';

describe('getClinics', async function () {

    let endpoint = '/clinics';

    it('should return an array of clinics', async function () {
        const response = await request(App).get(endpoint);

        assert.isArray(response.body);
        for (let clinic of response.body) {
            assertIsAClinic(clinic);
        }
    });

    it('should filter clinics by name', async function () {
        const response = await request(App).get(`${endpoint}?name=Cleve`);

        const responseBody = response.body;

        assert.isArray(responseBody);
        for (let clinic of responseBody) {
            assertIsAClinic(clinic);
            assert.isOk(clinic.name.includes('Cleve'));
        }
    });

    it('should filter clinics by name (supports url encoded params)', async function () {
        const response = await request(App).get(`${endpoint}?name=Good%20Health%20Home`);

        const responseBody = response.body;

        assert.isArray(responseBody);
        assert.isOk(responseBody.length > 0);
        for (let clinic of responseBody) {
            assertIsAClinic(clinic);
            assert.isOk(clinic.name.includes('Good Health Home'));
        }
    });

    it('should filter clinics by state name', async function () {
        const filterState = 'Florida';
        const response = await request(App).get(`${endpoint}?state=${filterState}`);

        const responseBody = response.body;

        assert.isArray(responseBody);
        assert.isAbove(responseBody.length, 0);
        for (let clinic of responseBody) {
            assertIsAClinic(clinic);
            assert.equal(clinic.stateName, filterState);
        }
    });

    it('should filter clinics by state code', async function () {
        const filterState = 'FL';
        const response = await request(App).get(`${endpoint}?state=${filterState}`);

        const responseBody = response.body;

        assert.isArray(responseBody);
        assert.isAbove(responseBody.length, 0);
        for (let clinic of responseBody) {
            assertIsAClinic(clinic);
            assert.equal(clinic.stateName, 'Florida');
        }
    });

    it('should apply state name filter correctly (ignores case)', async function () {
        const filterState = 'FlORIDa';
        const response = await request(App).get(`${endpoint}?state=${filterState}`);

        const responseBody = response.body;

        assert.isArray(responseBody);
        assert.isAbove(responseBody.length, 0);
        for (let clinic of responseBody) {
            assertIsAClinic(clinic);
            assert.equal(clinic.stateName, 'Florida');
        }
    });

    it('should filter clinics by availability', async function () {
        const response = await request(App).get(`${endpoint}?from=08:00`);

        const responseBody = response.body;

        assert.isArray(responseBody);
        assert.isAbove(responseBody.length, 0);
        for (let clinic of responseBody) {
            assertIsAClinic(clinic);
            assert.isAtMost(Number.parseInt((clinic.availability.from).replace(':', '')), 800);
        }
    });

    it('should filter clinics by availability (to)', async function () {
        const response = await request(App).get(`${endpoint}?to=22:00`);

        const responseBody = response.body;

        assert.isArray(responseBody);
        assert.isAbove(responseBody.length, 0);
        for (let clinic of responseBody) {
            assertIsAClinic(clinic);
            assert.isAtLeast(Number.parseInt((clinic.availability.to).replace(':', '')), 2200);
        }
    });

    describe('Validations', function () {

        it('should throw an error if `name` is not a string', async function () {
            return request(App).get(`${endpoint}?name[]=1`).expect(422);
        });

        it('should throw an error if `name` is longer than allowed 50 chars', async function () {
            return request(App).get(`${endpoint}?name=12345678901234567890123456789012345678901234567890222`).expect(422);
        });

        it('should throw an error if `state` is not a string', async function () {
            return request(App).get(`${endpoint}?state[]=1`).expect(422);
        });

        it('should throw an error if `state` is longer than allowed 20 chars', async function () {
            return request(App).get(`${endpoint}?state=012345678901234567891`).expect(422);
        });

        it('should throw an error if `from` is not a string', async function () {
            return request(App).get(`${endpoint}?from[]=1`).expect(422);
        });

        it('should throw an error if `from` is not in the right format', async function () {
            return request(App).get(`${endpoint}?from=aa:bb`).expect(422);
        });

        it('should throw an error if `from` is not a valid time', async function () {
            return request(App).get(`${endpoint}?from=34:00`).expect(422);
        });

        it('should throw an error if `to` is not a string', async function () {
            return request(App).get(`${endpoint}?to[]=1`).expect(422);
        });

        it('should throw an error if `to` is not in the right format', async function () {
            return request(App).get(`${endpoint}?to=aa:bb`).expect(422);
        });

        it('should throw an error if `to` is not a valid time', async function () {
            return request(App).get(`${endpoint}?to=14:99`).expect(422);
        });

        it('should throw an error if `to` is not a valid time (test end of string)', async function () {
            return request(App).get(`${endpoint}?to=14:209`).expect(422);
        });

    })

});
