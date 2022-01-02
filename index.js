const http = require('http');
const fs = require('fs').promises;
const getSwiggyExpenditure = require('./api/swiggy');
const getZomatoExpenditure = require('./api/zomato');

const SERVER_PORT = 8000;

const requestListener = async (req, res) => {
    const { url } = req;
    console.log(`Incoming request: ${url}`);

    if (url === '/orders') {
        try {
            const swiggyExpenditure = await getSwiggyExpenditure();
            const zomatoExpenditure = await getZomatoExpenditure();

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify([...swiggyExpenditure, ...zomatoExpenditure]));
        } catch (error) {
            res.writeHead(500);
            res.end(error.message);
        }
    } else {
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
