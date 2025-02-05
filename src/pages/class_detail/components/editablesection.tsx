import { Button } from "@/components/drake_libs/ui/button"
import { useState, type ReactNode } from "react"

interface EditableSectionProps {
  title: string
  onSave: () => void
  children: (isEditing: boolean) => ReactNode
}

export default function EditableSection({ title, onSave, children }: EditableSectionProps) {
  const [isEditing, setIsEditing] = useState(false)

  const handleSave = () => {
    onSave()
    setIsEditing(false)
  }

  return (
    <div className="mb-6 p-4 border rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        {isEditing ? (
          <div>
            <Button onClick={() => setIsEditing(false)} variant="outline" className="mr-2">
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        ) : (
          <Button onClick={() => setIsEditing(true)}>Edit</Button>
        )}
      </div>
      {children(isEditing)}
    </div>
  )
}

