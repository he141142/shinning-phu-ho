
"use client"

import { Calendar } from "@/components/drake_libs/ui/calendar"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/drake_libs/ui/card"

export function DatePicker() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <Card className="w-fit">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Select Date</CardTitle>
        <CardDescription>
          Pick a date from the calendar below
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-lg border-2 shadow-sm"
          captionLayout="dropdown-buttons"
          fromYear={1900}
          toYear={2100}
        />
        {date && (
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">Selected Date:</p>
            <p className="text-lg font-semibold">{date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

