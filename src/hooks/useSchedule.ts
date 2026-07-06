import { useCallback, useEffect, useState } from 'react'
import { fetchSchedule } from '../lib/fetchSchedule'
import type { ScheduleEvent } from '../types/schedule'

const AUTO_REFRESH_MS = 5 * 60 * 1000

interface UseScheduleResult {
  events: ScheduleEvent[]
  loading: boolean
  error: string | null
  lastUpdated: Date | null
  refetch: () => Promise<void>
}

interface RefetchOptions {
  silent?: boolean
}

export function useSchedule(): UseScheduleResult {
  const [events, setEvents] = useState<ScheduleEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const refetch = useCallback(async (options?: RefetchOptions) => {
    if (!options?.silent) {
      setLoading(true)
      setError(null)
    }

    try {
      const data = await fetchSchedule()
      setEvents(data)
      setLastUpdated(new Date())
      setError(null)
    } catch (err) {
      if (!options?.silent) {
        const message = err instanceof Error ? err.message : '알 수 없는 오류'
        setError(`시트를 불러올 수 없습니다. (${message})`)
        setEvents([])
      }
    } finally {
      if (!options?.silent) {
        setLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    void refetch()

    const intervalId = window.setInterval(() => {
      void refetch({ silent: true })
    }, AUTO_REFRESH_MS)

    return () => window.clearInterval(intervalId)
  }, [refetch])

  return {
    events,
    loading,
    error,
    lastUpdated,
    refetch: () => refetch(),
  }
}
