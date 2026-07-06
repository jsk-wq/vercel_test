import type { ScheduleStatus } from '../types/schedule'

interface SummaryCardsProps {
  counts: Record<ScheduleStatus, number>
}

const CARD_CONFIG: { key: ScheduleStatus; label: string; description: string }[] = [
  { key: 'ongoing', label: '진행 중', description: '현재 진행 중인 일정' },
  { key: 'upcoming', label: '예정', description: '앞으로 시작될 일정' },
  { key: 'past', label: '종료', description: '이미 끝난 일정' },
]

export function SummaryCards({ counts }: SummaryCardsProps) {
  return (
    <section className="summary-cards" aria-label="일정 요약">
      {CARD_CONFIG.map(({ key, label, description }) => (
        <article key={key} className={`summary-card summary-card--${key}`}>
          <p className="summary-card__label">{label}</p>
          <p className="summary-card__count">{counts[key]}</p>
          <p className="summary-card__description">{description}</p>
        </article>
      ))}
    </section>
  )
}
