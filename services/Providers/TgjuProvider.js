const cheerio = require("cheerio");

const { AssetType } = require("../assetTypes");

async function getTgjuPrices() {
  try {
    const items = ["طلا ۱۸", "بیت کوین", "تتر", "دلار", "سکه"];

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

      let price = 0;
      if (items.includes(title)) {
        price = $(el)
          .nextAll("span.info-value")
          .find("span.info-price")
          .text()
          .trim();
        let type = title;
        if (type === "تتر") type = AssetType.USDT;

        price = parseInt(price.replace(/,/g, ""), 10); // remove commas → 1116970
        price = price / 10;

        prices.push({ type, price, timestamp: new Date() });
      }
    });

    return { success: true, data: prices };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

const tgjuService = {
  title: "Tgju",
  service: getTgjuPrices,
  assets: [
    AssetType.USDT,
    AssetType.BITCOIN,
    AssetType.GOLD18,
    AssetType.DOLLAR,
  ],
};

module.exports = { tgjuService };
