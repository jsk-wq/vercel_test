const SHEET_ID = '1VHEtEdSHVGsCS70DbVXfXUbPpNgoUlNgsB7hph2JzOM'
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0`

export default async function handler(_request, response) {
  response.setHeader('Access-Control-Allow-Origin', '*')
  response.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate')

  try {
    const sheetResponse = await fetch(SHEET_URL, { cache: 'no-store' })

    if (!sheetResponse.ok) {
      return response.status(sheetResponse.status).json({ error: 'Failed to fetch Google Sheet' })
    }

    const csvText = await sheetResponse.text()
    response.setHeader('Content-Type', 'text/csv; charset=utf-8')
    return response.status(200).send(csvText)
  } catch {
    return response.status(500).json({ error: 'Failed to fetch Google Sheet' })
  }
}
