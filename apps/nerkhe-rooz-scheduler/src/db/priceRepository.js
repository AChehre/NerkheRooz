export function createPriceRepository(supabase) {

  async function upsertProviders(providers) {
    const rows = providers.map(p => ({ name: p }))

    const { error } = await supabase
      .from('providers')
      .upsert(rows, { onConflict: 'name' })

    if (error) throw error
  }

  async function upsertAssets(symbols) {
    const rows = symbols.map(s => ({ symbol: s }))

    const { error } = await supabase
      .from('assets')
      .upsert(rows, { onConflict: 'symbol' })

    if (error) throw error
  }

  async function insertPrices(prices) {
    const providerNames = [...new Set(prices.map(p => p[0]))]

    const { data: providers } = await supabase
      .from('providers')
      .select('id,name')
      .in('name', providerNames)

    const providerMap = {}
    providers.forEach(p => providerMap[p.name] = p.id)

    const symbols = new Set()
    prices.forEach(([_, data]) => {
      data.result.data.forEach(item => {
        symbols.add(item.type.symbol)
      })
    })

    const { data: assets } = await supabase
      .from('assets')
      .select('id,symbol')
      .in('symbol', [...symbols])

    const assetMap = {}
    assets.forEach(a => assetMap[a.symbol] = a.id)

    const rows = []

    prices.forEach(([providerName, data]) => {
      const providerId = providerMap[providerName]

      data.result.data.forEach(item => {
        const assetId = assetMap[item.type.symbol]

        rows.push({
          provider_id: providerId,
          asset_id: assetId,
          price: item.price,
          recorded_at: item.timestamp
        })
      })
    })

    const { error } = await supabase
      .from('prices')
      .insert(rows)

    if (error) throw error
  }

  return {
    upsertProviders,
    upsertAssets,
    insertPrices
  }
}
