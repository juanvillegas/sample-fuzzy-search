import path from 'path';
import ServiceProvider from '../modules/services/ServiceProvider';
import FilesystemAcronymRepository from '../modules/acronym/repositories/FilesystemAcronymRepository';

function registerServices() {
    ServiceProvider.register('RootPath', () => {
        return path.resolve(__dirname, '../../');
    });

    ServiceProvider.register('AcronymRepository', () => {
        const rootPath = ServiceProvider.instance('RootPath');

        return FilesystemAcronymRepository.createFromFile(`${rootPath}/data/acronym.json`);
    });

}

export default registerServices;
