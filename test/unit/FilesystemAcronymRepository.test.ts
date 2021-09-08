import ServiceProvider from '../../src/modules/services/ServiceProvider';
import InMemoryAcronymRepository from '../../src/modules/acronym/repositories/InMemoryAcronymRepository';
import {assert} from 'chai';

describe('Filesystem Acronym Repository', async function () {

    let rootPath = ServiceProvider.instance('RootPath');

    it('should build up the database correctly from a file', async function () {
        const instance = InMemoryAcronymRepository.createFromFile(`${rootPath}/data/acronym.json`);
        assert.isObject(instance);
        assert.isOk(instance.size() > 0);
    });

    describe('Retrieve', function () {
        it('should retrieve an entry by value', async function () {
            const instance = new InMemoryAcronymRepository([{ value: 'test', definition: 'test def' }]);
            const entry = await instance.findByValue('test');
            assert.isNotNull(entry);
            if (entry) {
                assert.equal(entry.value, 'test');
                assert.equal(entry.definition, 'test def');
            }
        });

        it('should retrieve null if the entry doesnt exist', async function () {
            const instance = new InMemoryAcronymRepository([]);
            const entry = await instance.findByValue('test');
            assert.isNull(entry);
        });
    });

    describe('Create', function () {

        it('should create a new entry in the database', async function () {
            const instance = new InMemoryAcronymRepository([]);
            await instance.create({ value: 'test', definition: 'def' });

            assert.equal(instance.size(), 1);
            const retrieved = instance.findByValue('test');
            assert.isDefined(retrieved);
        });

    });

    describe('Delete', function () {
        it('should delete an existing acronym', async function () {
            const acronymValue = 'test';
            const instance = new InMemoryAcronymRepository([
                { value: acronymValue, definition: 'def' }
            ]);

            const deleteResult = await instance.delete(acronymValue);

            assert.isOk(deleteResult);
            assert.equal(instance.size(), 0);

            const retrieved = await instance.findByValue(acronymValue);
            assert.isNull(retrieved);
        });

        it('should return false if the acronym doesnt exist', async function () {
            const instance = new InMemoryAcronymRepository([
                { value: 'test', definition: 'def' },
                { value: 'test2', definition: 'def' },
                { value: 'test3', definition: 'def' }
            ]);

            const oldSize = instance.size();
            const deleteResult = await instance.delete('noexist');

            assert.isNotOk(deleteResult);
            assert.equal(oldSize, instance.size());
        });
    });

    describe('Update', function () {

        it('should update an existing entry in the database', async function () {
            const instance = new InMemoryAcronymRepository([
                { value: 'test', definition: 'def' }
            ]);

            await instance.update('test', { value: 'test', definition: 'def_v2'});

            assert.equal(instance.size(), 1);

            const retrieved = await instance.findByValue('test');
            assert.isNotNull(retrieved);
            // @ts-ignore
            assert.equal(retrieved.definition, 'def_v2');
        });

    });
});
