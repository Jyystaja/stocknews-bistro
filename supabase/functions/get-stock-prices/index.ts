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
        const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=WFK7FLVUGCI8H4EI`
        const response = await fetch(url)
        const data = await response.json()

        console.log(`Raw data for ${symbol}:`, data)

        if (data['Time Series (Daily)']) {
          // Get the latest date (first key in the time series)
          const latestDate = Object.keys(data['Time Series (Daily)'])[0]
          const latestData = data['Time Series (Daily)'][latestDate]
          
          // Get previous date for calculating change
          const previousDate = Object.keys(data['Time Series (Daily)'])[1]
          const previousData = data['Time Series (Daily)'][previousDate]

          const currentPrice = parseFloat(latestData['4. close'])
          const previousPrice = parseFloat(previousData['4. close'])
          const priceChange = ((currentPrice - previousPrice) / previousPrice) * 100

          return {
            symbol,
            price: currentPrice.toFixed(2),
            change: priceChange.toFixed(2)
          }
        } else {
          console.error(`No data found for symbol ${symbol}`)
          return {
            symbol,
            price: '0.00',
            change: '0.00'
          }
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