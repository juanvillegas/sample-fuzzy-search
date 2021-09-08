import Acronym from '../types/Acronym';
import AcronymRepository from './AcronymRepository';
import * as fs from 'fs';
import NotFoundError from '../../errors/NotFoundError';

class InMemoryAcronymRepository implements AcronymRepository {

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

        return new InMemoryAcronymRepository(acronyms);
    }

    async create(acronym: Acronym): Promise<void> {
        this.database.push(acronym);
    }

    delete(value: string): boolean {
        const beforeSize = this.size();
        this.database = this.database.filter(e => e.value !== value);

        if (beforeSize !== this.size()) {
            return true;
        }

        return false;
    }

    findAll(): Acronym[] {
        return this.database;
    }

    findByValue(value: string): Acronym | null {
        const entry = this.database.find(e => e.value === value);

        if (!entry) {
            return null;
        }

        return entry;
    }

    update(value: string, acronym: Acronym): null {
        const entry = this.findByValue(value);

        if (entry === null) {
            throw new NotFoundError();
        }

        entry.definition = acronym.definition;

        return null;
    }

    clear(): void {
        this.database = [];
    }

}

export default InMemoryAcronymRepository;
