import GetAcronymsData from '../../../controllers/getAcronyms/GetAcronymsData';
import AcronymRepository from '../repositories/AcronymRepository';
import Acronym from '../types/Acronym';
import PostAcronymsData from '../../../controllers/postAcronyms/PostAcronymsData';
import ValidationError from '../../errors/ValidationError';
import PutAcronymsData from '../../../controllers/putAcronyms/PutAcronymsData';
import NotFoundError from '../../errors/NotFoundError';
import RetrieveResult from '../types/RetrieveResult';

class AcronymsService {

    // @ts-ignore
    private repository: AcronymRepository;

    constructor(repository: AcronymRepository) {
        this.repository = repository;
    }

    async retrieveAcronyms(data: GetAcronymsData): Promise<RetrieveResult<Acronym>> {
        let entries: Acronym[] = [];
        let hasMore = false;

        if (data.search !== null) {
            entries = await this.repository.retrieveByFuzzySearch(data.search);

            if (data.from) {
                entries = entries.slice(data.from);
            }

            if (data.limit && entries.length > data.limit) {
                entries = entries.slice(0, data.limit);
                hasMore = true;
            }
        }

        return { entries, hasMore };
    }

    async createAcronym(data: PostAcronymsData): Promise<void> {
        const exists = await this.repository.retrieveByValue(data.value);

        if (exists) {
            throw new ValidationError('Resource already exists', 'resource_already_exists');
        }

        await this.repository.create({
            value: data.value,
            definition: data.definition
        });
    }

    async updateAcronym(data: PutAcronymsData) {
        await this.repository.update(data.value, {
            value: data.value,
            definition: data.definition
        });
    }

    async deleteAcronym(value: string) {
        const deleted = await this.repository.delete(value);

        if (!deleted) {
            throw new NotFoundError();
        }
    }
}

export default AcronymsService;
