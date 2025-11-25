const axios = require("axios");

const { AssetType } = require("../assetTypes");

async function getNobitexPrices() {
  try {
    const prices = [];

    const result = await axios.get("https://apiv2.nobitex.ir/v3/orderbook/all");
    if (result.data.status === "ok") {
      let price = result.data.USDTIRT.lastTradePrice;
      price = parseInt(price, 10);
      price = price / 10;
      prices.push({ type: AssetType.USDT, price, timestamp: new Date() });
    }

    return { success: true, data: prices };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

const nobitexService = {
  title: "Nobitex",
  service: getNobitexPrices,
  assets: [AssetType.USDT, AssetType.BITCOIN],
};

module.exports = { nobitexService };
