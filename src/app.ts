import express from 'express';
import errorHandler from './controllers/errorHandler';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import registerServices from './boot/registerServices';
import registerRoutes from './boot/registerRoutes';
import registerRequestLogger from './boot/registerRequestLogger';

const App = express();

App.use(bodyParser.json());
App.use(helmet());

registerServices();
registerRequestLogger(App);
registerRoutes(App);

App.use(errorHandler);

export default App;
