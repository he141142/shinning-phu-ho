import { use, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/drake_libs/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/drake_libs/ui/select";
import { Badge } from "@/components/drake_libs/ui/badge";
import { Card } from "@/components/drake_libs/ui/card";
import CreateScheduleModal from "./components/CreateScheduleModal";
import { WeekRange, WeekRangeByYear } from "./libs/week-range";
import { UseFetch } from "@/components/hooks/fetch-data";
import {
  FilterScheduleRecordsResponse,
  GetFetchQuery,
} from "./libs/models/FilterScheduleRecords";
import { HOST } from "@/static/env";
import { useRouter } from "next/router";
import { createClassStore } from "./store/classStore";

import { ModalType, UseModal } from "@/components/hooks/useModal";
import { EventDetailsModal } from "./modals/eventModalPage";
import { motion } from "framer-motion";
import { GetClassDetail } from "@/components/drake_libs/customs/fetchs/classes/GetClassDetail";
import {
  calculateSlotPosition,
  generateTimeSlots,
  getWeekRanges,
  weekDays,
} from "./libs/helper";
import { useParams } from "next/navigation";
import {
  SessionItem,
  UseGetLatestSessionByClass,
  UseGetSessionsByGroup,
} from "@/hooks/api/external/session_service";
import { format } from "date-fns";
import { useGetClassById } from "@/hooks";
import { WeekRangeStore, weekRangeStore } from "./store/weekRangeStore";

export default function ClassCalendarPage() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const weekRangeStoreRef = useRef<WeekRangeStore>(weekRangeStore);

  const [currentWeek, setCurrentWeek] = useState<WeekRange>(
    weekRangeStoreRef.current.store.get(currentYear)!.getCurrentWeek()
  );
  const router = useRouter();
  const { class_info, setClassInfo } = createClassStore();
  const [selectedSlotID, setSelectedSlotID] = useState<number | null>(null);
  const params = useParams();
  const { closeModal, openModal, isOpen, modalType } = UseModal();
  const isOpenModal: boolean =
    isOpen && modalType === ModalType.VIEW_SCHEDULE_DETAIL;
  useEffect(() => {
    if (router.isReady && router.query.id) {
      setClassInfo({
        class_id: parseInt(router.query.id as string),
        class_name: "Computer Science 101",
        class_description: "This is a sample class for Computer Science 101",
      });
    }
  }, [currentYear, currentWeek, router.query.id, router.isReady]);
  const classID = params ? params["id"] : null;

  const {
    classDetail,
    error: classDetailError,
    loading: classDetailLoading,
  } = GetClassDetail(class_info.class_id);
  const {
    data: latestSessionData,
    error: latestSessionError,
    loading: latestSessionLoading,
  } = UseGetLatestSessionByClass(classID ? parseInt(classID as string) : -1);

  useEffect(() => {
    if (latestSessionData) {
      const sessionDate = new Date(latestSessionData.date);
      let weekRqangeStore = weekRangeStoreRef.current;
      weekRangeStore.addYear(sessionDate.getFullYear());
      setCurrentWeek(
        weekRqangeStore.store
          .get(sessionDate.getFullYear())!
          .getWeekRangeByDate(sessionDate)
      );
    }
  }, [latestSessionData, latestSessionError, latestSessionLoading]);

  const query =
    class_info.class_id !== 0
      ? GetFetchQuery({
          class_id: class_info.class_id,
          start_date: currentWeek.start,
          end_date: currentWeek.end,
        })
      : null;
  const { data: classData } = useGetClassById(
    classID ? parseInt(classID as string) : -1
  );
  const { data: sessionData } = UseGetSessionsByGroup({
    class_ids: classID ? [parseInt(classID as string)] : [],
    from: format(currentWeek.start, "yyyy-MM-dd"),
    to: format(currentWeek.end, "yyyy-MM-dd"),
  });
  const { data, error, loading } = UseFetch<FilterScheduleRecordsResponse>(
    `${HOST}/query`,
    query
  );
  let sessionhashMap = new Map<number, SessionItem>();
  if (sessionData && sessionData.data) {
    sessionhashMap =
      sessionData?.data.reduce((map, session) => {
        map.set(session?.id, session);
        return map;
      }, new Map<number, SessionItem>()) || new Map<number, SessionItem>();
  }

  if (!class_info.class_id || class_info.class_id === 0) {
    return <div>Loading...</div>;
  }

  if (classDetailLoading) return <div>Loading...</div>;
  if (classDetailError) return <div>Error: {classDetailError}</div>;

  if (loading) return <div>Loading...</div>;
  if (!class_info.class_id) {
    return <div>Loading...</div>;
  }

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
  };
  // Handle year change
  const handleYearChange = (value: string) => {
    setCurrentYear(Number.parseInt(value));
  };

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

  const transition = {
    duration: 0.8,
    delay: 0.3,
    ease: [0, 0.71, 0.2, 1.01],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="container mx-auto">
        {/* Modern Header with Gradient */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 mb-6">
          <div className="relative h-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>

            {/* Decorative Pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <pattern
                  id="calendar-grid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="white"
                    strokeWidth="1"
                  />
                </pattern>
                <rect width="100%" height="100%" fill="url(#calendar-grid)" />
              </svg>
            </div>

            {/* Header Content */}
            <div className="relative h-full flex items-center justify-between px-8">
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">
                  {classData?.GetClassById?.class_name || "Class Is Loading..."}
                </h1>
                <p className="text-white/90 text-sm">
                  Class Calendar & Schedule Management
                </p>
              </div>
              <CreateScheduleModal
                class_name={classDetail?.class_name || ""}
                class_id={classDetail?.class_id || 0}
              />
            </div>
          </div>
        </div>

        {/* Modern Controls Card */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={prevWeek}
                className="hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <EventDetailsModal
                isOpen={isOpenModal}
                // scheduleID={null}
                sesionDetail={
                  sessionhashMap.get(selectedSlotID as number) || null
                }
                onClose={closeModal}
              />

              <Select
                value={currentWeek.week.toString()}
                onValueChange={handleWeekChange}
              >
                <SelectTrigger className="w-[240px] border-gray-300">
                  <SelectValue placeholder="Select Week" />
                </SelectTrigger>
                <SelectContent>
                  {weeksRange.map((week) => (
                    <SelectItem key={week.week} value={week.week.toString()}>
                      Week {week.week} ({week.startString} - {week.endString})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={currentYear.toString()}
                onValueChange={handleYearChange}
              >
                <SelectTrigger className="w-[120px] border-gray-300">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => (
                    <SelectItem
                      key={i}
                      value={(currentYear - 5 + i).toString()}
                    >
                      {currentYear - 5 + i}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                onClick={nextWeek}
                className="hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <div className="flex items-center gap-2">
                <div className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-xs font-medium text-green-700">
                    Online
                  </span>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-xs font-medium text-blue-700">
                    Offline
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Calendar Grid */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-8 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            {/* Time column header */}
            <div className="p-4 font-semibold text-center border-r border-gray-200 bg-white">
              <div className="text-sm text-gray-600">Time</div>
            </div>

            {/* Day headers */}
            {weekDays.map((day, index) => (
              <div
                key={index}
                className="p-4 font-semibold text-center border-r last:border-r-0 border-gray-200"
              >
                <div className="text-sm text-gray-700">{day}</div>
              </div>
            ))}
          </div>

          {/* Time slots and schedule */}
          <div className="relative overflow-auto max-h-[700px]">
            <div className="grid grid-cols-8">
              {/* Time labels column */}
              <div className="border-r border-gray-200 bg-gray-50">
                {timeSlots.map((time, index) => (
                  <div
                    key={index}
                    className="h-[60px] border-b border-gray-200 last:border-b-0 p-2 text-sm font-medium text-gray-600 flex items-center justify-center"
                  >
                    {time}
                  </div>
                ))}
              </div>

              {/* Day columns */}
              {Array.from({ length: 7 }, (_, dayIndex) => (
                <div
                  key={dayIndex}
                  className="relative border-r last:border-r-0 border-gray-200 bg-white hover:bg-gray-50/50 transition-colors"
                >
                  {/* Time grid lines */}
                  {timeSlots.map((_, index) => (
                    <div
                      key={index}
                      className="h-[60px] border-b border-gray-100 last:border-b-0"
                    ></div>
                  ))}

                  {/* Class slots */}
                  {sessionData?.data?.map((slot) => {
                    const subject = "slot.subject";
                    const { top, height } = calculateSlotPosition(
                      slot.time_slot.start_time,
                      slot.time_slot.end_time
                    );

                    return (
                      <Card className="group cursor-pointer" key={slot.id}>
                        <motion.div
                          initial={{ opacity: 0.9, scale: 0.98 }}
                          whileHover={{ opacity: 1, scale: 1 }}
                          transition={transition}
                          className={`absolute w-[calc(100%-8px)] left-1 rounded-lg border-2 p-3 shadow-md hover:shadow-xl transition-all ${"bg-gray-100"} ${
                            // slot.status === "online"
                            //   ? "border-green-400 bg-gradient-to-br from-green-50 to-emerald-50"
                            //   : "border-blue-400 bg-gradient-to-br from-blue-50 to-cyan-50"
                            "border-green-400 bg-gradient-to-br from-green-50 to-emerald-50"
                          }`}
                          style={{
                            top: `${top}px`,
                            height: `${height}px`,
                          }}
                        >
                          <div className="flex flex-col h-full overflow-hidden">
                            <div className="flex items-center justify-between mb-2">
                              <Badge
                                variant="outline"
                                className={`text-xs font-semibold ${
                                  // slot.status === "online"
                                  //   ? "bg-green-500 text-white border-green-600"
                                  //   : "bg-blue-500 text-white border-blue-600"
                                  "border-green-400 bg-gradient-to-br from-green-50 to-emerald-50"
                                }`}
                              >
                                {"Online"}
                              </Badge>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                <Button
                                  onClick={() => {
                                    setSelectedSlotID(slot.id);
                                    openModal(ModalType.VIEW_SCHEDULE_DETAIL);
                                  }}
                                  size="sm"
                                  className="h-6 px-2 text-xs bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                                >
                                  View
                                </Button>
                                <Button
                                  onClick={() =>
                                    router.push(
                                      `/attendance/${class_info.class_id}/${slot.id}`
                                    )
                                  }
                                  size="sm"
                                  className="h-6 px-2 text-xs bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 gap-1"
                                >
                                  <ClipboardCheck className="w-3 h-3" />
                                  Attendance
                                </Button>
                              </div>
                            </div>

                            <div className="font-semibold text-sm truncate text-gray-800">
                              {"subject?.name"}
                            </div>
                            <div className="text-xs mt-auto text-gray-600 font-medium">
                              {slot.time_slot.start_time} -{" "}
                              {slot.time_slot.end_time}
                            </div>
                          </div>
                        </motion.div>
                      </Card>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
