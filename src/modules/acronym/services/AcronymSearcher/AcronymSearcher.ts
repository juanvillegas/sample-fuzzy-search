import Acronym from '../../types/Acronym';

interface AcronymSearcher {

    search(search: string, acronyms: Acronym[], options: AcronymSearchData): Promise<Acronym[]>;

}

interface AcronymSearchData {

    limit?: number;

}

export {
    AcronymSearcher,
    AcronymSearchData,
}
