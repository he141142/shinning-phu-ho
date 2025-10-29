
import { CardHeader, Card, CardTitle, CardContent } from "@/components/drake_libs/ui/card"
import { Center } from "@/models/students/GetStudentDetail/GetStudentDetail"
import { Input } from "@/components/drake_libs/ui/input"
import { Textarea } from "@/components/drake_libs/ui/textarea"

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
  isEditing?: boolean
  editedData?: Record<string, any>
  onFieldChange?: (field: string, value: string) => void
}


const isCenter = (center: any): center is Center => center?  (center as Center).center_id !== undefined: false;

const renderFn = (
  key: string,
  value: string | Center | undefined,
  isEditing: boolean = false,
  editedData?: Record<string, any>,
  onFieldChange?: (field: string, value: string) => void
): React.ReactNode => {
  const fieldLabel = key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  // Skip gender and center fields from rendering in the form
  if (key === 'gender' || key === 'center') {
    if (key === 'center' && isCenter(value)) {
      return (
        <div key={key} className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">{fieldLabel}</dt>
          <dd className="mt-1 text-sm text-gray-900">{value.center_name}</dd>
        </div>
      );
    }
    return null;
  }

  if (typeof value === "string") {
    return (
      <div key={key} className="sm:col-span-1">
        <dt className="text-sm font-medium text-gray-500">{fieldLabel}</dt>
        {isEditing ? (
          key === 'address' ? (
            <Textarea
              value={editedData?.[key] || value}
              onChange={(e) => onFieldChange?.(key, e.target.value)}
              className="mt-1"
              rows={3}
              placeholder={fieldLabel}
            />
          ) : key === 'dob' ? (
            <Input
              type="date"
              value={editedData?.[key] ? new Date(editedData[key]).toISOString().split('T')[0] : new Date(value).toISOString().split('T')[0]}
              onChange={(e) => onFieldChange?.(key, e.target.value)}
              className="mt-1"
            />
          ) : (
            <Input
              type={key.includes('email') ? 'email' : key.includes('phone') ? 'tel' : 'text'}
              value={editedData?.[key] || value}
              onChange={(e) => onFieldChange?.(key, e.target.value)}
              className="mt-1"
              placeholder={fieldLabel}
            />
          )
        ) : (
          <dd className="mt-1 text-sm text-gray-900">
            {key === 'dob' ? new Date(value).toLocaleDateString() : value}
          </dd>
        )}
      </div>
    );
  }

  return null;
}

export default function StudentProfile({ student, isEditing, editedData, onFieldChange }: StudentProfileProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Student Information" : "Student Information"}</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(student).map(([key, value]) => (
            renderFn(key, value, isEditing, editedData, onFieldChange)
          ))}
        </dl>
      </CardContent>
    </Card>
  )
}

