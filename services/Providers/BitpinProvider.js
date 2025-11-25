const axios = require("axios");

const { AssetType } = require("../assetTypes");

async function getBitpinPrices() {
  try {
    const prices = [];

    const result = await axios.get(
      "https://api.bitpin.org/api/v1/mkt/tickers/"
    );
    const found = result.data.find((element) => element.symbol === "USDT_IRT");
    const price = parseInt(found.price, 10);

    prices.push({ type: AssetType.USDT, price, timestamp: new Date() });

    return { success: true, data: prices };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

const bitpinService = {
  title: "Bitpin",
  service: getBitpinPrices,
  assets: [AssetType.USDT, AssetType.BITCOIN],
};

module.exports = { bitpinService };
