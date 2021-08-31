import Acronym from '../types/Acronym';
import AcronymRepository from './AcronymRepository';
import * as fs from 'fs';
import NotFoundError from '../../errors/NotFoundError';
// import NotFoundError from '../../errors/NotFoundError';

class FilesystemAcronymRepository implements AcronymRepository {

    private database: Array<Acronym>;

    constructor(acronyms: Array<Acronym>) {
        this.database = acronyms;
    }

    size(): number {
        return this.database.length;
    }

    static createFromFile(sourcePath: string) {
        // @ts-ignore
        const jsonDatabase = JSON.parse(fs.readFileSync(sourcePath));
        const acronyms = jsonDatabase.map((entry: object) => {
            for (let prop in entry) {
                if (entry.hasOwnProperty(prop)) {
                    return {
                        value: prop,
                        // @ts-ignore
                        definition: entry[prop]
                    };
                }
            }
        });

        return new FilesystemAcronymRepository(acronyms);
    }

    async create(acronym: Acronym): Promise<void> {
        this.database.push(acronym);
    }

    async delete(value: string): Promise<boolean> {
        const beforeSize = this.size();
        this.database = this.database.filter(e => e.value !== value);

        if (beforeSize !== this.size()) {
            return true;
        }

        return false;
    }

    findOne(value: string): Promise<Acronym | null> {
        return Promise.resolve(null);
    }

    async retrieveByValue(value: string): Promise<Acronym | null> {
        const entry = this.database.find(e => e.value === value);

        if (!entry) {
            return null;
        }

        return entry;
    }

    async retrieveByFuzzySearch(value: string): Promise<Acronym[]> {
        const entries = this.database.filter(e => {
            return e.value.includes(value) || e.definition.includes(value);
        });

        return entries;
    }

    async update(value: string, acronym: Acronym): Promise<null> {
        const entry = await this.retrieveByValue(value);

        if (entry === null) {
            throw new NotFoundError();
        }

        entry.definition = acronym.definition;

        return null;
    }

}

export default FilesystemAcronymRepository;
