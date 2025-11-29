import { WeekRange } from "./week-range"


// Helper function to convert time string to minutes
const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 60 + minutes
}

// Helper function to calculate position and height for a time slot
const calculateSlotPosition = (startTime: string, endTime: string) => {
  const dayStart = timeToMinutes("07:00") // 7:00 AM
  const startMinutes = timeToMinutes(startTime) - dayStart
  const endMinutes = timeToMinutes(endTime) - dayStart
  const duration = endMinutes - startMinutes

  // Each hour is 60px in height
  const topPosition = (startMinutes / 60) * 60
  const height = (duration / 60) * 60

  return { top: topPosition, height }
}


function getWeekRanges(year: number) {
  let date = new Date(year, 0, 1);

  // Find the first Monday of the year
  while (date.getDay() !== 1) {
    date.setDate(date.getDate() + 1);
  }

  const weeks: WeekRange[] = [];
  let weekNumber = 1;
  while (date.getFullYear() === year) {
    let startDate = new Date(date);
    date.setDate(date.getDate() + 6);
    let endDate = new Date(date);

    weeks.push({
      week: weekNumber++,
      startString: startDate.toLocaleDateString("en-GB"), // Format as DD/MM/YYYY
      endString: endDate.toLocaleDateString("en-GB"),
      start: startDate,
      end: endDate,
    });

    // Move to the next week
    date.setDate(date.getDate() + 1);
  }

  return weeks;
}


// Generate time slots from 7:00 to 23:00
const generateTimeSlots = () => {
  const slots = []
  for (let hour = 7; hour < 23; hour++) {
    slots.push(`${hour.toString().padStart(2, "0")}:00`)
  }
  return slots
}

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];


export {
    calculateSlotPosition,
    getWeekRanges,
    generateTimeSlots,
    weekDays
}