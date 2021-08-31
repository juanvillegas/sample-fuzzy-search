import * as http from 'http';
import app from '../app';

const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);

server.listen(app.get('port'));

console.log(`App listening at port: ${port}`);

export default server;
