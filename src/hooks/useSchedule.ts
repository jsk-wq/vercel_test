import { useCallback, useEffect, useState } from 'react'
import { fetchSchedule } from '../lib/fetchSchedule'
import type { ScheduleEvent } from '../types/schedule'

interface UseScheduleResult {
  events: ScheduleEvent[]
  loading: boolean
  error: string | null
  lastUpdated: Date | null
  refetch: () => Promise<void>
}

export function useSchedule(): UseScheduleResult {
  const [events, setEvents] = useState<ScheduleEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await fetchSchedule()
      setEvents(data)
      setLastUpdated(new Date())
    } catch (err) {
      const message = err instanceof Error ? err.message : '알 수 없는 오류'
      setError(`시트를 불러올 수 없습니다. (${message})`)
      setEvents([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refetch()
  }, [refetch])

  return { events, loading, error, lastUpdated, refetch }
}
