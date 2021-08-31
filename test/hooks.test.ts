import ServiceProvider from '../src/modules/services/ServiceProvider';
import FilesystemAcronymRepository from '../src/modules/acronym/repositories/FilesystemAcronymRepository';

beforeEach(async function () {
   ServiceProvider.register('AcronymRepository', () => {
       return new FilesystemAcronymRepository([]);
   });
});
