const http = require('http');
const fs = require('fs').promises;
const { getOrders } = require('./api/routes/orders');
const { encryptAccount } = require('./api/routes/account');

const SERVER_PORT = 8000;

const requestListener = async (req, res) => {
    const { url } = req;
    console.log(`Incoming request: ${url}`);

    if (url === '/account')
        encryptAccount(req, res);
    else if (url === '/orders')
        getOrders(req, res);
    else {
        fs.readFile(__dirname + `/ui${url === '/' ? '/index.html' : url}`)
            .then(html => {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(html);
            })
            .catch(error => {
                res.writeHead(400);
                res.end('Invalid request !!');
            });
    }
};

const server = http.createServer(requestListener);
server.listen(SERVER_PORT, () => {
    console.log(`Server running on port ${SERVER_PORT} : http://localhost:${SERVER_PORT}/`);
});
