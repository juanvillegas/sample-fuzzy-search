import Acronym from '../../types/Acronym';
import * as fuzzysort from 'fuzzysort';
import {AcronymSearchData, AcronymSearcher} from './AcronymSearcher';

/**
 * This implementation of the AcronymSearcher interface utilizes the `fuzzysort` library to
 * fuzzy search Acronyms.
 */
class FuzzysortAcronymSearcher implements AcronymSearcher {

    async search(search: string, acronyms: Acronym[], options: AcronymSearchData): Promise<Acronym[]> {
        const searchResults = await this.applyFuzzySearch(search, acronyms, options);

        return this.convertToAcronymsArray(searchResults);
    }

    private convertToAcronymsArray(searchResults: Fuzzysort.KeysResults<Acronym>) {
        // @ts-ignore
        return searchResults.map(result => {
            // @ts-ignore
            return result.obj;
        });
    }

    private async applyFuzzySearch(search: string, acronyms: Acronym[], options: AcronymSearchData) {
        return await fuzzysort.goAsync(search, acronyms, {
            keys: ['value', 'definition'],
            limit: options.limit,
        });
    }
}

export default FuzzysortAcronymSearcher;
