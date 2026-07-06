import type { ScheduleStatus } from '../types/schedule'
import { STATUS_LABELS } from '../lib/scheduleUtils'

interface StatusBadgeProps {
  status: ScheduleStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={`status-badge status-badge--${status}`}>{STATUS_LABELS[status]}</span>
}
