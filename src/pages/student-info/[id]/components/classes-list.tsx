import { CardHeader, Card, CardTitle, CardContent } from "@/components/drake_libs/ui/card"
import { GetClassByIdResponse } from "@/models/class/class.detail"

type Class = {
  class_id: number
  class_name: string
  description: string
  teacher_id: number | null
  start_date: string | null
  end_date: string | null
  max_students: number
  current_enrollment: number
  room_number: string | null
  schedule: string
}

export type ClassesListProps = {
  classes: Exclude<
      GetClassByIdResponse,
      | "students"
      | "class_config"
      | "teacher"
      | "grade"
      | "current_semester"
      | "start_date">[];
}

export default function ClassesList({ classes }: ClassesListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {classes.map((classItem) => (
        <Card key={classItem.class_id}>
          <CardHeader>
            <CardTitle>{classItem.class_name}</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900">{classItem.description || "N/A"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Schedule</dt>
                <dd className="mt-1 text-sm text-gray-900">{"N/A"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Enrollment</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {/* {classItem.current_enrollment} / {classItem.max_students} */}
                  {classItem?.students?.length || 0} / {classItem.max_students}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Room</dt>
                <dd className="mt-1 text-sm text-gray-900">{classItem.room?.room_number || "N/A"}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

