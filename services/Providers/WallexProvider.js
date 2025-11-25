const axios = require("axios");

const { AssetType } = require("../assetTypes");

async function getWallexPrices() {
  try {
    const prices = [];
    const result = await axios.get("https://api.wallex.ir/v1/markets");

    if (result.data.success) {
      let price = result.data.result.symbols.USDTTMN.stats.bidPrice;
      price = parseFloat(price);
      prices.push({ type: AssetType.USDT, price, timestamp: new Date() });
    }

    return { success: true, data: prices };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

const wallexService = {
  title: "Wallex",
  service: getWallexPrices,
  assets: [AssetType.USDT, AssetType.BITCOIN],
};

module.exports = { wallexService };
