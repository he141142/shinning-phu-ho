import { CheckCircleIcon } from "lucide-react";


const TickToast = (msg: string): React.ReactNode => (
  <div className="flex items-center">
    <CheckCircleIcon className="text-green-500 mr-2 h-6 w-6 animate-bounce" />
    <span> {msg}</span>
  </div>
);


const FailToast = (error: string): React.ReactNode => (
  <div className="flex items-center">
    <CheckCircleIcon className="text-red-500 mr-2 h-6 w-6 animate-pulse" />
    <span>  {error} </span>
  </div>
);

const RenderSuccessToast = (msg: string) => {
  return {
    title: "Success",
    description: TickToast(msg),
    duration: 5000,
  }
};

const RenderFailedToast = (error: string) => {

  return {
    title: "Failed",
    description: FailToast(error),
    duration: 5000,
  }
};


export {
  RenderSuccessToast,
  RenderFailedToast,
  TickToast,
  FailToast
}