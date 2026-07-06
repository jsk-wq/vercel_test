export type ScheduleStatus = 'ongoing' | 'upcoming' | 'past'

export interface ScheduleEvent {
  start: Date
  end: Date
  title: string
}

export interface ScheduleEventWithStatus extends ScheduleEvent {
  status: ScheduleStatus
}

export type ScheduleFilter = 'all' | ScheduleStatus
