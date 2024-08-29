const requestTimes: {[key: string]: number[]} = {}

const server = Bun.serve({
  port: 3000,
  async fetch(request) {
    const uniqueKey = await request.text()
    const now = Date.now()
    if (!requestTimes[uniqueKey]) {
      requestTimes[uniqueKey] = []
    }
    requestTimes[uniqueKey] = requestTimes[uniqueKey].filter(
      timestamp => now - timestamp < 1000
    )

    if (requestTimes[uniqueKey].length < 2) {
      requestTimes[uniqueKey].push(now)
      return new Response('Request accepted')
    } else {
      return new Response('Rate limit exceeded', { status: 429 })
    }
  }
})


console.log(`Listening on localhost:${server.port}`)
