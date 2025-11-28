const axios = require("axios");

const { AssetType } = require("../assetTypes");

const provider = Object.freeze({
  name: "Bitpin",
  title: "بیت‌پین",
});

const items = [
  { asset: AssetType.USDT, symbol: "USDT_IRT" },
  { asset: AssetType.BTC, symbol: "BTC_IRT" },
];

async function getBitpinPrices() {
  try {
    const result = await axios.get(
      "https://api.bitpin.org/api/v1/mkt/tickers/"
    );

    const tickers = result.data;

    const prices = items.map((item) => {
      const found = tickers.find((t) => t.symbol === item.symbol);

      if (!found) {
        throw new Error(`Symbol ${item.symbol} not found in Bitpin response`);
      }

      const price = parseInt(found.price, 10);

      return {
        type: item.asset,
        price,
        timestamp: new Date(),
      };
    });

    return { success: true, data: prices };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

const bitpinService = {
  provider: provider,
  service: getBitpinPrices,
  assets: items.map((x) => x.asset),
};

module.exports = { bitpinService };