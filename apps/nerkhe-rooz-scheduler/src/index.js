import { createSupabase } from './db/supabaseClient.js';
import { createPriceRepository } from './db/priceRepository.js';
import { getPrices } from '../../get-prices/services/getPrices.js';

export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);

		if (url.pathname === '/run') {
			await runJob(env);
			return new Response('Job executed');
		}

		return new Response('Not found', { status: 404 });
	},

	// async scheduled(event, env, ctx) {
	// 	ctx.waitUntil(runJob(env));
	// },
};

async function runJob(env) {
	console.log('Cron started at:', new Date().toISOString());
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
}
