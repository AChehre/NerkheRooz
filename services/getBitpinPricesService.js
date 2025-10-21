const axios = require('axios');

async function getBitpinPrices() {
    try {
        const prices = [];

        const result = await axios.get('https://api.bitpin.org/api/v1/mkt/tickers/');
            const found = result.data.find((element) => element.symbol === "USDT_IRT");
            const price = parseInt(found.price, 10);

            prices.push({type: "USDTTMN", price, timestamp: new Date()});
        

        return { success: true, data: prices };

    } catch (err) {
        return { success: false, error: err.message };
    }

}


module.exports = { getBitpinPrices };