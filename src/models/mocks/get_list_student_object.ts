import { FeedbackItem } from "../feedback-item";
import { FeedBackStatus, StudentObject } from "../student";

const ListStudentObjects = (): StudentObject[] => {
  return [
    {
      id: 1,
      grade: "Grade 5",
      name: "Nam22",
      feedback_status: "Good",
    },
    {
      id: 2,
      grade: "Grade 5",
      name: "Chi",
      feedback_status: "Good",
    },
    {
      id: 3,
      grade: "Grade 4",
      name: "Huyen",
      feedback_status: "Good",
    },
    {
      id: 44,
      grade: "Grade 5",
      name: "Manh Tung",
      feedback_status: "Good",
    },
    {
      id: 33,
      grade: "Grade 5",
      name: "huy Dat",
      feedback_status: "Not Good",
    },
    {
      id: 21,
      grade: "Grade 3",
      name: "Chi Nguyen",
      feedback_status: "Bad",
    },
    {
      id: 233,
      grade: "Grade 5",
      name: "Chi Nguyen",
    },
    {
      id: 121,
      grade: "Grade 5",
      name: "Chi2 Nguyen",
      feedback_status: "Bad",
    },
    {
      id: 212,
      grade: "Grade 5",
      name: "Chi Nguyen",
      feedback_status: "Bad",
    },
  ];
};

const getListStatus = (): FeedBackStatus[] => {
  return [
    {
      id: 1,
      status: "Good",
    },
    {
      id: 2,
      status: "Not Good",
    },
    {
      id: 3,
      status: "Bad",
    },
  ];
};

const fetchFeedbackStatus = (): FeedbackItem[] => {
  return [
    {
      id: 1,
      title: "Van Ha",
      message: "Van Ha is doing great in all his classes. Keep up the good work!",
      behavior: "No comment",
      grades: "Grade 5",
      feedback: "Good",
    },
    {
        id: 2,
        title: "Quang Huy",
        message: "Quang Huy is very lazy to do his homework. He needs to improve his behavior.",
        behavior: "No comment",
        grades: "Grade 4",
        feedback: "Bad",
      },
  ];
};

export { getListStatus, ListStudentObjects,fetchFeedbackStatus };
