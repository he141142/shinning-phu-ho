import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/drake_libs/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/drake_libs/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/drake_libs/ui/popover"
import { Calendar } from "@/components/drake_libs/ui/calendar"

interface CalendarHeaderProps {
  view: "month" | "week" | "day"
  date: Date
  onViewChange: (view: "month" | "week" | "day") => void
  onDateChange: (date: Date) => void
  onAddEvent: () => void
}

export default function CalendarHeader({ view, date, onViewChange, onDateChange, onAddEvent }: CalendarHeaderProps) {
  const currentYear = date.getFullYear()
  const currentMonth = date.getMonth()

  const goToToday = () => {
    onDateChange(new Date())
  }

  const goToPrevious = () => {
    const newDate = new Date(date)
    if (view === "month") {
      newDate.setMonth(date.getMonth() - 1)
    } else if (view === "week") {
      newDate.setDate(date.getDate() - 7)
    } else {
      newDate.setDate(date.getDate() - 1)
    }
    onDateChange(newDate)
  }

  const goToNext = () => {
    const newDate = new Date(date)
    if (view === "month") {
      newDate.setMonth(date.getMonth() + 1)
    } else if (view === "week") {
      newDate.setDate(date.getDate() + 7)
    } else {
      newDate.setDate(date.getDate() + 1)
    }
    onDateChange(newDate)
  }

  const handleMonthChange = (monthStr: string) => {
    const newDate = new Date(date)
    newDate.setMonth(parseInt(monthStr))
    onDateChange(newDate)
  }

  const handleYearChange = (yearStr: string) => {
    const newDate = new Date(date)
    newDate.setFullYear(parseInt(yearStr))
    onDateChange(newDate)
  }

  const getHeaderText = () => {
    if (view === "month") {
      return format(date, "MMMM yyyy")
    } else if (view === "week") {
      const start = new Date(date)
      start.setDate(date.getDate() - date.getDay())
      const end = new Date(start)
      end.setDate(start.getDate() + 6)

      if (start.getMonth() === end.getMonth()) {
        return `${format(start, "MMMM d")} - ${format(end, "d, yyyy")}`
      } else if (start.getFullYear() === end.getFullYear()) {
        return `${format(start, "MMMM d")} - ${format(end, "MMMM d, yyyy")}`
      } else {
        return `${format(start, "MMMM d, yyyy")} - ${format(end, "MMMM d, yyyy")}`
      }
    } else {
      return format(date, "EEEE, MMMM d, yyyy")
    }
  }

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const years = Array.from({ length: 100 }, (_, i) => currentYear - 50 + i)

  return (
    <div className="flex items-center justify-between border-b p-4 bg-gradient-to-r from-background to-muted/20">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" onClick={goToPrevious} className="h-9 w-9">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={goToNext} className="h-9 w-9">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <Button variant="default" onClick={goToToday} className="font-medium">
          Today
        </Button>

        <div className="h-6 w-px bg-border mx-1" />

        <div className="flex items-center gap-2">
          <Select value={currentMonth.toString()} onValueChange={handleMonthChange}>
            <SelectTrigger className="w-[130px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((month, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={currentYear.toString()} onValueChange={handleYearChange}>
            <SelectTrigger className="w-[100px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && onDateChange(newDate)}
                initialFocus
                captionLayout="dropdown-buttons"
                fromYear={1900}
                toYear={2100}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="h-6 w-px bg-border mx-1" />

        <h2 className="text-lg font-semibold text-muted-foreground hidden sm:block">
          {getHeaderText()}
        </h2>
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={onAddEvent} className="gap-2 font-medium">
          <Plus className="h-4 w-4" />
          New Event
        </Button>
      </div>
    </div>
  )
}

