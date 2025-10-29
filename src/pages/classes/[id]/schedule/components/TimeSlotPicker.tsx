"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/drake_libs/ui/card"
import { Badge } from "@/components/drake_libs/ui/badge"
import { Button } from "@/components/drake_libs/ui/button"
import { Clock, Check, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { generateTimeSlots, timeToMinutes, minutesToTime, formatDuration } from "../utils/schedule.utils"
import { TimeSlot } from "../types/schedule.types"

interface TimeSlotPickerProps {
  selectedStart?: string
  selectedEnd?: string
  onTimeChange: (start: string, end: string) => void
  occupiedSlots?: TimeSlot[]
  suggestedSlots?: TimeSlot[]
  minDuration?: number // in minutes
  maxDuration?: number // in minutes
}

export function TimeSlotPicker({
  selectedStart,
  selectedEnd,
  onTimeChange,
  occupiedSlots = [],
  suggestedSlots = [],
  minDuration = 30,
  maxDuration = 180,
}: TimeSlotPickerProps) {
  const [isSelecting, setIsSelecting] = useState(false)
  const [tempStart, setTempStart] = useState<string | null>(null)
  const [quickDuration, setQuickDuration] = useState(60) // Default 1 hour

  const timeSlots = useMemo(() => generateTimeSlots(7, 22, 30), [])

  const isSlotOccupied = (time: string): boolean => {
    const timeInMinutes = timeToMinutes(time)
    return occupiedSlots.some((slot) => {
      const start = timeToMinutes(slot.start)
      const end = timeToMinutes(slot.end)
      return timeInMinutes >= start && timeInMinutes < end
    })
  }

  const isSlotSuggested = (time: string): boolean => {
    const timeInMinutes = timeToMinutes(time)
    return suggestedSlots.some((slot) => {
      const start = timeToMinutes(slot.start)
      const end = timeToMinutes(slot.end)
      return timeInMinutes >= start && timeInMinutes < end
    })
  }

  const isSlotSelected = (time: string): boolean => {
    if (!selectedStart || !selectedEnd) return false
    const timeInMinutes = timeToMinutes(time)
    const start = timeToMinutes(selectedStart)
    const end = timeToMinutes(selectedEnd)
    return timeInMinutes >= start && timeInMinutes < end
  }

  const isSlotInTempSelection = (time: string): boolean => {
    if (!tempStart) return false
    const timeInMinutes = timeToMinutes(time)
    const start = timeToMinutes(tempStart)
    return timeInMinutes >= start && timeInMinutes < start + quickDuration
  }

  const handleSlotClick = (time: string) => {
    if (isSlotOccupied(time)) return

    if (!isSelecting) {
      // Start selection
      setTempStart(time)
      setIsSelecting(true)
    } else {
      // Complete selection
      if (tempStart) {
        const startMinutes = timeToMinutes(tempStart)
        const endMinutes = timeToMinutes(time)

        if (endMinutes > startMinutes) {
          const duration = endMinutes - startMinutes
          if (duration >= minDuration && duration <= maxDuration) {
            onTimeChange(tempStart, time)
            setIsSelecting(false)
            setTempStart(null)
          }
        }
      }
    }
  }

  const handleQuickSelect = (duration: number) => {
    setQuickDuration(duration)
  }

  const applyQuickDuration = () => {
    if (tempStart) {
      const endTime = minutesToTime(timeToMinutes(tempStart) + quickDuration)
      onTimeChange(tempStart, endTime)
      setIsSelecting(false)
      setTempStart(null)
    }
  }

  const applySuggestedSlot = (slot: TimeSlot) => {
    onTimeChange(slot.start, slot.end)
    setIsSelecting(false)
    setTempStart(null)
  }

  const cancelSelection = () => {
    setIsSelecting(false)
    setTempStart(null)
  }

  const getSlotClassName = (time: string) => {
    return cn(
      "h-12 px-3 py-2 text-sm font-medium transition-all cursor-pointer border-l border-r border-b first:border-t",
      "hover:bg-accent/50",
      isSlotOccupied(time) && "bg-muted text-muted-foreground cursor-not-allowed opacity-50",
      isSlotSelected(time) && "bg-primary text-primary-foreground hover:bg-primary/90",
      isSlotInTempSelection(time) && "bg-primary/50 text-primary-foreground",
      isSlotSuggested(time) && !isSlotSelected(time) && !isSlotOccupied(time) && "bg-green-50 border-green-200"
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Select Time Slot</CardTitle>
            <CardDescription>
              {isSelecting
                ? "Click to set end time or use quick duration"
                : "Click to set start time"}
            </CardDescription>
          </div>
          {selectedStart && selectedEnd && (
            <Badge variant="outline" className="text-base px-4 py-2">
              <Clock className="w-4 h-4 mr-2" />
              {selectedStart} - {selectedEnd} ({formatDuration(timeToMinutes(selectedEnd) - timeToMinutes(selectedStart))})
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Quick Duration Buttons */}
        {isSelecting && (
          <div className="mb-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium">Quick Duration:</span>
              {[30, 60, 90, 120, 180].map((duration) => (
                <Button
                  key={duration}
                  variant={quickDuration === duration ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleQuickSelect(duration)}
                >
                  {formatDuration(duration)}
                </Button>
              ))}
            </div>
            <div className="flex gap-2 mt-3">
              <Button size="sm" onClick={applyQuickDuration} className="flex-1">
                <Check className="w-4 h-4 mr-1" />
                Apply {formatDuration(quickDuration)}
              </Button>
              <Button size="sm" variant="outline" onClick={cancelSelection}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Suggested Slots */}
        {suggestedSlots.length > 0 && !isSelecting && (
          <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-green-800 dark:text-green-200">
                Suggested Time Slots:
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestedSlots.map((slot, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => applySuggestedSlot(slot)}
                  className="border-green-300 hover:bg-green-100"
                >
                  {slot.start} - {slot.end}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Time Slot Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-0 border rounded-lg overflow-hidden">
          {timeSlots.map((time) => (
            <div
              key={time}
              className={getSlotClassName(time)}
              onClick={() => handleSlotClick(time)}
            >
              <div className="flex items-center justify-between">
                <span>{time}</span>
                {isSlotSelected(time) && <Check className="w-4 h-4" />}
                {isSlotSuggested(time) && !isSlotSelected(time) && !isSlotOccupied(time) && (
                  <Zap className="w-3 h-3 text-green-600" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary rounded" />
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-50 border border-green-200 rounded" />
            <span>Suggested</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-muted rounded" />
            <span>Occupied</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
