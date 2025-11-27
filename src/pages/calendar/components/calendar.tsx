import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"

interface CalendarGroup {
  name: string
  items: string[]
}

interface CalendarsProps {
  calendars: CalendarGroup[]
}

export function Calendars({ calendars }: CalendarsProps) {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(calendars.map((c) => c.name))

  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prev) =>
      prev.includes(groupName) ? prev.filter((name) => name !== groupName) : [...prev, groupName],
    )
  }

  return (
    <div className="px-4 py-2">
      <h3 className="mb-2 font-medium">Calendars</h3>
      <div className="space-y-1">
        {calendars.map((group) => (
          <div key={group.name} className="space-y-1">
            <button
              className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
              onClick={() => toggleGroup(group.name)}
            >
              <span>{group.name}</span>
              {expandedGroups.includes(group.name) ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>

            {expandedGroups.includes(group.name) && (
              <div className="ml-4 space-y-1">
                {group.items.map((item) => (
                  <div
                    key={item}
                    className="flex items-center rounded-md px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
                  >
                    <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

