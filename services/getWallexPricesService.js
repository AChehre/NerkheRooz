const axios = require('axios');

async function getWallexPrices() {
    try {
        const prices = [];
        const result = await axios.get('https://api.wallex.ir/v1/markets');

        if (result.data.success) {
            let price = result.data.result.symbols.USDTTMN.stats.bidPrice;
            price = parseFloat(price);
            prices.push({type: "USDTTMN", price, timestamp: new Date()});
        }

        return { success: true, data: prices };
    } catch (err) {
        return { success: false, error: err.message };
    }

}


module.exports = { getWallexPrices };