import { useState } from 'react'
import type { ScheduleEventWithStatus, ScheduleFilter } from '../types/schedule'
import {
  formatDate,
  getDDay,
  getDaysLeft,
  getDurationDays,
  filterByStatus,
  STATUS_LABELS,
} from '../lib/scheduleUtils'
import { StatusBadge } from './StatusBadge'

interface ScheduleListProps {
  events: ScheduleEventWithStatus[]
  today: Date
}

const FILTERS: { key: ScheduleFilter; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'ongoing', label: STATUS_LABELS.ongoing },
  { key: 'upcoming', label: STATUS_LABELS.upcoming },
  { key: 'past', label: STATUS_LABELS.past },
]

function getMetaText(event: ScheduleEventWithStatus, today: Date): string {
  if (event.status === 'upcoming') {
    const dday = getDDay(event.start, today)
    return dday === 0 ? '오늘 시작' : `D-${dday}`
  }

  if (event.status === 'ongoing') {
    const daysLeft = getDaysLeft(event.end, today)
    return daysLeft === 0 ? '오늘 마감' : `${daysLeft}일 남음`
  }

  return '종료됨'
}

export function ScheduleList({ events, today }: ScheduleListProps) {
  const [filter, setFilter] = useState<ScheduleFilter>('all')
  const filtered = filterByStatus(events, filter)

  return (
    <section className="schedule-list-section">
      <div className="section-heading section-heading--row">
        <div>
          <h2>일정 목록</h2>
          <p>상태별로 필터링해 확인하세요</p>
        </div>
        <div className="filter-tabs" role="tablist" aria-label="일정 필터">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={filter === key}
              className={`filter-tab${filter === key ? ' filter-tab--active' : ''}`}
              onClick={() => setFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">해당 상태의 일정이 없습니다.</div>
      ) : (
        <div className="schedule-list">
          {filtered.map((event) => (
            <article key={event.title} className={`schedule-card schedule-card--${event.status}`}>
              <div className="schedule-card__header">
                <h3 className="schedule-card__title">{event.title}</h3>
                <StatusBadge status={event.status} />
              </div>
              <p className="schedule-card__dates">
                {formatDate(event.start)} ~ {formatDate(event.end)}
              </p>
              <div className="schedule-card__footer">
                <span className="schedule-card__duration">
                  {getDurationDays(event.start, event.end)}일간
                </span>
                <span className={`schedule-card__meta schedule-card__meta--${event.status}`}>
                  {getMetaText(event, today)}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
