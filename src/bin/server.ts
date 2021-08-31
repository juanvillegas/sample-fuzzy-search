import * as http from 'http';
import app from '../app';

const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);

export default server;
