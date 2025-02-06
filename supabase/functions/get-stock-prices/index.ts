import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { symbols } = await req.json()
    console.log('Fetching prices for symbols:', symbols)

    const results = await Promise.all(
      symbols.map(async (symbol: string) => {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=5d`
        const response = await fetch(url)
        const data = await response.json()

        console.log(`Raw data for ${symbol}:`, data)

        if (data.chart?.result?.[0]) {
          const quote = data.chart.result[0].meta
          const timestamps = data.chart.result[0].timestamp
          const prices = data.chart.result[0].indicators.quote[0].close

          // Get the last two valid prices
          let currentPrice = null
          let previousPrice = null
          
          for (let i = prices.length - 1; i >= 0; i--) {
            if (currentPrice === null && prices[i] !== null) {
              currentPrice = prices[i]
            } else if (previousPrice === null && prices[i] !== null) {
              previousPrice = prices[i]
              break
            }
          }

          if (currentPrice && previousPrice) {
            const priceChange = ((currentPrice - previousPrice) / previousPrice) * 100

            return {
              symbol,
              price: currentPrice.toFixed(2),
              change: priceChange.toFixed(2)
            }
          }
        }

        console.error(`No valid data found for symbol ${symbol}`)
        return {
          symbol,
          price: '0.00',
          change: '0.00'
        }
      })
    )

    return new Response(
      JSON.stringify(results),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})