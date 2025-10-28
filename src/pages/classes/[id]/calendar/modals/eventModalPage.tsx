import { Badge } from "@/components/drake_libs/ui/badge";
import { Button } from "@/components/drake_libs/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/drake_libs/ui/alert-dialog";
import { Separator } from "@/components/drake_libs/ui/separator";
import { format } from "date-fns";
import { Calendar, Clock, Edit, MapPin, Trash2, Users } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/drake_libs/ui/dialog";


import { cn } from "@/lib/utils";
import { useCalendarStore } from "@/pages/calendar/components/store/store";
import { UseFetchScheduleDetail } from "./fetchScheduleDetail";

export interface EventDetailsModalProps {
  scheduleID: number ;
  onClose: () => void;
  isOpen: boolean;
}
export function EventDetailsModal({ scheduleID, onClose, isOpen }: EventDetailsModalProps) {
  // const { events, deleteEvent } = useCalendarStore();
  // const event = events.find((e) => e.id === eventId);

  if (scheduleID === 0 ){
    return <div>Event not found</div>;
  }

  const {
    schedule ,
    error,
    loading,
  } = UseFetchScheduleDetail(scheduleID);

  const event = schedule?.GetScheduleDetail;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!event) {
    return <div>Event not found</div>;
  }

  const handleDelete = () => {
    // deleteEvent(eventId)
    onClose()
  }

  const featureColor = (feature: string) => {
    switch (feature) {
      case "projector":
        return "bg-blue-100 text-blue-800"
      case "whiteboard":
        return "bg-green-100 text-green-800"
      case "tv":
        return "bg-purple-100 text-purple-800"
      case "monitor":
        return "bg-yellow-100 text-yellow-800"
      case "speaker":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {
              event.room && event.room.features.map((feature) => (
                <Badge key={feature} className={cn(featureColor(feature))}>
                  {feature}
                </Badge>
              ))
            }
            {/* <Badge
              className={cn(
                event.type === "meeting" && "bg-blue-100 text-blue-800 hover:bg-blue-100",
                event.type === "class" && "bg-green-100 text-green-800 hover:bg-green-100",
                event.type === "workshop" && "bg-purple-100 text-purple-800 hover:bg-purple-100",
                event.type === "other" && "bg-gray-100 text-gray-800 hover:bg-gray-100",
              )}
            >
              {event.type}
            </Badge> */}
            <DialogTitle className="text-xl">{event.title}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {event.room && event.room.availability_note && (
            <div>
              <p className="text-sm text-muted-foreground">{event.room.availability_note}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            
            <div className="space-y-1">
              <div className="text-sm font-medium">Date</div>
              <div className="flex items-center text-sm">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                {format(new Date(event.date), "EEEE, MMMM d, yyyy")}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm font-medium">Time</div>
              <div className="flex items-center text-sm">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                {format(new Date(`1970-01-01T${event.start_time}:00`), "h:mm a")} - {format(new Date(`1970-01-01T${event.end_time}:00`), "h:mm a")}
              </div>
            </div>

          </div>

          <Separator />
          {
            event.room && (
              <div className="space-y-2">
              <div className="text-sm font-medium">Room</div>
              <div className="rounded-md border p-3 space-y-2">
                <div className="font-medium">{event.room.room_number}</div>
                <div className="text-sm text-muted-foreground">{event.room.center.center_name}</div>
                <div className="flex items-center text-sm">
                  <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                  {event.room.center.address}
                </div>
                <div className="flex items-center text-sm">
                  <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                  Capacity: {event.room.capacity} people
                </div>
              </div>
            </div>
            )
          }
         


        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="gap-1">
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the event.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button variant="outline" className="gap-1">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

