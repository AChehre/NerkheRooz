const express = require("express");

const { services } = require("./services/services");
const { getPrices } = require("./services/getPrices");

const app = express();
const PORT = 3000;

app.get("/", async (req, res) => {
  try {
    const assets = req.query.assets ? req.query.assets.split(",") : []; // default empty array
    const prices = await getPrices(assets);
    res.json(prices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch all prices" });
  }
});

Object.entries(services).forEach(([key, service]) => {
  const fn = service.service;
  const title = service.title;
  app.get(`/${title}`, async (req, res) => {
    const result = await fn();
    if (result.success) {
      res.json({
        result: result.data,
        title: service.title,
        assets: service.assets,
      });
    } else {
      console.error(result.error);
      res.status(500).json({ error: "Failed to fetch prices" });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
