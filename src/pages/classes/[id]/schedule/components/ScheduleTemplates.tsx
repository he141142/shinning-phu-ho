import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/drake_libs/ui/card"
import { Button } from "@/components/drake_libs/ui/button"
import { Input } from "@/components/drake_libs/ui/input"
import { Label } from "@/components/drake_libs/ui/label"
import { Badge } from "@/components/drake_libs/ui/badge"
import { ScrollArea } from "@/components/drake_libs/ui/scroll-area"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/drake_libs/ui/dialog"
import { Textarea } from "@/components/drake_libs/ui/textarea"
import { BookTemplate, Plus, Trash2, Calendar, Clock, CheckCircle } from "lucide-react"
import { ScheduleTemplate } from "../types/schedule.types"
import { getDayName, formatDuration, timeToMinutes } from "../utils/schedule.utils"

interface ScheduleTemplatesProps {
  templates: ScheduleTemplate[]
  onApplyTemplate: (template: ScheduleTemplate) => void
  onSaveTemplate: (template: Omit<ScheduleTemplate, "id">) => void
  onDeleteTemplate: (templateId: number) => void
}

export function ScheduleTemplates({
  templates,
  onApplyTemplate,
  onSaveTemplate,
  onDeleteTemplate,
}: ScheduleTemplatesProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    description: "",
  })

  const predefinedTemplates: Omit<ScheduleTemplate, "id">[] = [
    {
      name: "Morning Classes",
      description: "Monday to Friday, 8:00 AM - 12:00 PM",
      timeSlots: [
        { dayOfWeek: 1, startTime: "08:00", endTime: "10:00" },
        { dayOfWeek: 2, startTime: "08:00", endTime: "10:00" },
        { dayOfWeek: 3, startTime: "08:00", endTime: "10:00" },
        { dayOfWeek: 4, startTime: "08:00", endTime: "10:00" },
        { dayOfWeek: 5, startTime: "08:00", endTime: "10:00" },
      ],
    },
    {
      name: "Afternoon Classes",
      description: "Monday to Friday, 1:00 PM - 5:00 PM",
      timeSlots: [
        { dayOfWeek: 1, startTime: "13:00", endTime: "17:00" },
        { dayOfWeek: 2, startTime: "13:00", endTime: "17:00" },
        { dayOfWeek: 3, startTime: "13:00", endTime: "17:00" },
        { dayOfWeek: 4, startTime: "13:00", endTime: "17:00" },
        { dayOfWeek: 5, startTime: "13:00", endTime: "17:00" },
      ],
    },
    {
      name: "Evening Classes",
      description: "Monday, Wednesday, Friday, 6:00 PM - 9:00 PM",
      timeSlots: [
        { dayOfWeek: 1, startTime: "18:00", endTime: "21:00" },
        { dayOfWeek: 3, startTime: "18:00", endTime: "21:00" },
        { dayOfWeek: 5, startTime: "18:00", endTime: "21:00" },
      ],
    },
    {
      name: "Weekend Intensive",
      description: "Saturday and Sunday, 9:00 AM - 5:00 PM",
      timeSlots: [
        { dayOfWeek: 6, startTime: "09:00", endTime: "17:00" },
        { dayOfWeek: 0, startTime: "09:00", endTime: "17:00" },
      ],
    },
    {
      name: "Compact Schedule",
      description: "Tuesday and Thursday, 2-hour sessions",
      timeSlots: [
        { dayOfWeek: 2, startTime: "10:00", endTime: "12:00" },
        { dayOfWeek: 2, startTime: "14:00", endTime: "16:00" },
        { dayOfWeek: 4, startTime: "10:00", endTime: "12:00" },
        { dayOfWeek: 4, startTime: "14:00", endTime: "16:00" },
      ],
    },
  ]

  const handleCreateTemplate = () => {
    if (newTemplate.name.trim()) {
      onSaveTemplate({
        ...newTemplate,
        timeSlots: [],
      })
      setNewTemplate({ name: "", description: "" })
      setIsCreateOpen(false)
    }
  }

  const TemplateCard = ({ template }: { template: ScheduleTemplate | (Omit<ScheduleTemplate, "id"> & { id?: number }) }) => {
    const totalSessions = template.timeSlots.length
    const uniqueDays = new Set(template.timeSlots.map((s) => s.dayOfWeek)).size
    const totalHours = template.timeSlots.reduce(
      (sum, slot) => sum + (timeToMinutes(slot.endTime) - timeToMinutes(slot.startTime)),
      0
    ) / 60

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-base">{template.name}</CardTitle>
              <CardDescription className="text-xs mt-1">{template.description}</CardDescription>
            </div>
            <BookTemplate className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="outline" className="text-xs">
              <Calendar className="w-3 h-3 mr-1" />
              {totalSessions} session{totalSessions > 1 ? "s" : ""}
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Calendar className="w-3 h-3 mr-1" />
              {uniqueDays} day{uniqueDays > 1 ? "s" : ""}
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Clock className="w-3 h-3 mr-1" />
              {totalHours.toFixed(1)}h/week
            </Badge>
          </div>

          <ScrollArea className="h-24 mb-3">
            <div className="space-y-1 text-xs">
              {template.timeSlots.map((slot, index) => (
                <div key={index} className="flex items-center justify-between py-1">
                  <span className="font-medium">{getDayName(slot.dayOfWeek)}</span>
                  <span className="text-muted-foreground">
                    {slot.startTime} - {slot.endTime}
                  </span>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="flex gap-2">
            <Button
              size="sm"
              className="flex-1"
              onClick={() => onApplyTemplate(template as ScheduleTemplate)}
            >
              <CheckCircle className="w-3 h-3 mr-1" />
              Apply
            </Button>
            {template.id && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDeleteTemplate(template.id!)}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Schedule Templates</h3>
          <p className="text-sm text-muted-foreground">
            Quick start with pre-built or custom templates
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Create Template
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Schedule Template</DialogTitle>
              <DialogDescription>
                Save your current schedule configuration as a reusable template
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="template-name">Template Name</Label>
                <Input
                  id="template-name"
                  placeholder="e.g., My Custom Schedule"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="template-description">Description</Label>
                <Textarea
                  id="template-description"
                  placeholder="Describe when and how this template should be used"
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTemplate}>Save Template</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Predefined Templates */}
      <div>
        <h4 className="text-sm font-medium mb-3">Predefined Templates</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {predefinedTemplates.map((template, index) => (
            <TemplateCard key={`predefined-${index}`} template={template} />
          ))}
        </div>
      </div>

      {/* Custom Templates */}
      {templates.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-3">Your Templates</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
