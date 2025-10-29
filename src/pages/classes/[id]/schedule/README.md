# Class Schedule Management System

A powerful and intelligent schedule management system for class scheduling with advanced features including conflict detection, optimization suggestions, recurring schedules, and template management.

## 🎯 Features

### 1. **Visual Time Slot Picker**
- Interactive grid-based time slot selection
- Quick duration buttons (30min, 1h, 1.5h, 2h, 3h)
- AI-powered suggested time slots based on existing schedules
- Visual indicators for occupied, selected, and suggested slots
- Click-to-select interface with real-time feedback

### 2. **Intelligent Conflict Detection**
- Real-time conflict detection for:
  - Room conflicts (same room, same time)
  - Teacher conflicts (same teacher, same time)
  - Time overlaps
- Visual conflict alerts with detailed information
- Suggested resolutions for each conflict type

### 3. **Advanced Recurring Schedules**
- Flexible recurrence patterns:
  - One-time
  - Daily
  - Weekly (select specific days)
  - Bi-weekly (every 2 weeks)
  - Monthly
  - Custom intervals
- Multiple end conditions:
  - Never
  - On specific date
  - After N occurrences
- Visual recurrence summary

### 4. **Schedule Templates**
- **Predefined Templates:**
  - Morning Classes (Mon-Fri, 8 AM - 12 PM)
  - Afternoon Classes (Mon-Fri, 1 PM - 5 PM)
  - Evening Classes (Mon/Wed/Fri, 6 PM - 9 PM)
  - Weekend Intensive (Sat-Sun, 9 AM - 5 PM)
  - Compact Schedule (Tue/Thu, 2-hour sessions)
- Custom template creation and management
- One-click template application
- Template statistics (sessions, days, hours/week)

### 5. **AI-Powered Optimization**
- Schedule analysis with priority-based suggestions:
  - **High Priority:** Critical issues (e.g., schedule overload)
  - **Medium Priority:** Improvement opportunities (e.g., large gaps)
  - **Low Priority:** Enhancement suggestions (e.g., distribution)
- Optimization categories:
  - Time gaps detection
  - Schedule overload warnings
  - Distribution analysis
  - Resource utilization
- Actionable recommendations for each suggestion

### 6. **Smart Scheduling Features**
- Automatic gap detection between sessions
- Optimal time slot suggestions based on:
  - Existing schedule patterns
  - Available gaps
  - Standard class times
- Duration-aware scheduling

## 📁 Project Structure

```
schedule/
├── index.tsx                          # Main schedule management page
├── types/
│   └── schedule.types.ts              # TypeScript type definitions
├── utils/
│   └── schedule.utils.ts              # Utility functions and algorithms
└── components/
    ├── TimeSlotPicker.tsx             # Visual time slot selector
    ├── RecurrenceBuilder.tsx          # Recurring schedule configurator
    ├── ConflictDetector.tsx           # Conflict detection and display
    ├── ScheduleTemplates.tsx          # Template management
    └── OptimizationSuggestions.tsx    # AI optimization dashboard
```

## 🚀 Usage

### Accessing the Schedule Page

Navigate to: `/classes/[classId]/schedule`

Example: `http://localhost:3001/classes/1/schedule`

### Creating a Schedule

1. Click **"Create Schedule"** button
2. Fill in basic information:
   - Title (required)
   - Description (optional)
   - Subject, Teacher, Room (required)
   - Date (required)
3. Use the **Time Slot Picker**:
   - Click a start time
   - Select quick duration or click end time
   - Or use suggested slots (green highlight)
4. (Optional) Enable recurring schedule:
   - Check "Make this a recurring schedule"
   - Configure recurrence pattern
   - Set end conditions
5. Review any **conflicts** (will show in red if detected)
6. Click **"Create Schedule"** to save

### Using Templates

1. Go to **"Templates"** tab
2. Choose from predefined templates or create custom ones
3. Click **"Apply"** on any template
4. Schedules will be automatically created based on template configuration

### Optimization Dashboard

