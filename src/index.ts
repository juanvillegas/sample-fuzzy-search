import express from 'express';
import registerRoutes from './controllers/router';
import globalErrorHandler from './controllers/globalErrorHandler';
import helmet from 'helmet';

const App = express();

App.use(helmet());

registerRoutes(App);

App.use(globalErrorHandler);

if (require.main === module) {
    App.listen(7777, () => {
        console.log(`API listening at http://localhost:7777`)
    });
}

export default App;
