const https = require('https');
const { decrypt } = require('../utils/crypt');

const getRequestOptions = (cookie, page = '') => ({
    method: 'GET',
    hostname: 'www.zomato.com',
    path: `/webroutes/user/orders?page=${page}`,
    headers: {
        accept: '*/*',
        cookie: decrypt(cookie)
    }
});

const getBatchOrders = (cookie, page) => new Promise((response, reject) => {
    const options = getRequestOptions(cookie, page);
    console.log(options.path);
    let req = https.request(options, (res) => {
        let chunks = [];

        res.on('data', (chunk) => {
            chunks.push(chunk);
        });

        res.on('end', (chunk) => {
            let body = Buffer.concat(chunks);
            response(JSON.parse(body.toString()));
        });

        res.on('error', reject);
    });

    req.end();
});


const getUIdata = (orders, account) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return orders.map(o => ({
        vendor: 'Zomato',
        id: o.orderId,
        month: months[new Date(o.orderDate.split(' at')[0]).getMonth()],
        year: new Date(o.orderDate.split(' at')[0]).getFullYear(),
        cost: parseInt(o.totalCost.replace('\u20b9', '')),
        restaurant: o.resInfo.name,
        identifier: account.identifier
    }));
};

const getTotalExpenditure = async (account) => {
    let allOrders = [];
    let batchOrders = await getBatchOrders(account.cookie, 1);
    while (batchOrders?.sections?.SECTION_USER_ORDER_HISTORY?.currentPage <= batchOrders?.sections?.SECTION_USER_ORDER_HISTORY?.totalPages) {
        console.log({ allOrdersLength: allOrders.length, batchOrdersLength: Object.values(batchOrders.entities.ORDER).length });
        allOrders.push(...Object.values(batchOrders.entities.ORDER));
        batchOrders = await getBatchOrders(account.cookie, batchOrders.sections.SECTION_USER_ORDER_HISTORY.currentPage + 1);
    }

    return getUIdata(allOrders, account);
};

module.exports = getTotalExpenditure;
