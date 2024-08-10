type FeedbackItem = {
  id: number;
  title: string;
  message: string;
  behavior: string;
  grades: string;
  feedback: string;
};

const ToColor = (feedback: string): string => {
  let mappFeedbackStatus: { [key: string]: string } = {
    Good: "border-green-500",
    Bad: "border-red-500",
    "Not Good": "border-yellow-500",
  };

  return mappFeedbackStatus[feedback] || "border-gray-400";
};

export { type FeedbackItem, ToColor };
