import GetAcronymsData from '../../../controllers/getAcronyms/GetAcronymsData';
import AcronymRepository from '../repositories/AcronymRepository';
import Acronym from '../types/Acronym';
import PostAcronymsData from '../../../controllers/postAcronyms/PostAcronymsData';
import ValidationError from '../../errors/ValidationError';
import PutAcronymsData from '../../../controllers/putAcronyms/PutAcronymsData';
import NotFoundError from '../../errors/NotFoundError';
import RetrieveResult from '../types/RetrieveResult';
import {AcronymSearcher} from './AcronymSearcher/AcronymSearcher';

class AcronymsService {

    private repository: AcronymRepository;
    private acronymSearcher: AcronymSearcher;

    constructor(repository: AcronymRepository, acronymSearcher: AcronymSearcher) {
        this.repository = repository;
        this.acronymSearcher = acronymSearcher;
    }

    async retrieveAcronyms(data: GetAcronymsData): Promise<RetrieveResult<Acronym>> {
        let entries: Acronym[] = this.repository.findAll();
        let hasMore = false;

        if (data.search !== '') {
            entries = await this.acronymSearcher.search(data.search, entries, {});
        }

        if (data.from) {
            entries = entries.slice(data.from);
        }

        if (data.limit && entries.length > data.limit) {
            entries = entries.slice(0, data.limit);
            hasMore = true;
        }

        return { entries, hasMore };
    }

    createAcronym(data: PostAcronymsData): void {
        const exists = this.repository.findByValue(data.value);

        if (exists) {
            throw new ValidationError('Resource already exists', 'resource_already_exists');
        }

        this.repository.create({
            value: data.value,
            definition: data.definition
        });
    }

    async updateAcronym(data: PutAcronymsData) {
        this.repository.update(data.value, {
            value: data.value,
            definition: data.definition
        });
    }

    deleteAcronym(value: string) {
        const deleted = this.repository.delete(value);

        if (!deleted) {
            throw new NotFoundError();
        }
    }
}

export default AcronymsService;
