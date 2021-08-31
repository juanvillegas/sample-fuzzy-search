import Acronym from '../types/Acronym';

export default interface AcronymRepository {

    size(): number;

    create(acronym: Acronym): Promise<void>;

    retrieveByValue(value: string): Promise<Acronym | null>;

    retrieveByFuzzySearch(value: string): Promise<Acronym[]>;

    update(value: string, acronym: Acronym): Promise<null>;

    delete(value: string): Promise<boolean>;

    findOne(value: string): Promise<Acronym | null>;

}
