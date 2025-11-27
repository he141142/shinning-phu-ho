import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/drake_libs/ui/card"
import { Alert, AlertDescription } from "@/components/drake_libs/ui/alert"
import { Badge } from "@/components/drake_libs/ui/badge"
import { Button } from "@/components/drake_libs/ui/button"
import { ScrollArea } from "@/components/drake_libs/ui/scroll-area"
import { Lightbulb, TrendingUp, AlertCircle, Info, ArrowRight } from "lucide-react"
import { ScheduleOptimization } from "../types/schedule.types"
import { getDayName } from "../utils/schedule.utils"

interface OptimizationSuggestionsProps {
  optimizations: ScheduleOptimization[]
  onApplySuggestion?: (optimization: ScheduleOptimization) => void
}

export function OptimizationSuggestions({
  optimizations,
  onApplySuggestion,
}: OptimizationSuggestionsProps) {
  const getPriorityColor = (priority: ScheduleOptimization["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/20 dark:text-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/20 dark:text-yellow-200"
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/20 dark:text-blue-200"
    }
  }

  const getPriorityIcon = (priority: ScheduleOptimization["priority"]) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="h-4 w-4" />
      case "medium":
        return <Info className="h-4 w-4" />
      case "low":
        return <TrendingUp className="h-4 w-4" />
    }
  }

  const getTypeLabel = (type: ScheduleOptimization["type"]) => {
    switch (type) {
      case "gap":
        return "Time Gap"
      case "overload":
        return "Schedule Overload"
      case "distribution":
        return "Distribution"
      case "resource":
        return "Resource Usage"
    }
  }

  const groupedOptimizations = optimizations.reduce((acc, opt) => {
    if (!acc[opt.priority]) {
      acc[opt.priority] = []
    }
    acc[opt.priority].push(opt)
    return acc
  }, {} as Record<ScheduleOptimization["priority"], ScheduleOptimization[]>)

  const priorityOrder: ScheduleOptimization["priority"][] = ["high", "medium", "low"]

  if (optimizations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-green-600" />
            <div>
              <CardTitle className="text-lg text-green-800 dark:text-green-200">
                Optimal Schedule
              </CardTitle>
              <CardDescription>
                Your schedule is well-optimized with no suggestions
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          <div>
            <CardTitle className="text-lg">Optimization Suggestions</CardTitle>
            <CardDescription>
              AI-powered recommendations to improve your schedule
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {priorityOrder.map(
              (priority) =>
                groupedOptimizations[priority] && (
                  <div key={priority} className="space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className={getPriorityColor(priority)}>
                        {getPriorityIcon(priority)}
                        <span className="ml-1 capitalize">{priority} Priority</span>
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        ({groupedOptimizations[priority].length} suggestion
                        {groupedOptimizations[priority].length > 1 ? "s" : ""})
                      </span>
                    </div>

                    {groupedOptimizations[priority].map((optimization, index) => (
                      <Alert
                        key={`${priority}-${index}`}
                        className={getPriorityColor(priority)}
                      >
                        <div className="flex flex-col gap-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-white/50 dark:bg-black/20"
                                >
                                  {getTypeLabel(optimization.type)}
                                </Badge>
                                {optimization.affectedDays && (
                                  <span className="text-xs font-medium">
                                    {optimization.affectedDays
                                      .map((day) => getDayName(day).slice(0, 3))
                                      .join(", ")}
                                  </span>
                                )}
                              </div>
                              <AlertDescription className="text-sm font-medium">
                                {optimization.suggestion}
                              </AlertDescription>
                            </div>
                            {onApplySuggestion && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => onApplySuggestion(optimization)}
                                className="shrink-0"
                              >
                                <ArrowRight className="h-3 w-3" />
                              </Button>
                            )}
                          </div>

                          {/* Action Recommendations */}
                          <div className="pl-4 border-l-2 border-current/20">
                            <p className="text-xs font-medium mb-1">Recommended Actions:</p>
                            <ul className="text-xs space-y-0.5">
                              {optimization.type === "gap" && (
                                <>
                                  <li>• Add a session to fill the gap</li>
                                  <li>• Merge adjacent sessions</li>
                                  <li>• Schedule self-study or office hours</li>
                                </>
                              )}
                              {optimization.type === "overload" && (
                                <>
                                  <li>• Split long sessions into shorter ones</li>
                                  <li>• Distribute to different days</li>
                                  <li>• Add breaks between sessions</li>
                                </>
                              )}
                              {optimization.type === "distribution" && (
                                <>
                                  <li>• Spread sessions across more days</li>
                                  <li>• Balance weekly workload</li>
                                  <li>• Consider student capacity</li>
                                </>
                              )}
                              {optimization.type === "resource" && (
                                <>
                                  <li>• Review room and teacher availability</li>
                                  <li>• Optimize resource utilization</li>
                                  <li>• Consider shared resources</li>
                                </>
                              )}
                            </ul>
                          </div>
                        </div>
                      </Alert>
                    ))}
                  </div>
                )
            )}
          </div>
        </ScrollArea>

        {/* Summary Stats */}
        <div className="mt-4 pt-4 border-t">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-red-600">
                {groupedOptimizations.high?.length || 0}
              </div>
              <div className="text-xs text-muted-foreground">High Priority</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {groupedOptimizations.medium?.length || 0}
              </div>
              <div className="text-xs text-muted-foreground">Medium Priority</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {groupedOptimizations.low?.length || 0}
              </div>
              <div className="text-xs text-muted-foreground">Low Priority</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
