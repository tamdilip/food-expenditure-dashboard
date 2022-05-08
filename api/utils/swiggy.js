const https = require('https');
const { decrypt } = require('../utils/crypt');

const getRequestOptions = (cookie, orderId = '') => ({
    method: 'GET',
    hostname: 'www.swiggy.com',
    path: `/dapi/order/all?order_id=${orderId}`,
    headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
        cookie: decrypt(cookie)
    }
});

const getBatchOrders = (cookie, orderId) => new Promise((response, reject) => {
    const options = getRequestOptions(cookie, orderId);
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
        vendor: 'Swiggy',
        id: o.order_id,
        month: months[new Date(o.order_time).getMonth()],
        year: new Date(o.order_time).getFullYear(),
        cost: o.net_total,
        restaurant: o.restaurant_name,
        identifier: account.identifier
    }));
};

const getTotalExpenditure = async (account) => {
    console.log({ account });
    let allOrders = [];
    let batchOrders = await getBatchOrders(account.cookie);
    while (batchOrders?.data?.orders?.length) {
        console.log({ allOrdersLength: allOrders.length, batchOrdersLength: batchOrders.data.orders.length });
        allOrders.push(...batchOrders.data.orders);
        const { order_id } = allOrders[allOrders.length - 1];
        batchOrders = await getBatchOrders(account.cookie, order_id);
    }

    const orderWithoutDuplicates = allOrders.filter((v, i, a) => a.findIndex(fv => (fv.order_id == v.order_id) && fv.order_status === 'Delivered') == i);
    return getUIdata(orderWithoutDuplicates, account);
};

module.exports = getTotalExpenditure;
