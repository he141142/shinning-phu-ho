"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/drake_libs/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/drake_libs/ui/select"
import { Badge } from "@/components/drake_libs/ui/badge"
import { Card } from "@/components/drake_libs/ui/card"
import CreateScheduleModal from "./components/CreateScheduleModal";
import { WeekRange, WeekRangeByYear } from "./libs/week-range"
import { UseFetch } from "@/components/hooks/fetch-data"
import { FilterScheduleRecordsResponse, GetFetchQuery } from "./libs/models/FilterScheduleRecords"
import { HOST } from "@/static/env"
import { format } from "date-fns";
import { useRouter } from "next/router"
import { createClassStore } from "./store/classStore"
import { ClassScheduleModel, TransformToInnerModel } from "./libs/models/innerModel"
import { ModalType, UseModal } from "@/components/hooks/useModal"
import { EventDetailsModal } from "./modals/eventModalPage"
import { BrunchDiningTwoTone } from "@mui/icons-material";
import { motion } from "framer-motion"
import { GetClassDetail, getClassDetailQuery, sykrosFetchData } from "@/components/drake_libs/customs/fetchs/classes/GetClassDetail"

// Sample data for a specific class
// const classData = {
//   id: "class-101",
//   name: "Computer Science 101",
//   subjects: [
//     { id: "sub-1", name: "Programming Basics", color: "bg-blue-100 border-blue-300" },
//     { id: "sub-2", name: "Data Structures", color: "bg-green-100 border-green-300" },
//     { id: "sub-3", name: "Algorithms", color: "bg-purple-100 border-purple-300" },
//     { id: "sub-4", name: "Web Development", color: "bg-amber-100 border-amber-300" },
//   ],
//   schedule: [
//     {
//       id: "slot-1",
//       day: 1, // Monday
//       startTime: "07:30",
//       endTime: "10:30",
//       subject: "sub-1",
//       status: "online",
//     },
//     // {
//     //   id: "slot-2",
//     //   day: 2, // Tuesday
//     //   startTime: "13:00",
//     //   endTime: "15:00",
//     //   subject: "sub-2",
//     //   status: "offline",
//     // },
//     // {
//     //   id: "slot-3",
//     //   day: 3, // Wednesday
//     //   startTime: "09:00",
//     //   endTime: "11:00",
//     //   subject: "sub-1",
//     //   status: "online",
//     // },
//     // {
//     //   id: "slot-4",
//     //   day: 4, // Thursday
//     //   startTime: "16:30",
//     //   endTime: "19:30",
//     //   subject: "sub-3",
//     //   status: "offline",
//     // },
//     // {
//     //   id: "slot-5",
//     //   day: 5, // Friday
//     //   startTime: "08:00",
//     //   endTime: "10:00",
//     //   subject: "sub-4",
//     //   status: "online",
//     // },
//     {
//       id: "slot-6",
//       day: 6, // Saturday
//       startTime: "14:00",
//       endTime: "17:00",
//       subject: "sub-2",
//       status: "offline",
//     },
//   ],
// }

// Helper function to convert time string to minutes
const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 60 + minutes
}

// Helper function to calculate position and height for a time slot
const calculateSlotPosition = (startTime: string, endTime: string) => {
  const dayStart = timeToMinutes("07:00") // 7:00 AM
  const startMinutes = timeToMinutes(startTime) - dayStart
  const endMinutes = timeToMinutes(endTime) - dayStart
  const duration = endMinutes - startMinutes

  // Each hour is 60px in height
  const topPosition = (startMinutes / 60) * 60
  const height = (duration / 60) * 60

  return { top: topPosition, height }
}


