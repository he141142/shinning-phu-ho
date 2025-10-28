
import { CardHeader, Card, CardTitle, CardContent } from "@/components/drake_libs/ui/card"
import { Center } from "@/models/students/GetStudentDetail/GetStudentDetail"

export type StudentProfileProps = {
  student: {
    first_name: string
    last_name: string
    email: string
    dob: string
    phone: string
    address: string
    emergency_contact_name: string
    emergency_contact_phone: string
    gender: string
    center: Center | undefined
  }
}


const isCenter = (center: any): center is Center => center?  (center as Center).center_id !== undefined: false;

const renderFn = (key: string, value: string | Center | undefined): React.ReactNode => {
  return (
    <>
      {
        key === 'center' || typeof value != "string" ?
          (isCenter(value)) ?
            <>
              <div key={key} cxlassName="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">
                  {key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{value.center_name}</dd>
              </div>
            </> : <>

            </>
          :
          <div key={key} className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">
              {key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </dt>
            <dd className="mt-1 text-sm text-gray-900">{value}</dd>
          </div>
      }
    </>
  );
}

export default function StudentProfile({ student }: StudentProfileProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Information</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(student).map(([key, value]) => (
            renderFn(key, value)
          ))}
        </dl>
      </CardContent>
    </Card>
  )
}

