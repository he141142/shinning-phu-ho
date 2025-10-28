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
import { CalendarIcon, Clock } from "lucide-react"
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
        <Button>Create Schedule</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Schedule For {props.class_name}</DialogTitle>
            <DialogDescription>Fill in the details to create a new schedule.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Enter schedule title"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Enter schedule description"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="recurrence" className="text-right">
                Recurrence
              </Label>
              <Select
                value={formData.recurrence}
                onValueChange={(value) => handleSelectChange("recurrence", value as RecurrenceType)}
              >
                <SelectTrigger className="col-span-3">
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={formData.date} onSelect={handleDateChange} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Time Slot</Label>
              <div className="col-span-3 flex items-center gap-2">
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className="w-[120px]"
                  />
                </div>
                <span>to</span>
                <Input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className="w-[120px]"
                />
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
            {
              rooms && <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="room" className="text-right">
                  Room
                </Label>
                <Select value={formData.room} onValueChange={(value) => handleSelectChange("room", value)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select Room" />
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
            }

            {
              teachers && <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="teacher_id" className="text-right">
                  Teacher
                </Label>
                <Select value={formData.teacher_id} onValueChange={(value) => handleSelectChange("teacher_id", value)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select Teacher" />
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
            }

          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isFormValid()}>
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

