import { createSupabase } from './db/supabaseClient.js';
import { createPriceRepository } from './db/priceRepository.js';

const { getPrices, getAveragePrices } = require('../../get-prices/services/getPrices');

const { routes } = require('../../shared/router/routes');
const { parseAssets } = require('../../shared/router/utils');

const handlers = {
	getPrices,
	getAveragePrices,
};

export default {
	async fetch(request, env, ctx) {
		// const assets1 = routes.needsAssets ? parseAssets(url.searchParams.get('assets')) : [];

		const supabase = createSupabase(env);
		const repo = createPriceRepository(supabase);

		const prices = await getPrices();

		const providers = [...new Set(prices.map((p) => p[0]))];

		const assets = new Set();
		prices.forEach(([providerName, data]) => {
			data.result.data.forEach((item) => {
				assets.add(item.type.symbol);
			});
		});

		await repo.upsertProviders(providers);
		await repo.upsertAssets([...assets]);
		await repo.insertPrices(prices);

		return new Response(JSON.stringify({ ok: true }));
	},
};
