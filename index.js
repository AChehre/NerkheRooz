const express = require("express");
const { getTgjuPrices } = require("./services/getTgjuPricesService");
const { getWallexPrices } = require("./services/getWallexPricesService");
const { getNobitexPrices } = require("./services/getNobitexPricesService");
const { getBitpinPrices } = require("./services/getBitpinPricesService");

const app = express();
const PORT = 3000;
const services = {
  tgju: getTgjuPrices,
  wallex: getWallexPrices,
  nobitex: getNobitexPrices,
  bitpin: getBitpinPrices,
};


app.get("/", async (req, res) => {
  try {
    const results = await Promise.all(
      Object.entries(services).map(async ([key, fn]) => {
        const result = await fn();
        return [key, result];
      })
    );

    const combined = {};
    for (const [key, result] of results) {
      combined[key] = result.success ? result.data : { error: result.error };
    }

    res.json(combined);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch all prices" });
  }
});


Object.entries(services).forEach(([name, fn]) => {
  app.get(`/${name}`, async (req, res) => {
    const result = await fn();
    if (result.success) {
      res.json(result.data);
    } else {
      console.error(result.error);
      res.status(500).json({ error: "Failed to fetch prices" });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});