import { format } from "date-fns"
import { Calendar, Clock, MapPin, Users, Trash2, Edit } from "lucide-react"

import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/drake_libs/ui/dialog"
import { Badge } from "@/components/drake_libs/ui/badge"
import { Separator } from "@/components/drake_libs/ui/separator"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/drake_libs/ui/alert-dialog"
import { Button } from "@/components/drake_libs/ui/button"
import { useCalendarStore } from "./store/store"

 interface EventDetailsModalProps {
  eventId: string
  onClose: () => void
}

export function EventDetailsModal({ eventId, onClose }: EventDetailsModalProps) {
  const { events, deleteEvent } = useCalendarStore()
  const event = events.find((e) => e.id === eventId)

  if (!event) {
    return null
  }

  const handleDelete = () => {
    deleteEvent(eventId)
    onClose()
  }

  return (
    <Dialog open={!!event} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Badge
              className={cn(
                event.type === "meeting" && "bg-blue-100 text-blue-800 hover:bg-blue-100",
                event.type === "class" && "bg-green-100 text-green-800 hover:bg-green-100",
                event.type === "workshop" && "bg-purple-100 text-purple-800 hover:bg-purple-100",
                event.type === "other" && "bg-gray-100 text-gray-800 hover:bg-gray-100",
              )}
            >
              {event.type}
            </Badge>
            <DialogTitle className="text-xl">{event.title}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {event.description && (
            <div>
              <p className="text-sm text-muted-foreground">{event.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-sm font-medium">Date</div>
              <div className="flex items-center text-sm">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                {format(new Date(event.startTime), "EEEE, MMMM d, yyyy")}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm font-medium">Time</div>
              <div className="flex items-center text-sm">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                {format(new Date(event.startTime), "h:mm a")} - {format(new Date(event.endTime), "h:mm a")}
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="text-sm font-medium">Room</div>
            <div className="rounded-md border p-3 space-y-2">
              <div className="font-medium">{event.room.name}</div>
              <div className="text-sm text-muted-foreground">{event.room.description}</div>
              <div className="flex items-center text-sm">
                <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                {event.room.location}
              </div>
              <div className="flex items-center text-sm">
                <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                Capacity: {event.room.capacity} people
              </div>
            </div>
          </div>
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

