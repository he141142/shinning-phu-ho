import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/drake_libs/ui/card"
import { Label } from "@/components/drake_libs/ui/label"
import { Input } from "@/components/drake_libs/ui/input"
import { Button } from "@/components/drake_libs/ui/button"
import { Badge } from "@/components/drake_libs/ui/badge"
import { Calendar } from "@/components/drake_libs/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/drake_libs/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/drake_libs/ui/select"
import { Repeat, Calendar as CalendarIcon, Infinity } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { RecurrencePattern } from "../types/schedule.types"
import { getDayName } from "../utils/schedule.utils"

interface RecurrenceBuilderProps {
  value: RecurrencePattern
  onChange: (pattern: RecurrencePattern) => void
  startDate: Date
}

export function RecurrenceBuilder({ value, onChange, startDate }: RecurrenceBuilderProps) {
  const [endType, setEndType] = useState<"date" | "occurrences" | "never">("never")

  const daysOfWeek = [
    { value: 0, label: "Sun" },
    { value: 1, label: "Mon" },
    { value: 2, label: "Tue" },
    { value: 3, label: "Wed" },
    { value: 4, label: "Thu" },
    { value: 5, label: "Fri" },
    { value: 6, label: "Sat" },
  ]

  const handleTypeChange = (type: RecurrencePattern["type"]) => {
    onChange({
      ...value,
      type,
      daysOfWeek: type === "weekly" || type === "biweekly" ? [startDate.getDay()] : undefined,
      interval: type === "custom" ? 1 : undefined,
    })
  }

  const handleDayToggle = (day: number) => {
    const currentDays = value.daysOfWeek || []
    const newDays = currentDays.includes(day)
      ? currentDays.filter((d) => d !== day)
      : [...currentDays, day].sort()

    onChange({ ...value, daysOfWeek: newDays })
  }

  const handleEndDateChange = (date: Date | undefined) => {
    onChange({ ...value, endDate: date, occurrences: undefined })
    setEndType("date")
  }

  const handleOccurrencesChange = (occurrences: number) => {
    onChange({ ...value, occurrences, endDate: undefined })
    setEndType("occurrences")
  }

  const handleIntervalChange = (interval: number) => {
    onChange({ ...value, interval })
  }

  const getRecurrenceSummary = (): string => {
    if (value.type === "once") return "One-time event"

    let summary = ""
    switch (value.type) {
      case "daily":
        summary = "Daily"
        break
      case "weekly":
        if (value.daysOfWeek && value.daysOfWeek.length > 0) {
          summary = `Weekly on ${value.daysOfWeek.map((d) => getDayName(d).slice(0, 3)).join(", ")}`
        } else {
          summary = "Weekly"
        }
        break
      case "biweekly":
        if (value.daysOfWeek && value.daysOfWeek.length > 0) {
          summary = `Every 2 weeks on ${value.daysOfWeek.map((d) => getDayName(d).slice(0, 3)).join(", ")}`
        } else {
          summary = "Every 2 weeks"
        }
        break
      case "monthly":
        summary = "Monthly"
        break
      case "custom":
        summary = `Every ${value.interval || 1} day${(value.interval || 1) > 1 ? "s" : ""}`
        break
    }

    if (value.endDate) {
      summary += ` until ${format(value.endDate, "MMM dd, yyyy")}`
    } else if (value.occurrences) {
      summary += ` for ${value.occurrences} occurrence${value.occurrences > 1 ? "s" : ""}`
    }

    return summary
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Repeat className="w-5 h-5" />
          <div>
            <CardTitle className="text-lg">Recurrence Pattern</CardTitle>
            <CardDescription>Set how often this schedule repeats</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Recurrence Type */}
        <div className="space-y-2">
          <Label>Repeat</Label>
          <Select value={value.type} onValueChange={handleTypeChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="once">Does not repeat</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="biweekly">Bi-weekly (Every 2 weeks)</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Custom Interval */}
        {value.type === "custom" && (
          <div className="space-y-2">
            <Label>Repeat every</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={1}
                value={value.interval || 1}
                onChange={(e) => handleIntervalChange(parseInt(e.target.value))}
                className="w-20"
              />
              <span className="text-sm text-muted-foreground">day(s)</span>
            </div>
          </div>
        )}

        {/* Days of Week Selection */}
        {(value.type === "weekly" || value.type === "biweekly") && (
          <div className="space-y-2">
            <Label>Repeat on</Label>
            <div className="flex gap-2 flex-wrap">
              {daysOfWeek.map((day) => (
                <Button
                  key={day.value}
                  type="button"
                  variant={value.daysOfWeek?.includes(day.value) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleDayToggle(day.value)}
                  className="w-12"
                >
                  {day.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* End Condition */}
        {value.type !== "once" && (
          <div className="space-y-3">
            <Label>Ends</Label>
            <div className="space-y-2">
              {/* Never */}
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant={endType === "never" ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setEndType("never")
                    onChange({ ...value, endDate: undefined, occurrences: undefined })
                  }}
                  className="gap-2"
                >
                  <Infinity className="w-4 h-4" />
                  Never
                </Button>
              </div>

              {/* On Date */}
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant={endType === "date" ? "default" : "outline"}
                      size="sm"
                      className={cn("gap-2", !value.endDate && "text-muted-foreground")}
                    >
                      <CalendarIcon className="w-4 h-4" />
                      {value.endDate ? format(value.endDate, "MMM dd, yyyy") : "On date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={value.endDate}
                      onSelect={handleEndDateChange}
                      initialFocus
                      disabled={(date) => date < startDate}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* After Occurrences */}
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant={endType === "occurrences" ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setEndType("occurrences")
                    if (!value.occurrences) handleOccurrencesChange(10)
                  }}
                >
                  After
                </Button>
                {endType === "occurrences" && (
                  <>
                    <Input
                      type="number"
                      min={1}
                      value={value.occurrences || 10}
                      onChange={(e) => handleOccurrencesChange(parseInt(e.target.value))}
                      className="w-20"
                    />
                    <span className="text-sm text-muted-foreground">occurrence(s)</span>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="pt-4 border-t">
          <Label className="text-xs text-muted-foreground">Summary</Label>
          <Badge variant="outline" className="mt-2 w-full justify-start text-sm py-2">
            {getRecurrenceSummary()}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
