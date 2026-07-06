import type { ScheduleEventWithStatus } from '../types/schedule'
import {
  formatDateShort,
  getDateRange,
  getMonthLabels,
  getTimelinePosition,
  getTodayPosition,
} from '../lib/scheduleUtils'

interface TimelineViewProps {
  events: ScheduleEventWithStatus[]
  today: Date
}

export function TimelineView({ events, today }: TimelineViewProps) {
  if (events.length === 0) return null

  const { min, max } = getDateRange(events)
  const monthLabels = getMonthLabels(min, max)
  const todayPosition = getTodayPosition(today, min, max)
  const todayInRange = todayPosition >= 0 && todayPosition <= 100

  return (
    <section className="timeline-section">
      <div className="section-heading">
        <h2>일정 타임라인</h2>
        <p>겹치는 기간을 한눈에 확인할 수 있습니다</p>
      </div>

      <div className="timeline-scroll">
        <div className="timeline">
          <div className="timeline__months">
            {monthLabels.map(({ label, position }) => (
              <span
                key={label}
                className="timeline__month-label"
                style={{ left: `${position}%` }}
              >
                {label}
              </span>
            ))}
          </div>

          <div className="timeline__track-area">
            {todayInRange && (
              <div
                className="timeline__today-marker"
                style={{ left: `${todayPosition}%` }}
                aria-hidden="true"
              >
                <span className="timeline__today-label">오늘</span>
              </div>
            )}

            <div className="timeline__rows">
              {events.map((event) => {
                const { left, width } = getTimelinePosition(event.start, event.end, min, max)

                return (
                  <div key={event.title} className="timeline__row">
                    <div className="timeline__row-label" title={event.title}>
                      {event.title}
                    </div>
                    <div className="timeline__row-track">
                      <div
                        className={`timeline__bar timeline__bar--${event.status}`}
                        style={{ left: `${left}%`, width: `${width}%` }}
                        title={`${event.title}: ${formatDateShort(event.start)} ~ ${formatDateShort(event.end)}`}
                      >
                        <span className="timeline__bar-label">{event.title}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
