"use client"

import React from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/drake_libs/ui/alert"
import { Badge } from "@/components/drake_libs/ui/badge"
import { Button } from "@/components/drake_libs/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/drake_libs/ui/card"
import { ScrollArea } from "@/components/drake_libs/ui/scroll-area"
import { AlertTriangle, Users, MapPin, Clock, CheckCircle2, XCircle } from "lucide-react"
import { ScheduleConflict } from "../types/schedule.types"

interface ConflictDetectorProps {
  conflicts: ScheduleConflict[]
  onResolve?: (conflictId: string) => void
  onIgnore?: (conflictId: string) => void
}

export function ConflictDetector({ conflicts, onResolve, onIgnore }: ConflictDetectorProps) {
  if (conflicts.length === 0) {
    return (
      <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800 dark:text-green-200">No Conflicts</AlertTitle>
        <AlertDescription className="text-green-700 dark:text-green-300">
          This schedule has no conflicts with existing sessions.
        </AlertDescription>
      </Alert>
    )
  }

  const getConflictIcon = (type: ScheduleConflict["type"]) => {
    switch (type) {
      case "room":
        return <MapPin className="h-4 w-4" />
      case "teacher":
        return <Users className="h-4 w-4" />
      case "overlap":
        return <Clock className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getConflictColor = (type: ScheduleConflict["type"]) => {
    switch (type) {
      case "room":
        return "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/20 dark:text-red-200"
      case "teacher":
        return "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/20 dark:text-orange-200"
      case "overlap":
        return "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/20 dark:text-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const groupedConflicts = conflicts.reduce((acc, conflict) => {
    if (!acc[conflict.type]) {
      acc[conflict.type] = []
    }
    acc[conflict.type].push(conflict)
    return acc
  }, {} as Record<string, ScheduleConflict[]>)

  return (
    <Card className="border-red-200 dark:border-red-800">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <div>
            <CardTitle className="text-lg text-red-800 dark:text-red-200">
              {conflicts.length} Conflict{conflicts.length > 1 ? "s" : ""} Detected
            </CardTitle>
            <CardDescription>
              Review and resolve conflicts before creating this schedule
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-3">
            {Object.entries(groupedConflicts).map(([type, typeConflicts]) => (
              <div key={type} className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  {getConflictIcon(type as ScheduleConflict["type"])}
                  <h4 className="font-semibold text-sm capitalize">
                    {type} Conflicts ({typeConflicts.length})
                  </h4>
                </div>
                {typeConflicts.map((conflict) => (
                  <Alert
                    key={conflict.id}
                    className={getConflictColor(conflict.type)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <AlertDescription className="text-sm">
                          {conflict.message}
                        </AlertDescription>
                        <div className="flex gap-1 mt-2">
                          {conflict.affectedSchedules.map((scheduleId) => (
                            <Badge
                              key={scheduleId}
                              variant="outline"
                              className="text-xs"
                            >
                              Schedule #{scheduleId}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {onResolve && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onResolve(conflict.id)}
                            className="h-8 px-2"
                          >
                            <CheckCircle2 className="h-3 w-3" />
                          </Button>
                        )}
                        {onIgnore && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onIgnore(conflict.id)}
                            className="h-8 px-2"
                          >
                            <XCircle className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </Alert>
                ))}
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="mt-4 p-3 bg-muted rounded-lg">
          <h4 className="text-sm font-semibold mb-2">Resolution Suggestions:</h4>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Choose a different time slot</li>
            <li>Select an alternative room or teacher</li>
            <li>Adjust the duration to avoid overlaps</li>
            <li>Reschedule one of the conflicting sessions</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
