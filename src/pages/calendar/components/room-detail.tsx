import { Badge } from "@/components/drake_libs/ui/badge"
import { Separator } from "@/components/drake_libs/ui/separator"
import { Users, Wifi, Monitor, Video, Mic, Coffee, Accessibility, Clock } from "lucide-react"
import { Room } from "./libs/type"

interface RoomDetailsProps {
  room: Room
}

export function RoomDetails({ room }: RoomDetailsProps) {
  return (
    <div className="space-y-6 pt-4">
      <div>
        <h3 className="text-lg font-medium">{room.name}</h3>
        <p className="text-sm text-muted-foreground">{room.description}</p>
      </div>

      <Separator />

      <div className="space-y-2">
        <h4 className="font-medium">Capacity</h4>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>{room.capacity} people</span>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium">Features</h4>
        <div className="flex flex-wrap gap-2">
          {room.features.map((feature, index) => (
            <Badge key={index} variant="outline" className="flex items-center gap-1">
              {feature === "wifi" && <Wifi className="h-3 w-3" />}
              {feature === "projector" && <Monitor className="h-3 w-3" />}
              {feature === "videoconference" && <Video className="h-3 w-3" />}
              {feature === "microphone" && <Mic className="h-3 w-3" />}
              {feature === "refreshments" && <Coffee className="h-3 w-3" />}
              {feature === "accessibility" && <Accessibility className="h-3 w-3" />}
              {feature}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium">Availability</h4>
        <div className="text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>
              {room.availableFrom} - {room.availableTo}
            </span>
          </div>
          <p className="mt-1 text-muted-foreground">{room.availabilityNotes}</p>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium">Location</h4>
        <p className="text-sm">{room.location}</p>
      </div>
    </div>
  )
}

