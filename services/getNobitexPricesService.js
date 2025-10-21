const axios = require('axios');

async function getNobitexPrices() {
    try {
        const prices = [];

        const result = await axios.get('https://apiv2.nobitex.ir/v3/orderbook/all');
        if (result.data.status === "ok") {
            let price = result.data.USDTIRT.lastTradePrice;
            price = parseInt(price, 10);
            price = price / 10;
            prices.push({ type: "USDTTMN", price, timestamp: new Date() });
        }

        return { success: true, data: prices };

    } catch (err) {
        return { success: false, error: err.message };
    }

}


module.exports = { getNobitexPrices };