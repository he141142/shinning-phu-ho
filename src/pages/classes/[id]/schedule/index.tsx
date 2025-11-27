import React, { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { Button } from "@/components/drake_libs/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/drake_libs/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/drake_libs/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/drake_libs/ui/dialog"
import { Input } from "@/components/drake_libs/ui/input"
import { Label } from "@/components/drake_libs/ui/label"
import { Textarea } from "@/components/drake_libs/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/drake_libs/ui/select"
import { Calendar } from "@/components/drake_libs/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/drake_libs/ui/popover"
import { Badge } from "@/components/drake_libs/ui/badge"
import { Plus, Calendar as CalendarIcon, Save, LayoutGrid, ListChecks, Sparkles, ArrowLeft } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

import { TimeSlotPicker } from "./components/TimeSlotPicker"
import { RecurrenceBuilder } from "./components/RecurrenceBuilder"
import { ConflictDetector } from "./components/ConflictDetector"
import { ScheduleTemplates } from "./components/ScheduleTemplates"
import { OptimizationSuggestions } from "./components/OptimizationSuggestions"

import { ScheduleSession, RecurrencePattern, ScheduleTemplate } from "./types/schedule.types"
import {
  detectConflicts,
  suggestOptimalTimeSlots,
  analyzeScheduleOptimizations,
  getWeekDates
} from "./utils/schedule.utils"

export default function ScheduleManagementPage() {
  const router = useRouter()
  const { id } = router.query
  const classId = id ? parseInt(id as string) : 0

  // State management
  const [activeTab, setActiveTab] = useState<"schedule" | "templates" | "optimize">("schedule")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date())

  // Mock data - replace with actual API calls
  const [schedules, setSchedules] = useState<ScheduleSession[]>([])
  const [templates, setTemplates] = useState<ScheduleTemplate[]>([])
  const [rooms, setRooms] = useState<Array<{ id: number; name: string }>>([
    { id: 1, name: "Room 101" },
    { id: 2, name: "Room 102" },
    { id: 3, name: "Lab A" },
  ])
  const [teachers, setTeachers] = useState<Array<{ id: number; name: string }>>([
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
  ])
  const [subjects, setSubjects] = useState<Array<{ id: number; name: string; color: string }>>([
    { id: 1, name: "Mathematics", color: "bg-blue-100 border-blue-300" },
    { id: 2, name: "Physics", color: "bg-green-100 border-green-300" },
    { id: 3, name: "Chemistry", color: "bg-purple-100 border-purple-300" },
  ])

  // Form state
  const [formData, setFormData] = useState<Partial<ScheduleSession>>({
    title: "",
    description: "",
    date: new Date(),
    startTime: "09:00",
    endTime: "11:00",
    status: "scheduled",
    isRecurring: false,
  })

  const [recurrencePattern, setRecurrencePattern] = useState<RecurrencePattern>({
    type: "once",
  })

  // Calculate conflicts for current form
  const currentConflicts = formData.date && formData.startTime && formData.endTime && formData.roomId && formData.teacherId
    ? detectConflicts(
        {
          ...formData,
          id: 0,
          teacherId: formData.teacherId!,
          roomId: formData.roomId!,
          date: formData.date!,
          startTime: formData.startTime!,
          endTime: formData.endTime!,
          status: formData.status || "scheduled",
          isRecurring: formData.isRecurring || false,
        } as ScheduleSession,
        schedules
      )
    : []

  // Calculate suggested time slots
  const suggestedSlots = formData.date && formData.startTime && formData.endTime
    ? suggestOptimalTimeSlots(
        schedules,
        120, // 2 hours default
        formData.date
      )
    : []

  // Calculate optimizations
  const optimizations = analyzeScheduleOptimizations(schedules)

  const handleCreateSchedule = () => {
    if (!formData.title || !formData.date || !formData.startTime || !formData.endTime) return

    const newSchedule: ScheduleSession = {
      id: schedules.length + 1,
      title: formData.title,
      description: formData.description,
      subjectId: formData.subjectId,
      teacherId: formData.teacherId || 1,
      roomId: formData.roomId || 1,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      status: "scheduled",
      isRecurring: formData.isRecurring || false,
      recurrence: formData.isRecurring ? recurrencePattern : undefined,
    }

    setSchedules([...schedules, newSchedule])
    setIsCreateModalOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: new Date(),
      startTime: "09:00",
      endTime: "11:00",
      status: "scheduled",
      isRecurring: false,
    })
    setRecurrencePattern({ type: "once" })
  }

  const handleApplyTemplate = (template: ScheduleTemplate) => {
    // Logic to apply template - create schedules based on template
    console.log("Applying template:", template)
  }

  const handleSaveTemplate = (template: Omit<ScheduleTemplate, "id">) => {
    const newTemplate: ScheduleTemplate = {
      ...template,
      id: templates.length + 1,
    }
    setTemplates([...templates, newTemplate])
  }

  const handleDeleteTemplate = (templateId: number) => {
    setTemplates(templates.filter((t) => t.id !== templateId))
  }

  const weekDates = getWeekDates(currentWeekStart)

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Schedule Management</h1>
          <p className="text-muted-foreground">
            Create and manage class schedules with powerful tools
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} size="lg">
          <Plus className="w-4 h-4 mr-2" />
          Create Schedule
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="schedule" className="gap-2">
            <LayoutGrid className="w-4 h-4" />
            Schedule View
          </TabsTrigger>
          <TabsTrigger value="templates" className="gap-2">
            <ListChecks className="w-4 h-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="optimize" className="gap-2">
            <Sparkles className="w-4 h-4" />
            Optimize
          </TabsTrigger>
        </TabsList>

        {/* Schedule View Tab */}
        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Schedule</CardTitle>
              <CardDescription>
                View and manage your class schedules for the week
              </CardDescription>
            </CardHeader>
            <CardContent>
              {schedules.length === 0 ? (
                <div className="text-center py-12">
                  <CalendarIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No schedules yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first schedule or use a template to get started
                  </p>
                  <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Schedule
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {schedules.map((schedule) => (
                    <Card key={schedule.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold">{schedule.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {format(schedule.date, "EEEE, MMMM d, yyyy")}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {schedule.startTime} - {schedule.endTime}
                          </p>
                        </div>
                        <Badge variant="outline">{schedule.status}</Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates">
          <ScheduleTemplates
            templates={templates}
            onApplyTemplate={handleApplyTemplate}
            onSaveTemplate={handleSaveTemplate}
            onDeleteTemplate={handleDeleteTemplate}
          />
        </TabsContent>

        {/* Optimize Tab */}
        <TabsContent value="optimize">
          <OptimizationSuggestions optimizations={optimizations} />
        </TabsContent>
      </Tabs>

      {/* Create Schedule Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Schedule</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new class schedule session
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Mathematics Lecture"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Add any additional details..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select
                    value={formData.subjectId?.toString()}
                    onValueChange={(v) => setFormData({ ...formData, subjectId: parseInt(v) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id.toString()}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="teacher">Teacher *</Label>
                  <Select
                    value={formData.teacherId?.toString()}
                    onValueChange={(v) => setFormData({ ...formData, teacherId: parseInt(v) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select teacher" />
                    </SelectTrigger>
                    <SelectContent>
                      {teachers.map((teacher) => (
                        <SelectItem key={teacher.id} value={teacher.id.toString()}>
                          {teacher.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="room">Room *</Label>
                  <Select
                    value={formData.roomId?.toString()}
                    onValueChange={(v) => setFormData({ ...formData, roomId: parseInt(v) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select room" />
                    </SelectTrigger>
                    <SelectContent>
                      {rooms.map((room) => (
                        <SelectItem key={room.id} value={room.id.toString()}>
                          {room.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.date ? format(formData.date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.date}
                        onSelect={(date) => setFormData({ ...formData, date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            {/* Time Slot Picker */}
            <TimeSlotPicker
              selectedStart={formData.startTime}
              selectedEnd={formData.endTime}
              onTimeChange={(start, end) =>
                setFormData({ ...formData, startTime: start, endTime: end })
              }
              suggestedSlots={suggestedSlots}
            />

            {/* Recurrence */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="recurring"
                  checked={formData.isRecurring}
                  onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                />
                <Label htmlFor="recurring">Make this a recurring schedule</Label>
              </div>
              {formData.isRecurring && formData.date && (
                <RecurrenceBuilder
                  value={recurrencePattern}
                  onChange={setRecurrencePattern}
                  startDate={formData.date}
                />
              )}
            </div>

            {/* Conflict Detection */}
            {currentConflicts.length > 0 && (
              <ConflictDetector conflicts={currentConflicts} />
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateSchedule}
              disabled={!formData.title || !formData.date || currentConflicts.length > 0}
            >
              <Save className="w-4 h-4 mr-2" />
              Create Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
