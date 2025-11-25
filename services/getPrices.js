const { services } = require("./services");

async function getPrices(assets = []) {
  const filteredServices = Object.entries(services).filter(([key, service]) => {
    // If no assets provided → include all services
    if (!assets || assets.length === 0) return true;

    // Otherwise include only services matching at least one asset
    return service.assets?.some((a) =>
      assets.map((x) => x.toLowerCase()).includes(a.toLowerCase())
    );
  });

  const results = await Promise.all(
    filteredServices.map(async ([key, service]) => {
      const fn = service.service;
      const result = await fn();

      return [
        service.title,
        {
          result,
          title: service.title,
          assets: service.assets,
        },
      ];
    })
  );

  return results;
}

module.exports = { getPrices };
