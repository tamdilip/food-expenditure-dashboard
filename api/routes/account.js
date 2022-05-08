const { encrypt } = require('../utils/crypt');
const { getRequestBody } = require('../utils/request');

const encryptAccount = async (req, res) => {
    try {
        let reqBody = await getRequestBody(req);
        reqBody.cookie = encrypt(reqBody.cookie);
        reqBody.saved = true;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(reqBody));
    } catch (error) {
        res.writeHead(500);
        res.end(error.message);
    }
};

module.exports = { encryptAccount };
