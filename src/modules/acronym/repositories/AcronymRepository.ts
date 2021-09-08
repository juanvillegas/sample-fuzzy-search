import Acronym from '../types/Acronym';

/**
 * Defines an interface for accessing an Acronym storage
 */
export default interface AcronymRepository {

    findByValue(value: string): Acronym | null;

    findAll(): Acronym[];

    create(acronym: Acronym): void;

    update(value: string, acronym: Acronym): null;

    delete(value: string): boolean;

    size(): number;

    clear(): void;

}
