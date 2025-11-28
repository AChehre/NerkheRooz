const axios = require("axios");

const { AssetType } = require("../assetTypes");

const provider = Object.freeze({
  name: "Nobitex",
  title: "نوبیتکس",
});

const items = [
  { asset: AssetType.USDT, symbol: "USDTIRT" },
  { asset: AssetType.BTC, symbol: "BTCIRT" },
];

async function getNobitexPrices() {
  try {
    const prices = [];

    const res = await axios.get("https://apiv2.nobitex.ir/v3/orderbook/all");

    if (res.data.status !== "ok") {
      throw new Error("Nobitex returned invalid status");
    }

    const marketData = res.data;

    for (const item of items) {
      const entry = marketData[item.symbol];

      if (!entry) {
        throw new Error(`Symbol ${item.symbol} not found in Nobitex response`);
      }

      let price = parseInt(entry.lastTradePrice, 10);

      // Nobitex always returns price * 10 → convert back
      price = price / 10;

      prices.push({
        type: item.asset,
        price,
        timestamp: new Date(),
      });
    }

    return { success: true, data: prices };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

const nobitexService = {
  provider: provider,
  service: getNobitexPrices,
  assets: items.map((x) => x.asset),
};

module.exports = { nobitexService };
