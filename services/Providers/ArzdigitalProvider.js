const cheerio = require("cheerio");

const { AssetType } = require("../assetTypes");

const provider = Object.freeze({
  name: "Arzdigital",
  title: "ارزدیجیتال",
});

const items = [
  { asset: AssetType.USDT, dataSlug: "tether" },
  { asset: AssetType.BTC, dataSlug: "bitcoin" },
];

async function getArzdigitalPrices() {
  try {
    const url = "https://arzdigital.com/";
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; MyScraper/1.0)" },
    });

    if (!res.ok) throw new Error(`Failed: ${res.status}`);

    const html = await res.text();
    const $ = cheerio.load(html);

    const data = items.map((item) => {
      const row = $(`tr[data-slug="${item.dataSlug}"]`);
      const price = getPrice(row, item.asset);

      return {
        type: item.asset,
        price,
        timestamp: new Date(),
      };
    });

    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

function getPrice(row, asset) {
  if (row.length === 0) {
    throw new Error(`Row for ${asset} not found`);
  }

  let priceText = row.find("div.pricetoman").text().trim();
  if (!priceText) throw new Error(`Price for ${asset} not found`);

  priceText = priceText.replace("ت", "").trim();

  const persianToEnglish = (str) =>
    str.replace(/[۰-۹]/g, (d) => "0123456789"[d.charCodeAt(0) - 1776]);

  const cleaned = persianToEnglish(priceText).replace(/\D/g, "");

  const price = parseInt(cleaned, 10);
  if (isNaN(price)) throw new Error(`Invalid price for ${asset}`);

  return price;
}

const arzdigitalService = {
  provider: provider,
  service: getArzdigitalPrices,
  assets: items.map((i) => i.asset),
};

module.exports = { arzdigitalService };
