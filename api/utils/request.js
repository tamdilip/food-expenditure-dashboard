const getRequestBody = (req) =>
    new Promise((pres, prej) => {
        try {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                pres(JSON.parse(body));
            });
        } catch (error) {
            prej(error);
        }
    });

module.exports = { getRequestBody };
