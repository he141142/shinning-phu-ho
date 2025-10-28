import { Schedule } from "@mui/icons-material";
import { ClassProp } from "../../store/classStore";
import { FilterScheduleRecordsResponse } from "./FilterScheduleRecords";

export interface ClassScheduleModel {
  id: number;
  name: string;
  subjects: Subject[];
  schedules: Schedule[];
}

export interface Subject {
  id: string;
  name: string;
  color: string;
}

export interface Schedule {
  id: number;
  startTime: string;
  endTime: string;
  date: string;
  title: string;
  status: string;
  subject?: Subject;
  dayNumber: number;
}

const pickRandSubject = (): Subject => {
  let subjectContainer = [
    {
      id: "sub-1",
      name: "Programming Basics",
      color: "bg-blue-100 border-blue-300",
    },
    {
      id: "sub-2",
      name: "Data Structures",
      color: "bg-green-100 border-green-300",
    },
    {
      id: "sub-3",
      name: "Algorithms",
      color: "bg-purple-100 border-purple-300",
    },
    {
      id: "sub-4",
      name: "Web Development",
      color: "bg-amber-100 border-amber-300",
    },
  ];

  let randSubject =
    subjectContainer[Math.floor(Math.random() * subjectContainer.length)];

  return randSubject;
};

export const TransformToInnerModel = (
  data: FilterScheduleRecordsResponse,
  classInfo: ClassProp
): ClassScheduleModel => {
  let schedules: Schedule[] = data?.FilterScheduleRecords.map((record) => {
    return {
      id: record.id,
      startTime: record.start_time,
      endTime: record.end_time,
      date: record.date,
      title: record.title,
      status: record.day_of_week === 0 ? "Offline" : "Online",
      subject: pickRandSubject(),
      dayNumber: record.day_of_week,
    };
  });

  return {
    id: classInfo.class_id,
    name: classInfo.class_name,
    subjects: [
      {
        id: "sub-1",
        name: "Programming Basics",
        color: "bg-blue-100 border-blue-300",
      },
      {
        id: "sub-2",
        name: "Data Structures",
        color: "bg-green-100 border-green-300",
      },
      {
        id: "sub-3",
        name: "Algorithms",
        color: "bg-purple-100 border-purple-300",
      },
      {
        id: "sub-4",
        name: "Web Development",
        color: "bg-amber-100 border-amber-300",
      },
    ],
    schedules: schedules,
  };
};
