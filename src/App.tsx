import { useMemo } from 'react'
import { Header } from './components/Header'
import { SummaryCards } from './components/SummaryCards'
import { TodaySection } from './components/TodaySection'
import { TimelineView } from './components/TimelineView'
import { ScheduleList } from './components/ScheduleList'
import { useSchedule } from './hooks/useSchedule'
import {
  countByStatus,
  getActiveToday,
  startOfDay,
  withStatus,
} from './lib/scheduleUtils'

function App() {
  const { events, loading, error, lastUpdated, refetch } = useSchedule()
  const today = useMemo(() => startOfDay(new Date()), [])

  const eventsWithStatus = useMemo(
    () => withStatus(events, today),
    [events, today],
  )

  const counts = useMemo(() => countByStatus(eventsWithStatus), [eventsWithStatus])
  const activeToday = useMemo(
    () => getActiveToday(eventsWithStatus, today),
    [eventsWithStatus, today],
  )

  return (
    <div className="app">
      <Header
        lastUpdated={lastUpdated}
        loading={loading}
        onRefresh={() => void refetch()}
      />

      <main className="main">
        {loading && events.length === 0 && (
          <div className="loading-state">학사 일정을 불러오는 중입니다…</div>
        )}

        {error && (
          <div className="error-state">
            <p>{error}</p>
            <button type="button" className="refresh-button" onClick={() => void refetch()}>
              다시 시도
            </button>
          </div>
        )}

        {!error && events.length > 0 && (
          <>
            <SummaryCards counts={counts} />
            <TodaySection events={activeToday} today={today} />
            <TimelineView events={eventsWithStatus} today={today} />
            <ScheduleList events={eventsWithStatus} today={today} />
          </>
        )}
      </main>
    </div>
  )
}

export default App
