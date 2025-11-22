const { services } = require('./services');

async function getPrices() {
	const results = await Promise.all(
		Object.entries(services).map(async ([key, fn]) => {
			const result = await fn();
			return [key, result];
		})
	);

	return results;
}

module.exports = { getPrices };
