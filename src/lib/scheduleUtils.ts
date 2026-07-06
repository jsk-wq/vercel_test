import type { ScheduleEvent, ScheduleEventWithStatus, ScheduleStatus } from '../types/schedule'

export function startOfDay(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

export function parseDate(value: string): Date | null {
  const trimmed = value.trim()
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed)
  if (!match) return null

  const year = Number(match[1])
  const month = Number(match[2]) - 1
  const day = Number(match[3])
  const date = new Date(year, month, day)

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return null
  }

  return startOfDay(date)
}

export function getStatus(start: Date, end: Date, today: Date): ScheduleStatus {
  const t = startOfDay(today).getTime()
  const s = startOfDay(start).getTime()
  const e = startOfDay(end).getTime()

  if (t < s) return 'upcoming'
  if (t > e) return 'past'
  return 'ongoing'
}

export function getDDay(start: Date, today: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000
  return Math.round((startOfDay(start).getTime() - startOfDay(today).getTime()) / msPerDay)
}

export function getDaysLeft(end: Date, today: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000
  return Math.round((startOfDay(end).getTime() - startOfDay(today).getTime()) / msPerDay)
}

export function getDurationDays(start: Date, end: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000
  return Math.round((startOfDay(end).getTime() - startOfDay(start).getTime()) / msPerDay) + 1
}

export function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}.${m}.${d}`
}

export function formatDateShort(date: Date): string {
  const m = date.getMonth() + 1
  const d = date.getDate()
  return `${m}/${d}`
}

export function withStatus(events: ScheduleEvent[], today: Date): ScheduleEventWithStatus[] {
  return events.map((event) => ({
    ...event,
    status: getStatus(event.start, event.end, today),
  }))
}

export function filterByStatus(
  events: ScheduleEventWithStatus[],
  filter: 'all' | ScheduleStatus,
): ScheduleEventWithStatus[] {
  if (filter === 'all') return events
  return events.filter((event) => event.status === filter)
}

export function getActiveToday(events: ScheduleEventWithStatus[], today: Date): ScheduleEventWithStatus[] {
  return events.filter((event) => getStatus(event.start, event.end, today) === 'ongoing')
}

export function countByStatus(events: ScheduleEventWithStatus[]): Record<ScheduleStatus, number> {
  return events.reduce(
    (acc, event) => {
      acc[event.status] += 1
      return acc
    },
    { ongoing: 0, upcoming: 0, past: 0 },
  )
}

export function getDateRange(events: ScheduleEvent[]): { min: Date; max: Date } {
  const min = startOfDay(new Date(Math.min(...events.map((e) => e.start.getTime()))))
  const max = startOfDay(new Date(Math.max(...events.map((e) => e.end.getTime()))))
  return { min, max }
}

export function getTimelinePosition(
  start: Date,
  end: Date,
  rangeMin: Date,
  rangeMax: Date,
): { left: number; width: number } {
  const totalMs = rangeMax.getTime() - rangeMin.getTime()
  if (totalMs <= 0) return { left: 0, width: 100 }

  const leftMs = Math.max(0, startOfDay(start).getTime() - rangeMin.getTime())
  const rightMs = Math.min(totalMs, startOfDay(end).getTime() - rangeMin.getTime())
  const widthMs = Math.max(0, rightMs - leftMs + 24 * 60 * 60 * 1000)

  return {
    left: (leftMs / totalMs) * 100,
    width: Math.max((widthMs / totalMs) * 100, 0.8),
  }
}

export function getTodayPosition(today: Date, rangeMin: Date, rangeMax: Date): number {
  const totalMs = rangeMax.getTime() - rangeMin.getTime()
  if (totalMs <= 0) return 0

  const todayMs = startOfDay(today).getTime()
  const clamped = Math.min(Math.max(todayMs, rangeMin.getTime()), rangeMax.getTime())
  return ((clamped - rangeMin.getTime()) / totalMs) * 100
}

export function getMonthLabels(rangeMin: Date, rangeMax: Date): { label: string; position: number }[] {
  const labels: { label: string; position: number }[] = []
  const totalMs = rangeMax.getTime() - rangeMin.getTime()
  if (totalMs <= 0) return labels

  const cursor = new Date(rangeMin.getFullYear(), rangeMin.getMonth(), 1)
  while (cursor.getTime() <= rangeMax.getTime()) {
    const position = ((cursor.getTime() - rangeMin.getTime()) / totalMs) * 100
    if (position >= 0 && position <= 100) {
      labels.push({
        label: `${cursor.getFullYear()}년 ${cursor.getMonth() + 1}월`,
        position,
      })
    }
    cursor.setMonth(cursor.getMonth() + 1)
  }

  return labels
}

export const STATUS_LABELS: Record<ScheduleStatus, string> = {
  ongoing: '진행 중',
  upcoming: '예정',
  past: '종료',
}
