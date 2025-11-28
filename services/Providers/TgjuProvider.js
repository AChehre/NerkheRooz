const cheerio = require("cheerio");

const { AssetType } = require("../assetTypes");

const provider = Object.freeze({
  name: "Tgju",
  title: "Tgju",
});

const items = [
  { title: "تتر", asset: AssetType.USDT },
  // { title: "بیت کوین", asset: AssetType.BTC },
  { title: "طلا ۱۸", asset: AssetType.GOLD18 },
  { title: "دلار", asset: AssetType.USD },
  { title: "سکه", asset: AssetType.COIN },
];

async function getTgjuPrices() {
  try {
    const url = "https://www.tgju.org/";
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; MyScraper/1.0)" },
    });

    if (!res.ok) throw new Error(`Failed: ${res.status}`);
    const html = await res.text();

    const $ = cheerio.load(html);
    const prices = [];

    $("h3").each((i, el) => {
      const title = $(el).text().trim();

      // find a matching item
      const item = items.find((x) => x.title === title);
      if (!item) return; // skip unrelated h3 items

      let priceText = $(el)
        .nextAll("span.info-value")
        .find("span.info-price")
        .text()
        .trim();

      if (!priceText) return;

      // Clean number format: remove commas (۱,۱۲۳ → 1123)
      let price = parseInt(priceText.replace(/,/g, ""), 10);

      // TGJU returns price * 10 → convert back
      price = price / 10;

      prices.push({
        type: item.asset,
        price,
        timestamp: new Date(),
      });
    });

    return { success: true, data: prices };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

const tgjuService = {
  provider: provider,
  service: getTgjuPrices,
  assets: items.map((x) => x.asset),
};

module.exports = { tgjuService };
