import { ScheduleSession, ScheduleConflict, ScheduleOptimization, TimeSlot } from "../types/schedule.types"

export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 60 + minutes
}

export const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`
}

export const calculateDuration = (startTime: string, endTime: string): number => {
  return timeToMinutes(endTime) - timeToMinutes(startTime)
}

export const doTimeSlotsOverlap = (slot1: TimeSlot, slot2: TimeSlot): boolean => {
  const start1 = timeToMinutes(slot1.start)
  const end1 = timeToMinutes(slot1.end)
  const start2 = timeToMinutes(slot2.start)
  const end2 = timeToMinutes(slot2.end)

  return start1 < end2 && start2 < end1
}

export const detectConflicts = (
  schedule: ScheduleSession,
  existingSchedules: ScheduleSession[]
): ScheduleConflict[] => {
  const conflicts: ScheduleConflict[] = []
  const scheduleDate = new Date(schedule.date).toDateString()

  existingSchedules.forEach((existing) => {
    if (existing.id === schedule.id) return
    if (new Date(existing.date).toDateString() !== scheduleDate) return

    const overlap = doTimeSlotsOverlap(
      { start: schedule.startTime, end: schedule.endTime },
      { start: existing.startTime, end: existing.endTime }
    )

    if (!overlap) return

    // Check for room conflict
    if (schedule.roomId === existing.roomId) {
      conflicts.push({
        id: `room-${existing.id}`,
        type: "room",
        message: `Room conflict with "${existing.title}" at ${existing.startTime}-${existing.endTime}`,
        affectedSchedules: [schedule.id, existing.id],
      })
    }

    // Check for teacher conflict
    if (schedule.teacherId === existing.teacherId) {
      conflicts.push({
        id: `teacher-${existing.id}`,
        type: "teacher",
        message: `Teacher conflict with "${existing.title}" at ${existing.startTime}-${existing.endTime}`,
        affectedSchedules: [schedule.id, existing.id],
      })
    }

    // Check for time overlap
    if (schedule.roomId !== existing.roomId && schedule.teacherId !== existing.teacherId) {
      conflicts.push({
        id: `overlap-${existing.id}`,
        type: "overlap",
        message: `Time overlap with "${existing.title}" at ${existing.startTime}-${existing.endTime}`,
        affectedSchedules: [schedule.id, existing.id],
      })
    }
  })

  return conflicts
}

export const generateTimeSlots = (startHour = 7, endHour = 22, intervalMinutes = 30): string[] => {
  const slots: string[] = []
  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minute = 0; minute < 60; minute += intervalMinutes) {
      if (hour === endHour && minute > 0) break
      slots.push(`${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`)
    }
  }
  return slots
}

export const suggestOptimalTimeSlots = (
  existingSchedules: ScheduleSession[],
  duration: number,
  date: Date
): TimeSlot[] => {
  const suggestions: TimeSlot[] = []
  const dateStr = date.toDateString()
  const daySchedules = existingSchedules.filter(
    (s) => new Date(s.date).toDateString() === dateStr
  )

  // Sort schedules by start time
  daySchedules.sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime))

  // Check gaps between schedules
  const workDayStart = timeToMinutes("08:00")
  const workDayEnd = timeToMinutes("20:00")

  if (daySchedules.length === 0) {
    // Suggest morning, afternoon, evening
    suggestions.push(
      { start: "08:00", end: minutesToTime(timeToMinutes("08:00") + duration) },
      { start: "13:00", end: minutesToTime(timeToMinutes("13:00") + duration) },
      { start: "17:00", end: minutesToTime(timeToMinutes("17:00") + duration) }
    )
  } else {
    // Check gap before first schedule
    if (timeToMinutes(daySchedules[0].startTime) - workDayStart >= duration) {
      suggestions.push({
        start: minutesToTime(workDayStart),
        end: minutesToTime(workDayStart + duration),
      })
    }

    // Check gaps between schedules
    for (let i = 0; i < daySchedules.length - 1; i++) {
      const gapStart = timeToMinutes(daySchedules[i].endTime)
      const gapEnd = timeToMinutes(daySchedules[i + 1].startTime)
      if (gapEnd - gapStart >= duration) {
        suggestions.push({
          start: daySchedules[i].endTime,
          end: minutesToTime(gapStart + duration),
        })
      }
    }

    // Check gap after last schedule
    const lastEnd = timeToMinutes(daySchedules[daySchedules.length - 1].endTime)
    if (workDayEnd - lastEnd >= duration) {
      suggestions.push({
        start: daySchedules[daySchedules.length - 1].endTime,
        end: minutesToTime(lastEnd + duration),
      })
    }
  }

  return suggestions.slice(0, 5) // Return top 5 suggestions
}

export const analyzeScheduleOptimizations = (
  schedules: ScheduleSession[]
): ScheduleOptimization[] => {
  const optimizations: ScheduleOptimization[] = []

  // Group schedules by day of week
  const schedulesByDay: Record<number, ScheduleSession[]> = {}
  schedules.forEach((schedule) => {
    const day = new Date(schedule.date).getDay()
    if (!schedulesByDay[day]) schedulesByDay[day] = []
    schedulesByDay[day].push(schedule)
  })

  // Check for gaps
  Object.entries(schedulesByDay).forEach(([day, daySchedules]) => {
    daySchedules.sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime))

    for (let i = 0; i < daySchedules.length - 1; i++) {
      const gap = timeToMinutes(daySchedules[i + 1].startTime) - timeToMinutes(daySchedules[i].endTime)
      if (gap > 120) { // More than 2 hours gap
        optimizations.push({
          suggestion: `Large gap (${Math.floor(gap / 60)}h ${gap % 60}m) between sessions on ${getDayName(parseInt(day))}`,
          type: "gap",
          priority: "medium",
          affectedDays: [parseInt(day)],
        })
      }
    }

    // Check for overload (more than 6 hours in a day)
    const totalMinutes = daySchedules.reduce(
      (sum, s) => sum + calculateDuration(s.startTime, s.endTime),
      0
    )
    if (totalMinutes > 360) {
      optimizations.push({
        suggestion: `Heavy schedule on ${getDayName(parseInt(day))} (${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m)`,
        type: "overload",
        priority: "high",
        affectedDays: [parseInt(day)],
      })
    }
  })

  // Check for uneven distribution
  const daysWithSchedules = Object.keys(schedulesByDay).length
  if (daysWithSchedules < 3 && schedules.length > 5) {
    optimizations.push({
      suggestion: "Sessions concentrated in few days. Consider spreading across more days.",
      type: "distribution",
      priority: "medium",
    })
  }

  return optimizations
}

export const getDayName = (day: number): string => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  return days[day]
}

export const getWeekDates = (date: Date): Date[] => {
  const dates: Date[] = []
  const current = new Date(date)
  const day = current.getDay()
  const diff = current.getDate() - day + (day === 0 ? -6 : 1) // Adjust to Monday

  current.setDate(diff)

  for (let i = 0; i < 7; i++) {
    dates.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }

  return dates
}

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins}m`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}
