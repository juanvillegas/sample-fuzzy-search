import ServiceProvider from '../../src/modules/services/ServiceProvider';
import {assert} from 'chai';
import AcronymsService from '../../src/modules/acronym/services/AcronymsService';
import AcronymRepository from '../../src/modules/acronym/repositories/AcronymRepository';

describe('AcronymsService', async function () {

    describe('fuzzy search', function () {

        let repository: AcronymRepository;

        beforeEach(async function () {
            repository = ServiceProvider.singleton('AcronymRepository');
            await repository.clear();

            await repository.create({
                value: 'gr',
                definition: 'grounded'
            });

            await repository.create({
                value: 'gron',
                definition: 'definition'
            });

            await repository.create({
                value: 'ac',
                definition: 'aasdasdasd'
            });
        });

        it('should retrieve acronyms by fuzzy search', async function () {
            const instance = new AcronymsService(
                repository,
                ServiceProvider.singleton('AcronymSearcher')
            );

            const result = await instance.retrieveAcronyms({
                search: 'gr',
                from: 0,
                limit: 10,
            });

            assert.equal(result.entries.length, 2);
        });

        it('should retrieve an empty array when fuzzy search doesnt have matches', async function () {
            const instance = new AcronymsService(
                repository,
                ServiceProvider.singleton('AcronymSearcher')
            );

            const result = await instance.retrieveAcronyms({
                search: 'NOTHING to match',
                from: 0,
                limit: 10,
            });

            assert.equal(result.entries.length, 0);
        });

        it('should also use the `definition` field for fuzzy matching', async function () {
            const instance = new AcronymsService(
                repository,
                ServiceProvider.singleton('AcronymSearcher')
            );

            const result = await instance.retrieveAcronyms({
                search: 'def',
                from: 0,
                limit: 10,
            });

            assert.equal(result.entries.length, 1);
        });
    });

});
