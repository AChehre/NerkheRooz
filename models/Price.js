class Price {
  constructor(provider, type, price, timestamp = new Date()) {
    this.provider = provider; // when we fetched it
    this.type = type;       // e.g., "طلا ۱۸"
    this.price = price;     // e.g., "84,254,000"
    this.timestamp = timestamp;
  }
}

module.exports = Price;