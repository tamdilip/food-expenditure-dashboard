const { getRequestBody } = require('../utils/request');
const getSwiggyExpenditure = require('../utils/swiggy');
const getZomatoExpenditure = require('../utils/zomato');

const getOrders = async (req, res) => {
    try {
        let orders = [];
        let accounts = await getRequestBody(req);
        for (let account of accounts) {
            if (account.vendor === 'Swiggy') {
                const swiggyExpenditure = await getSwiggyExpenditure(account);
                orders.push(swiggyExpenditure);
            } else if (account.vendor === 'Zomato') {
                const zomatoExpenditure = await getZomatoExpenditure(account);
                orders.push(zomatoExpenditure);
            }
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(orders.flat()));
    } catch (error) {
        res.writeHead(500);
        res.end(error.message);
    }
};

module.exports = { getOrders };
