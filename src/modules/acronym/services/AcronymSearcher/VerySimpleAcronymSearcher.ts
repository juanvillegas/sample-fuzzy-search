import Acronym from '../../types/Acronym';
import {AcronymSearchData, AcronymSearcher} from './AcronymSearcher';

/**
 * This is just an example of a very simple fuzzy search implementation that uses
 * the built-in `includes` function of the String type in Javascript to determine if an Acronym fuzzy matches
 * the `search` string.
 */
class VerySimpleAcronymSearcher implements AcronymSearcher {

    async search(search: string, acronyms: Acronym[], options: AcronymSearchData): Promise<Acronym[]> {
        return acronyms.filter(acronym => {
            return this.applyFuzzySearch(acronym, search);
        });
    }

    private applyFuzzySearch(acronym: Acronym, search: string) {
        return acronym.value.toLowerCase().includes(search) || acronym.definition.toLowerCase().includes(search);
    }
}

export default VerySimpleAcronymSearcher;
