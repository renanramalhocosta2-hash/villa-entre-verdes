const ICAL_URL =
  'https://www.airbnb.com/calendar/ical/45199069.ics?s=53a260a065935d4529c6c952f9592644&loc'

exports.handler = async () => {
  try {
    const response = await fetch(ICAL_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; calendar-proxy/1.0)',
      },
    })

    if (!response.ok) {
      return { statusCode: 502, body: 'Failed to fetch calendar from Airbnb' }
    }

    const data = await response.text()

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600', // cache 1h
      },
      body: data,
    }
  } catch (error) {
    console.error('iCal proxy error:', error)
    return { statusCode: 500, body: 'Internal server error' }
  }
}
