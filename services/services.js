const { arzdigitalService } = require("./Providers/ArzdigitalProvider");
const { bitpinService } = require("./Providers/BitpinProvider");
const { nobitexService } = require("./Providers/NobitexProvider");
const { tgjuService } = require("./Providers/TgjuProvider");
const { wallexService } = require("./Providers/WallexProvider");

const services = {
  arzdigitalService: arzdigitalService,
  bitpinService: bitpinService,
  nobitexService: nobitexService,
  tgjuService: tgjuService,
  wallexService: wallexService,
};

module.exports = { services };
