const express = require('express');

const { services } = require('./services/services');
const { getPrices } = require('./services/getPrices');

const app = express();
const PORT = 3000;

app.get('/', async (req, res) => {
	try {
		const prices = await getPrices();
		res.json(prices);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Failed to fetch all prices' });
	}
});

Object.entries(services).forEach(([name, fn]) => {
	app.get(`/${name}`, async (req, res) => {
		const result = await fn();
		if (result.success) {
			res.json(result.data);
		} else {
			console.error(result.error);
			res.status(500).json({ error: 'Failed to fetch prices' });
		}
	});
});

app.listen(PORT, () => {
	console.log(`Server started at http://localhost:${PORT}`);
});
