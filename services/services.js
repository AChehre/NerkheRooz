const { getTgjuPrices } = require('./getTgjuPricesService');
const { getWallexPrices } = require('./getWallexPricesService');
const { getNobitexPrices } = require('./getNobitexPricesService');
const { getBitpinPrices } = require('./getBitpinPricesService');
const { getArzdigitalPrices } = require('./getArzdigitalService');

const services = {
	tgju: getTgjuPrices,
	wallex: getWallexPrices,
	nobitex: getNobitexPrices,
	bitpin: getBitpinPrices,
	arzdigital: getArzdigitalPrices,
};

module.exports = { services };
