
"use client"

import { Calendar } from "@/components/drake_libs/ui/calendar"
import { useState } from "react"

export function DatePicker() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <div className="p-4">
      <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
    </div>
  )
}

