const cheerio = require("cheerio");

async function getArzdigitalPrices() {
  try {
    const url = "https://arzdigital.com/";
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; MyScraper/1.0)" }
    });

    if (!res.ok) throw new Error(`Failed: ${res.status}`);
    const html = await res.text();

    const $ = cheerio.load(html);

    let priceText = null;


    const row = $('tr[data-slug="tether"]');

    if (row.length === 0) {
      throw new Error("USDT row not found");
    }

  
    priceText = row.find("div.pricetoman").text().trim();  // Example: "۱۱۳,۷۳۱ ت"

    if (!priceText) {
      throw new Error("USDT price not found");
    }

    // Remove the last "ت"
    priceText = priceText.replace("ت", "").trim();

    // Convert Persian digits → English digits
    const persianToEnglish = (str) =>
      str.replace(/[۰-۹]/g, (d) => "0123456789"[d.charCodeAt(0) - 1776]);

    const englishNumber = persianToEnglish(priceText).replace(/,/g, "");

    const price = parseInt(englishNumber, 10);

    return {
      success: true,
      data: [
        {
          type: "USDTTMN",
          price,
          timestamp: new Date()
        }
      ]
    };

  } catch (err) {
    return { success: false, error: err.message };
  }
}

module.exports = { getArzdigitalPrices };
