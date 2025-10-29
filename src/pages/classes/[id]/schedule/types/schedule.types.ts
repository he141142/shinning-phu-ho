export interface TimeSlot {
  start: string // HH:mm format
  end: string
}

export interface ScheduleConflict {
  id: string
  type: "room" | "teacher" | "overlap"
  message: string
  affectedSchedules: number[]
}

export interface RecurrencePattern {
  type: "once" | "daily" | "weekly" | "biweekly" | "monthly" | "custom"
  daysOfWeek?: number[] // 0-6 (Sunday-Saturday)
  interval?: number // For custom intervals
  endDate?: Date
  occurrences?: number
}

export interface ScheduleTemplate {
  id: number
  name: string
  description: string
  timeSlots: Array<{
    dayOfWeek: number
    startTime: string
    endTime: string
    subjectId?: number
  }>
}

export interface Subject {
  id: number
  name: string
  color: string
  totalHours: number
  scheduledHours: number
}

export interface ScheduleSession {
  id: number
  title: string
  description?: string
  subjectId?: number
  teacherId: number
  roomId: number
  date: Date
  startTime: string
  endTime: string
  status: "scheduled" | "completed" | "cancelled"
  recurrence?: RecurrencePattern
  isRecurring: boolean
  recurringGroupId?: string
  conflicts?: ScheduleConflict[]
}

export interface ScheduleOptimization {
  suggestion: string
  type: "gap" | "overload" | "distribution" | "resource"
  priority: "low" | "medium" | "high"
  affectedDays?: number[]
}

export interface ScheduleStatistics {
  totalSessions: number
  averageSessionDuration: number
  hoursPerWeek: number
  mostBusyDay: string
  leastBusyDay: string
  subjectDistribution: Record<string, number>
}
