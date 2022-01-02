const fs = require('fs');
const https = require('https');

const cookie = fs.readFileSync('./api/cookies/zomato.txt', { encoding: 'utf8', flag: 'r' });

const getRequestOptions = (page = '') => ({
    method: 'GET',
    hostname: 'www.zomato.com',
    path: `/webroutes/user/orders?page=${page}`,
    headers: {
        accept: '*/*',
        cookie
    }
});


const getBatchOrders = (page) => new Promise((response, reject) => {
    const options = getRequestOptions(page);
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


const getUIdata = (orders) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return orders.map(o => ({
        vendor: 'Zomato',
        id: o.orderId,
        month: months[new Date(o.orderDate.split(' at')[0]).getMonth()],
        year: new Date(o.orderDate.split(' at')[0]).getFullYear(),
        cost: parseInt(o.totalCost.replace('\u20b9', '')),
        restaurant: o.resInfo.name
    }));
};

const getTotalExpenditure = async () => {
    let allOrders = [];
    let batchOrders = await getBatchOrders(1);
    while (batchOrders?.sections?.SECTION_USER_ORDER_HISTORY?.currentPage <= batchOrders?.sections?.SECTION_USER_ORDER_HISTORY?.totalPages) {
        console.log({ allOrdersLength: allOrders.length, batchOrdersLength: Object.values(batchOrders.entities.ORDER).length });
        allOrders.push(...Object.values(batchOrders.entities.ORDER));
        batchOrders = await getBatchOrders(batchOrders.sections.SECTION_USER_ORDER_HISTORY.currentPage + 1);
    }

    return getUIdata(allOrders);
};

module.exports = getTotalExpenditure;