function getWeekRanges(year: number) {
  let date = new Date(year, 0, 1);

  // Find the first Monday of the year
  while (date.getDay() !== 1) {
    date.setDate(date.getDate() + 1);
  }

  const weeks: WeekRange[] = [];
  let weekNumber = 1;
  while (date.getFullYear() === year) {
    let startDate = new Date(date);
    date.setDate(date.getDate() + 6);
    let endDate = new Date(date);

    weeks.push({
      week: weekNumber++,
      startString: startDate.toLocaleDateString("en-GB"), // Format as DD/MM/YYYY
      endString: endDate.toLocaleDateString("en-GB"),
      start: startDate,
      end: endDate,
    });

    // Move to the next week
    date.setDate(date.getDate() + 1);
  }

  return weeks;
}


// Generate time slots from 7:00 to 23:00
const generateTimeSlots = () => {
  const slots = []
  for (let hour = 7; hour < 23; hour++) {
    slots.push(`${hour.toString().padStart(2, "0")}:00`)
  }
  return slots
}

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const UseFetchClassHook = () => {
  const router = useRouter();


}

export default function ClassCalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  let weekRangeByYear = new WeekRangeByYear(currentYear);
  weekRangeByYear.load();
  const [currentWeek, setCurrentWeek] = useState<WeekRange>(weekRangeByYear.getCurrentWeek());
  const router = useRouter();
  const { class_info, setClassInfo } = createClassStore();

  const [selectedSlotID, setSelectedSlotID] = useState<number | null>(null);

  const {
    closeModal,
    openModal,
    isOpen,
    modalType
  } = UseModal();

  const isOpenModal: boolean = isOpen && modalType === ModalType.VIEW_SCHEDULE_DETAIL;


  useEffect(() => {
    if (router.isReady && router.query.id) {
      setClassInfo({
        class_id: parseInt(router.query.id as string),
        class_name: "Computer Science 101",
        class_description: "This is a sample class for Computer Science 101",
      });

    }
  }, [currentMonth, currentYear, currentWeek, router.query.id, router.isReady]);

  const {classDetail, error:classDetailLoading, loading:classDetailError} = GetClassDetail(class_info.class_id);
  const query = class_info.class_id !== 0
    ? GetFetchQuery({
      class_id: class_info.class_id,
      start_date: currentWeek.start,
      end_date: currentWeek.end,
    })
    : null;


  const { data, error, loading } = UseFetch<FilterScheduleRecordsResponse>(`${HOST}/query`, query);

  if (!class_info.class_id || class_info.class_id === 0) {
    return <div>Loading...</div>
  }


  if (classDetailLoading) return <div>Loading...</div>
  if (classDetailError) return <div>Error: {classDetailError}</div>



  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!class_info.class_id) {
    return <div>Loading...</div>
  }




  const classData: ClassScheduleModel = (data) ? TransformToInnerModel(data, class_info) : {
    schedules: [],
    subjects: [],
    id: 0,
    name: ""
  };

  const timeSlots = generateTimeSlots();
  const weeksRange = getWeekRanges(currentYear);

  const handleWeekChange = (weekStr: string) => {
    let weekMap = getWeekInstanceByWeek();
    setCurrentWeek(weekMap.get(weekStr) as WeekRange);
  };
  const getWeekInstanceByWeek = (): Map<string, WeekRange> => {
    let weekMap = new Map<string, WeekRange>();
    weeksRange.forEach((week) => {
      weekMap.set(week.week.toString(), week);
    });
    return weekMap;
  }
  // Handle year change
  const handleYearChange = (value: string) => {
    setCurrentYear(Number.parseInt(value))
  }


  const prevWeek = () => {
    let weekMap = getWeekInstanceByWeek();
    let prevWeek = weekMap.get((currentWeek.week - 1).toString());
    if (prevWeek) {
      setCurrentWeek(prevWeek);
    }
  };

  const nextWeek = () => {
    let weekMap = getWeekInstanceByWeek();
    let nextWeek = weekMap.get((currentWeek.week + 1).toString());
    if (nextWeek) {
      setCurrentWeek(nextWeek);
    }
  };

  // Previous month
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  // Next month
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  };

  const transition = {
    duration: 0.8,
    delay: 0.3,
    ease: [0, 0.71, 0.2, 1.01],
  }


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">{classData.name} - Calendar</h1>
      <CreateScheduleModal class_name={classDetail?.class_name || ""} class_id={classDetail?.class_id || 0} />

      {/* Month and Year Filter */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={prevWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {/* {selectedEventId && <EventDetailsModal eventId={selectedEventId} onClose={() => setSelectedEventId(null)} />} */}
          <EventDetailsModal isOpen={isOpenModal} scheduleID={selectedSlotID || 0} onClose={closeModal} />
          <Select value={currentWeek.week.toString()} onValueChange={handleWeekChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {weeksRange.map((week) => (
                <SelectItem key={week.week} value={week.week.toString()}>
                  Week {week.week} ({week.startString} - {week.endString})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>


          <Select value={currentYear.toString()} onValueChange={handleYearChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 10 }, (_, i) => (
                <SelectItem key={i} value={(currentYear - 5 + i).toString()}>
                  {currentYear - 5 + i}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" onClick={nextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <div className="flex items-center gap-1">
            <Badge variant="outline" className="bg-green-100 text-green-800">
              Online
            </Badge>
            <Badge variant="outline" className="bg-blue-100 text-blue-800">
              Offline
            </Badge>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="border rounded-lg overflow-auto">
        <div className="grid grid-cols-8 border-b">
          {/* Time column header */}
          <div className="p-2 font-medium text-center border-r">Time</div>

          {/* Day headers */}
          {weekDays.map((day, index) => (
            <div key={index} className="p-2 font-medium text-center border-r last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        {/* Time slots and schedule */}
        <div className="relative">
          <div className="grid grid-cols-8">
            {/* Time labels column */}
            <div className="border-r">
              {timeSlots.map((time, index) => (
                <div key={index} className="h-[60px] border-b last:border-b-0 p-2 text-sm">
                  {time}
                </div>
              ))}
            </div>

            {/* Day columns */}
            {Array.from({ length: 7 }, (_, dayIndex) => (
              <div key={dayIndex} className="relative border-r last:border-r-0">
                {/* Time grid lines */}
                {timeSlots.map((_, index) => (
                  <div key={index} className="h-[60px] border-b last:border-b-0"></div>
                ))}

                {/* Class slots */}
                {classData.schedules
                  .filter((slot) => slot.dayNumber === dayIndex + 1)
                  .map((slot) => {
                    if (!slot.subject) {
                      return null;
                    }
                    const subject = slot.subject;
                    const { top, height } = calculateSlotPosition(slot.startTime, slot.endTime);

                    return (
                      <>

                        <Card
                          className="group"
                          key={slot.id}

                        >
                          <motion.div
                            initial={{ opacity: 0.7 }}
                            whileHover={{ opacity: 1 }}
                            transition={transition}
                            className={` absolute w-[calc(100%-8px)] left-1 rounded-md border p-2 ${subject?.color || ""
                              } ${slot.status === "online" ? "border-green-500" : "border-blue-500"} `}
                            style={{
                              top: `${top}px`,
                              height: `${height}px`,
                            }}
                          >
                            <div className="flex flex-col h-full overflow-hidden">
                              <div>
                                <Badge
                                  variant="outline"
                                  className={`mb-1 w-fit text-xs ${slot.status === "online" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                                    }`}

                                >
                                  {slot.status}
                                </Badge>
                                <Button onClick={() => {
                                  setSelectedSlotID(slot.id);
                                  openModal(ModalType.VIEW_SCHEDULE_DETAIL);

                                }} className="opacity-0 group-hover:opacity-100 w-10 h-2" >View </Button>
                              </div>

                              <div className="font-medium text-xs truncate">{subject?.name}</div>
                              <div className="text-xs mt-auto">
                                {slot.startTime} - {slot.endTime}
                              </div>
                            </div>

                          </motion.div>
                        </Card>
                      </>
                    )
                  })}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

