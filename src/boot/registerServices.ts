import path from 'path';
import ServiceProvider from '../modules/services/ServiceProvider';
import InMemoryAcronymRepository from '../modules/acronym/repositories/InMemoryAcronymRepository';
import AcronymsService from '../modules/acronym/services/AcronymsService';
import FuzzysortAcronymSearcher from '../modules/acronym/services/AcronymSearcher/FuzzysortAcronymSearcher';

function registerServices() {
    ServiceProvider.register('RootPath', () => {
        return path.resolve(__dirname, '../../');
    });

    ServiceProvider.register('AcronymRepository', () => {
        const rootPath = ServiceProvider.instance('RootPath');

        if (process.env.NODE_ENV === 'test') {
            return new InMemoryAcronymRepository([]);
        }

        return InMemoryAcronymRepository.createFromFile(`${rootPath}/data/acronym.json`);
    });

    ServiceProvider.register('AcronymSearcher', () => {
        return new FuzzysortAcronymSearcher();
    });

    ServiceProvider.register('AcronymService', () => {
        const repository = ServiceProvider.singleton('AcronymRepository');
        const searcher = ServiceProvider.singleton('AcronymSearcher');

        return new AcronymsService(repository, searcher);
    });

}

export default registerServices;
