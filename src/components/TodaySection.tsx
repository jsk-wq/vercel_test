import type { ScheduleEventWithStatus } from '../types/schedule'
import { formatDate, getDaysLeft } from '../lib/scheduleUtils'
import { StatusBadge } from './StatusBadge'

interface TodaySectionProps {
  events: ScheduleEventWithStatus[]
  today: Date
}

export function TodaySection({ events, today }: TodaySectionProps) {
  const todayLabel = today.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })

  return (
    <section className="today-section">
      <div className="section-heading">
        <h2>오늘의 일정</h2>
        <p>{todayLabel}</p>
      </div>

      {events.length === 0 ? (
        <div className="empty-state today-section__empty">
          오늘 진행 중인 학사 일정이 없습니다.
        </div>
      ) : (
        <div className="today-section__grid">
          {events.map((event) => {
            const daysLeft = getDaysLeft(event.end, today)
            const isLastDay = daysLeft === 0

            return (
              <article key={event.title} className="today-card">
                <div className="today-card__top">
                  <StatusBadge status={event.status} />
                  {isLastDay && <span className="today-card__tag">오늘 마감</span>}
                </div>
                <h3 className="today-card__title">{event.title}</h3>
                <p className="today-card__dates">
                  {formatDate(event.start)} ~ {formatDate(event.end)}
                </p>
                <p className="today-card__meta">
                  {isLastDay ? '오늘이 마지막 날입니다' : `${daysLeft}일 남음`}
                </p>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
