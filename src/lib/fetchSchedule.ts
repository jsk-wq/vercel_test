import type { ScheduleEvent } from '../types/schedule'
import { parseDate } from './scheduleUtils'

const SHEET_ID = '1VHEtEdSHVGsCS70DbVXfXUbPpNgoUlNgsB7hph2JzOM'
const DIRECT_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent('시트1')}`
const PROXY_URL = '/api/schedule.csv'

function parseCsvLine(line: string): string[] {
  const cells: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i]
    const next = line[i + 1]

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"'
        i += 1
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (char === ',' && !inQuotes) {
      cells.push(current.trim())
      current = ''
      continue
    }

    current += char
  }

  cells.push(current.trim())
  return cells
}

function parseCsv(text: string): Record<string, string>[] {
  const lines = text
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length < 2) return []

  const headers = parseCsvLine(lines[0]).map((header) => header.toLowerCase())
  const startIdx = headers.indexOf('start')
  const endIdx = headers.indexOf('end')
  const titleIdx = headers.indexOf('title')

  if (startIdx === -1 || endIdx === -1 || titleIdx === -1) {
    throw new Error('CSV에 start, end, title 컬럼이 필요합니다.')
  }

  return lines.slice(1).map((line) => {
    const cells = parseCsvLine(line)
    return {
      start: cells[startIdx] ?? '',
      end: cells[endIdx] ?? '',
      title: cells[titleIdx] ?? '',
    }
  })
}

function rowToEvent(row: Record<string, string>, index: number): ScheduleEvent | null {
  const title = row.title.trim()
  const start = parseDate(row.start)
  const end = parseDate(row.end)

  if (!title || !start || !end) {
    console.warn(`일정 ${index + 1}행 파싱 실패:`, row)
    return null
  }

  if (end.getTime() < start.getTime()) {
    console.warn(`일정 ${index + 1}행 날짜 오류 (end < start):`, row)
    return null
  }

  return { start, end, title }
}

async function fetchCsv(url: string): Promise<string> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }
  return response.text()
}

export async function fetchSchedule(): Promise<ScheduleEvent[]> {
  let csvText: string

  try {
    csvText = await fetchCsv(DIRECT_URL)
  } catch {
    csvText = await fetchCsv(PROXY_URL)
  }

  const rows = parseCsv(csvText)
  const events = rows
    .map((row, index) => rowToEvent(row, index))
    .filter((event): event is ScheduleEvent => event !== null)

  if (events.length === 0) {
    throw new Error('유효한 일정 데이터가 없습니다.')
  }

  return events.sort((a, b) => a.start.getTime() - b.start.getTime())
}
