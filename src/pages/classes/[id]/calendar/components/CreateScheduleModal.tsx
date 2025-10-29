"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/drake_libs/ui/button"
import { Input } from "@/components/drake_libs/ui/input"
import { Label } from "@/components/drake_libs/ui/label"
import { Textarea } from "@/components/drake_libs/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/drake_libs/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/drake_libs/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/drake_libs/ui/popover"
import { CalendarIcon, Clock, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar } from "@/components/drake_libs/ui/calendar"
import { UseFetchGetRooms } from "../modals/fetchRoomDetail"
import { UseListAllTeacher } from "@/components/drake_libs/customs/fetchs/teachers/ListAllTeacher"

type RecurrenceType = "Daily" | "Weekly" | "biweeBiWeekly" | "MonthLy" | "Quarterly"



interface ScheduleFormData {
  title: string
  description: string
  recurrence: RecurrenceType
  date: Date | undefined
  startTime: string
  endTime: string
  class: string
  room: string
  teacher_id: string
}

const classes = ["Math 101", "Physics 202", "Chemistry 303", "Biology 404", "Computer Science 505"]

export default function CreateScheduleModal(props: { class_id: number, class_name: string }) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<ScheduleFormData>({
    title: "",
    description: "",
    recurrence: "Daily",
    date: undefined,
    startTime: "",
    endTime: "",
    class: "",
    room: "",
    teacher_id: ""
  });

  const { error: roomsError, loading: roomsLoading, rooms } = UseFetchGetRooms();
  const { teachers, error: teachersError, loading: teachersLoading } = UseListAllTeacher(1, 1000);

  // Combine loading states
  if (roomsLoading || teachersLoading) {
    return <div>Loading...</div>;
  }

  // Combine error states
  if (roomsError || teachersError) {
    return <div>Error: {roomsError || teachersError}</div>;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  };



  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, date }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Schedule created:", formData)
    setOpen(false)
    // Here you would typically send the data to your backend
  }

  const isFormValid = () => {
    return (
      formData.title.trim() !== "" &&
      formData.date !== undefined &&
      formData.startTime !== "" &&
      formData.endTime !== "" &&
      // formData.class !== "" &&
      formData.room !== "" &&
      formData.teacher_id !== ""
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all">
          <Plus className="w-4 h-4 mr-2" />
          Create Schedule
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="border-b border-gray-200 pb-4">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Create Schedule For {props.class_name}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Fill in the details to create a new schedule. All fields marked with * are required.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-6">
            {/* Title Field */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-semibold text-gray-700 flex items-center">
                Title <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="e.g., Mathematics Lecture"
              />
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter schedule description (optional)"
                rows={3}
              />
            </div>
            {/* Recurrence Field */}
            <div className="space-y-2">
              <Label htmlFor="recurrence" className="text-sm font-semibold text-gray-700">
                Recurrence
              </Label>
              <Select
                value={formData.recurrence}
                onValueChange={(value) => handleSelectChange("recurrence", value as RecurrenceType)}
              >
                <SelectTrigger className="w-full border-gray-300 focus:border-indigo-500">
                  <SelectValue placeholder="Select recurrence" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily (One time)</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="biweekly">BiWeekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date and Time Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date Field */}
              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-semibold text-gray-700 flex items-center">
                  Date <span className="text-red-500 ml-1">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-gray-300 hover:border-indigo-500",
                        !formData.date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-indigo-600" />
                      {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={formData.date} onSelect={handleDateChange} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Time Slot Field */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center">
                  Time Slot <span className="text-red-500 ml-1">*</span>
                </Label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center flex-1 border border-gray-300 rounded-md px-3 py-2 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
                    <Clock className="mr-2 h-4 w-4 text-indigo-600" />
                    <Input
                      type="time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleInputChange}
                      className="border-0 p-0 focus:ring-0"
                    />
                  </div>
                  <span className="text-gray-500 font-medium">to</span>
                  <div className="flex items-center flex-1 border border-gray-300 rounded-md px-3 py-2 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
                    <Input
                      type="time"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleInputChange}
                      className="border-0 p-0 focus:ring-0"
                    />
                  </div>
                </div>
              </div>
            </div>
            {
              /*
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="class" className="text-right">
                    Class
                  </Label>
                  <Select value={formData.class} onValueChange={(value) => handleSelectChange("class", value)}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((className) => (
                        <SelectItem key={className} value={className}>
                          {className}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              */
            }
            {/* Room and Teacher Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Room Field */}
              {rooms && (
                <div className="space-y-2">
                  <Label htmlFor="room" className="text-sm font-semibold text-gray-700 flex items-center">
                    Room <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Select value={formData.room} onValueChange={(value) => handleSelectChange("room", value)}>
                    <SelectTrigger className="w-full border-gray-300 focus:border-indigo-500">
                      <SelectValue placeholder="Select a room" />
                    </SelectTrigger>
                    <SelectContent>
                      {rooms.map((room) => (
                        <SelectItem key={room.room_id} value={room.room_id.toString()}>
                          {room.room_number}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Teacher Field */}
              {teachers && (
                <div className="space-y-2">
                  <Label htmlFor="teacher_id" className="text-sm font-semibold text-gray-700 flex items-center">
                    Teacher <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Select value={formData.teacher_id} onValueChange={(value) => handleSelectChange("teacher_id", value)}>
                    <SelectTrigger className="w-full border-gray-300 focus:border-indigo-500">
                      <SelectValue placeholder="Select a teacher" />
                    </SelectTrigger>
                    <SelectContent>
                      {teachers.map((teacher) => (
                        <SelectItem key={teacher.teacher_id} value={teacher.teacher_id.toString()}>
                          {teacher.first_name} {teacher.last_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

          </div>
          <DialogFooter className="border-t border-gray-200 pt-6 flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid()}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Schedule
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

