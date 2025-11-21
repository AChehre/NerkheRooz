const { services } = require('./services');

async function getPrices() {
	const results = await Promise.all(
		Object.entries(services).map(async ([key, fn]) => {
			const result = await fn();
			return [key, result];
		})
	);

	return results;
	// const combined = {};
	// for (const [key, result] of results) {
	// 	combined[key] = result.success ? result.data : { error: result.error };
	// }
	
	// return combined;
}

module.exports = { getPrices };
