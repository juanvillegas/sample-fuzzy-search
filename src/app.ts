import express from 'express';
import errorHandler from './modules/errors/errorHandler';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import registerServices from './boot/registerServices';
import registerRoutes from './boot/registerRoutes';
import registerRequestLogger from './boot/registerRequestLogger';

const App = express();

App.use(helmet());
App.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    } else {
        return next();
    }
});
App.use(bodyParser.json());

registerServices();
registerRequestLogger(App);
registerRoutes(App);

App.use(errorHandler);

export default App;
