# Calendar Session Management - Features & Usage

## 🎯 Overview
A fully functional Google Calendar-style interface for managing class sessions with local state management (ready for API integration).

## ✅ Working Features

### 1. **Session Creation**
- Click any empty time slot in the calendar to create a session
- Click "Create" button in header
- Form pre-fills with selected date/time
- Sessions appear immediately on the calendar after creation
- Local state management (no API required yet)

### 2. **Three Calendar Views**

**Week View (Default)**
- 7-day grid with hourly time slots
- Sessions positioned by exact time
- Current time indicator (red line)
- Hover to see "Add" button on empty slots
- Color-coded by class

**Day View**
- Single day with larger time slots
- Better for detailed daily planning
- Shows more session information

**Month View**
- Full month grid
- Mini session cards on each day
- Click sessions to view details

### 3. **Session Management**

**View Details:**
- Click any session card
- Sidebar slides in from right
- Shows complete session information
- Date, time, class, notes, metadata

**Delete Sessions:**
- Click "Delete" in session detail sidebar
- Confirmation prompt
- Session removed from calendar immediately

**Edit Sessions:**
- Edit button ready (TODO: implement edit modal)

### 4. **Navigation**
- Previous/Next buttons (day/week/month)
- "Today" button to jump to current date
- View mode switcher (Day/Week/Month)
- Date range display updates automatically

### 5. **Interactive Features**
- Click-to-create on empty slots
- Session cards show topic, time, notes
- Hover effects and animations
- Smooth view transitions
- Color coding by class ID

## 📊 Data Structure

### Session Object
```typescript
{
  id: number,
  class_id: number,
  date: "YYYY-MM-DD",
  topic: string,
  notes: string,
  time_slot_id: number,
  time_slot: {
    id: number,
    slot_name: string,
    start_time: "YYYY-MM-DDTHH:mm:ss",
    end_time: "YYYY-MM-DDTHH:mm:ss",
    duration_mins: number
  }
}
```

## 🎨 Color Coding
- **Blue** - Class ID 1
- **Purple** - Class ID 2
- **Green** - Class ID 3
- **Orange** - Class ID 4
- **Pink** - Class ID 5

## 🔧 How It Works

### State Management
All sessions are stored in React state (`useState`):
- `sessions` - Array of all sessions
- `setSessions` - Update sessions array

### Creating Sessions
1. User clicks time slot or "Create" button
2. Modal opens with form
3. User fills in details
4. `handleCreateSession` adds to state
5. Calendar re-renders with new session

### Deleting Sessions
1. User opens session detail
2. Clicks "Delete" button
3. Confirms deletion
4. `handleDeleteSession` removes from state
5. Calendar updates immediately

### Current Implementation
- ✅ Create sessions (working)
- ✅ Delete sessions (working)
- ✅ View sessions (working)
- ⏳ Edit sessions (button ready, modal TODO)
- ⏳ API integration (ready for GraphQL)

## 🚀 Next Steps for API Integration

### 1. Replace Mock Data
```typescript
// Current: useState with mock data
const [sessions, setSessions] = useState<Session[]>(initialSessions);

// Future: Fetch from API
const { data: sessions, loading } = useQuery(GET_SESSIONS);
```

### 2. Add Mutations
```typescript
// Create
const [createSession] = useMutation(CREATE_SESSION);

// Update
const [updateSession] = useMutation(UPDATE_SESSION);

// Delete
const [deleteSession] = useMutation(DELETE_SESSION);
```

### 3. Update Handlers
```typescript
const handleCreateSession = async (newSession) => {
  await createSession({ variables: newSession });
  // Refetch or update cache
};
```

## 📍 File Locations

```
src/pages/calendar-sessions/
├── index.tsx                          # Main calendar page
└── components/
    ├── WeekView.tsx                   # Week grid view
    ├── DayView.tsx                    # Day view
    ├── MonthView.tsx                  # Month view
    ├── CreateSessionFromCalendar.tsx  # Create modal
    └── SessionDetailSidebar.tsx       # Detail sidebar
```

## 💡 Usage Tips

### Creating a Session
1. Navigate to desired date
2. Click on time slot (e.g., 2:00 PM)
3. Fill in:
   - Session Title
   - Class
   - Date (pre-filled)
   - Time Slot (pre-filled if clicked)
   - Description (optional)
4. Click "Create Session"
5. Session appears on calendar immediately

### Viewing Session Details
1. Click any session card
2. Sidebar opens from right
3. View all information
4. Use quick actions
5. Click X or outside to close

### Navigating Calendar
- **Previous/Next**: Navigate by day/week/month
- **Today**: Jump to current date
- **View Tabs**: Switch between Day/Week/Month
- **Search**: Find sessions by topic (TODO)

## 🎯 Features Ready for Enhancement

1. **Drag & Drop**: Move sessions to different times
2. **Recurring Sessions**: Create repeating sessions
3. **Conflict Detection**: Warn about overlapping sessions
4. **Filters**: Filter by class, status, etc.
5. **Export**: Download as ICS/PDF
6. **Notifications**: Upcoming session reminders
7. **Attendance**: Link to attendance tracking
8. **Materials**: Attach files to sessions

## 🔥 Current Status

**Fully Functional:**
✅ Create sessions
✅ View sessions in 3 modes
✅ Delete sessions
✅ Local state management
✅ Animations & interactions
✅ Responsive design
✅ Current time indicator
✅ Color coding

**Ready for API:**
- All handlers accept/return proper data structures
- Easy to swap useState for GraphQL queries
- Type-safe interfaces already defined