1. Go to **"Optimize"** tab
2. Review AI-generated suggestions organized by priority:
   - **Red badges:** High priority (requires immediate attention)
   - **Yellow badges:** Medium priority (recommended improvements)
   - **Blue badges:** Low priority (optional enhancements)
3. Read recommended actions for each suggestion
4. Adjust your schedule accordingly

## 🛠️ Technical Details

### Time Slot Algorithm

The system uses a minute-based calculation for precise time management:
- Converts time strings to minutes since midnight
- Calculates overlaps using interval arithmetic
- Suggests optimal slots by analyzing gaps in existing schedules

### Conflict Detection

Three types of conflicts are detected:
1. **Room Conflict:** Same room booked at overlapping times
2. **Teacher Conflict:** Same teacher assigned to overlapping sessions
3. **Time Overlap:** General scheduling overlaps

### Optimization Engine

The optimization engine analyzes:
- **Gap Analysis:** Detects gaps > 2 hours between sessions
- **Overload Detection:** Warns when daily schedule exceeds 6 hours
- **Distribution Analysis:** Checks if sessions are spread across enough days
- **Resource Utilization:** Analyzes efficient use of rooms and teachers

### Recurrence Generation

Recurring schedules support:
- Multiple days per week selection
- Flexible intervals (daily, weekly, bi-weekly, monthly, custom)
- Smart end date calculation based on occurrences

## 🎨 UI/UX Features

- **Color-coded feedback:**
  - 🔵 Blue: Selected time slots
  - 🟢 Green: Suggested optimal slots
  - ⚪ Gray: Occupied/unavailable slots
  - 🔴 Red: Conflicts detected

- **Interactive elements:**
  - Hover effects for better user feedback
  - Smooth transitions and animations
  - Responsive design for mobile and desktop

- **Accessibility:**
  - Clear labels and descriptions
  - Keyboard navigation support
  - Screen reader friendly

## 📊 Data Flow

```
User Input → Form State → Validation
                ↓
        Conflict Detection
                ↓
        Optimization Analysis
                ↓
        Database Save (API call)
                ↓
        UI Update → Success Feedback
```

## 🔮 Future Enhancements

- [ ] Drag-and-drop schedule rearrangement
- [ ] Bulk schedule operations (delete, move, copy)
- [ ] Schedule export (PDF, iCal, CSV)
- [ ] Email notifications for schedule changes
- [ ] Student availability integration
- [ ] Automatic schedule generation based on constraints
- [ ] Calendar synchronization (Google Calendar, Outlook)
- [ ] Mobile app integration
- [ ] Real-time collaboration for multiple schedulers
- [ ] Analytics dashboard with usage statistics

## 💡 Best Practices

1. **Always check conflicts** before finalizing schedules
2. **Use templates** for recurring schedule patterns
3. **Review optimization suggestions** regularly
4. **Set recurrence end dates** to avoid infinite schedules
5. **Fill time gaps** identified by the optimization engine
6. **Balance daily workload** - aim for 4-6 hours per day max
7. **Spread sessions** across multiple days for better learning

## 🐛 Known Limitations

- Maximum 100-year range for year selection
- Time slots limited to 7 AM - 10 PM range
- 30-minute interval for time slot picker (configurable in code)
- Templates stored in local state (not persisted to backend yet)

## 🤝 Contributing

When extending this feature:
1. Add new types to `schedule.types.ts`
2. Add utility functions to `schedule.utils.ts`
3. Create reusable components in `components/` directory
4. Update this README with new features
5. Add tests for critical functions

## 📝 API Integration Points

To integrate with backend:
- `POST /api/schedules` - Create schedule
- `PUT /api/schedules/:id` - Update schedule
- `DELETE /api/schedules/:id` - Delete schedule
- `GET /api/schedules/class/:classId` - Get class schedules
- `GET /api/schedules/conflicts` - Check conflicts
- `POST /api/templates` - Save template
- `GET /api/templates/class/:classId` - Get templates

## 📞 Support

For issues or questions about this schedule system, refer to the main project documentation or contact the development team.

---

**Version:** 1.0.0
**Last Updated:** 2025-10-29
**Maintained by:** Development Team
