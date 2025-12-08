const { getPrices, getAveragePrices } = require("../../get-prices/services/getPrices");

const { routes } = require("../../shared/router/routes");
const { parseAssets } = require("../../shared/router/utils");

const handlers = {
  getPrices,
  getAveragePrices,
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const route = routes[url.pathname];

    if (!route) {
      return new Response("Not Found", { status: 404 });
    }

    const handler = handlers[route.handlerName];

    const assets = route.needsAssets
      ? parseAssets(url.searchParams.get("assets"))
      : [];

    const data = await handler(assets);

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" }
    });
  }
};