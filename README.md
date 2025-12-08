# GetPrices — Price Fetching Module for NerkheRooz Telegram Bot

<img src="./images/telegram.png" width="25" height="25" style="vertical-align:middle;"> **Telegram Bot:** [@NerkheRooz_bot](https://t.me/NerkheRooz_bot)

This repository contains the price fetching and aggregation logic used by the NerkheRooz Telegram bot. The service queries multiple exchange providers, normalizes their responses, and exposes the results via a small HTTP API. It is intended for lightweight consumption (e.g., the Telegram bot or other automation) and supports requesting raw per-provider prices as well as averaged prices across providers.

**API Base URL:**

The API is available at:

`https://nerkhe-rooz-api.achehre-de6.workers.dev/api/v1/prices`

**Routes**

- **GET** `/api/v1/prices`  
	- Description: Fetches raw price data returned by each configured provider. If no assets are specified, the service fetches all supported assets from each provider.  
	- Query parameters:  
		- `assets` — (optional) comma-separated list of asset symbols to request (example: `assets=BTC,USDT`). Symbols are matched case-insensitively against provider asset symbols.  
	- Examples:  
		- `https://nerkhe-rooz-api.achehre-de6.workers.dev/api/v1/prices`  (all assets/providers)  
		- `https://nerkhe-rooz-api.achehre-de6.workers.dev/api/v1/prices?assets=BTC,USDT`  
	- Response: JSON array. Each entry is a two-element array: `[providerName, metadata]`. `metadata` contains:  
		- `result`: the provider call result (usually `{ success: true, data: [...] }` or `{ success: false, error: '...' }`).  
		- `provider`: provider metadata (name, title, etc.).  
		- `assets`: list of asset types the provider serves.  
	- Sample (trimmed):  
		```json
		[
			[
				"Wallex",
				{
					"result": { "success": true, "data": [ { "type": { "symbol": "USDT" }, "price": 43000, "timestamp": "2025-12-08T..." } ] },
					"provider": { "name": "Wallex", "title": "والکس" },
					"assets": [ { "symbol": "USDT", "title": "Tether" } ]
				}
			],
			[ "Bitpin", { "result": { "success": true, "data": [...] }, "provider": { ... }, "assets": [...] } ]
		]
		```

- **GET** `/api/v1/prices/average`  
	- Description: Computes and returns average price per asset across all successful provider responses.  
	- Query parameters: same `assets` parameter as above (optional).  
	- Example: `https://nerkhe-rooz-api.achehre-de6.workers.dev/api/v1/prices/average?assets=BTC`  
	- Response: JSON object mapping asset symbol → numeric average price.  
	- Sample:  
		```json
		{
			"BTC": 1200000000,
			"USDT": 43000
		}
		```

Notes:

- Both route variants work with or without a trailing slash (e.g., `/api/v1/prices` and `/api/v1/prices/`).
- The router expects the `assets` query parameter as a comma-separated string and will return an empty list if no `assets` parameter is provided.
