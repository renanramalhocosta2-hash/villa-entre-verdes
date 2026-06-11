const { getStore } = require('@netlify/blobs')

const SITE_ID = 'f42ac771-6268-41e0-a148-3a3e63e73cf7'
const BLOB_KEY = 'config'
const DEFAULT = {
  rules: [],
  baseWeekday: 2000,
  baseWeekend: 2800,
  updatedAt: new Date().toISOString(),
}

const CORS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-admin-password',
}

exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' }
  }

  const token = process.env.NETLIFY_TOKEN
  const store = getStore({ name: 'pricing', siteID: SITE_ID, token })

  if (event.httpMethod === 'GET') {
    try {
      const data = await store.get(BLOB_KEY, { type: 'json' })
      return { statusCode: 200, headers: CORS, body: JSON.stringify(data || DEFAULT) }
    } catch (e) {
      console.error('pricing GET error:', e.message)
      return { statusCode: 200, headers: CORS, body: JSON.stringify(DEFAULT) }
    }
  }

  if (event.httpMethod === 'POST') {
    const pass = event.headers['x-admin-password'] || ''
    const adminPass = process.env.ADMIN_PASSWORD || ''

    if (!adminPass || pass !== adminPass) {
      return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: 'Senha incorreta' }) }
    }

    try {
      const body = JSON.parse(event.body || '{}')
      if (body._ping) {
        return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: true }) }
      }
      await store.setJSON(BLOB_KEY, { ...body, updatedAt: new Date().toISOString() })
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: true }) }
    } catch (err) {
      console.error('pricing POST error:', err.message)
      return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: err.message }) }
    }
  }

  return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method not allowed' }) }
}
