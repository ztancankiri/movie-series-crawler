const path = require('path');
const restify = require('restify');
const plugins = restify.plugins;
const routes = require(path.join(process.cwd(), 'routes'));

const server = restify.createServer();
server.use(plugins.queryParser());
server.use(plugins.bodyParser());

server.listen(5454, '0.0.0.0', console.log('Listening on 5454...'));
routes.attachRoutes(server);
