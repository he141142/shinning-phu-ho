# Semester Selection Feature with Lazy Loading

## Overview
This feature implements an intelligent semester selection system that automatically finds and displays available semesters based on the class start and end dates. It includes modern lazy loading animations and is integrated into both the class creation and class detail edit pages.

## Key Features

### 1. **Date-Based Semester Filtering**
- Semesters are automatically filtered based on start and end dates
- Only shows semesters that overlap with the selected date range
- API query is optimized to only fetch relevant semesters

### 2. **Lazy Loading with Animations**
- Semester popup appears **only after both start and end dates are selected**
- 300ms delay before fetching to prevent unnecessary API calls
- Smooth fade-in and slide-down animation using Framer Motion
- Loading spinner with "Finding available semesters..." message
- Beautiful gradient background (purple to pink)

### 3. **Multiple Semester Support**
- Classes can have multiple semesters (stored in database)
- Only one semester can be active at a time
- UI shows which semester is currently active with "Active" badge
- Users can switch between semesters by clicking

### 4. **Modern UI States**

#### Loading State
```
┌─────────────────────────────────────┐
│  🔄 Finding available semesters...  │
│     (animated spinner)              │
└─────────────────────────────────────┘
```

#### No Semesters Found
```
┌─────────────────────────────────────┐
│         📅                          │
│  No semesters available             │
│  No semesters match the selected    │
│  date range                         │
└─────────────────────────────────────┘
```

#### Semesters Available
```
┌─────────────────────────────────────┐
│  Select a semester for this class:  │
│                                     │
│  ┌──────────────┐ ┌──────────────┐ │
│  │ Spring 2024  │ │ Fall 2024    │ │
│  │ Jan 1 - May  │ │ Aug 1 - Dec  │ │
│  │ ✓ Active     │ │              │ │
│  └──────────────┘ └──────────────┘ │
└─────────────────────────────────────┘
```

## Implementation Details

### Files Created

#### 1. **Hook: `useGetSemestersByDateRange.ts`**
```typescript
// Fetches semesters filtered by date range
useGetSemestersByDateRange({
  start_date: '2024-01-01',
  end_date: '2024-06-30'
})
```

**Features:**
- Uses React Query for caching
- Only enabled when both dates are provided
- 5-minute stale time for performance
- Returns loading, error, and data states

#### 2. **Component: `SemesterSelector.tsx`**
A self-contained component with:
- **Lazy trigger**: 300ms delay after dates are set
- **Animations**: Framer Motion for smooth transitions
- **States**: Loading, error, empty, success
- **Selection**: Click to select/deselect semesters
- **Visual feedback**: Checkmarks, badges, hover effects

**Props:**
```typescript
interface SemesterSelectorProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  selectedSemesterId: number | null;
  onSelectSemester: (semesterId: number | null) => void;
  className?: string;
}
```

### Integration Points

#### Class Detail Page (`/class_detail/[id]`)

**Location**: After the date pickers in edit mode

**Behavior**:
1. User clicks "Edit Mode"
2. Date pickers appear for start/end dates
3. User selects both dates
4. After 300ms delay, semester popup animates in
5. Shows loading spinner while fetching
6. Displays available semesters
7. User selects a semester
8. Semester is saved when "Save Changes" is clicked

**Updated Fields**:
- Added `editedStartDate` and `editedEndDate` state
- Integrated date pickers in edit mode
- Shows current dates in view mode
- Semester selector appears below dates

#### Create Class Page (`/classes/create`)

**Location**: Section 2 - Schedule

**Behavior**:
1. User fills in class name and grade (Section 1)
2. User enters start and end dates (Section 2)
3. Semester popup automatically appears below with animation
4. User selects a semester (optional)
5. Semester ID is included when creating the class

**Updated Model**:
```typescript
interface CreateClassInput {
  class_name: string;
  semester_id?: number; // NEW FIELD
  start_date?: string;
  end_date?: string;
  // ... other fields
}
```

### API Requirements

#### GraphQL Query
```graphql
query ListSemestersByDateRange($input: ListSemestersByDateRangeInput!) {
  ListSemestersByDateRange(input: $input) {
    total
    data {
      semester_id
      semester_name
      start_date
      end_date
    }
  }
}
```

**Input:**
```typescript
{
  start_date: string; // ISO format
  end_date: string;   // ISO format
}
```

**Response:**
```typescript
{
  total: number;
  data: Semester[];
}
```

#### Updated Mutations

**CreateClass** - now accepts `semester_id`
**UpdateClass** - now accepts `semester_id`, `start_date`, `end_date`

### Animation Timeline

```
User selects dates
      ↓
300ms delay (debounce)
      ↓
Enable API query
      ↓
Show loading spinner (fade in)
      ↓
API responds
      ↓
Hide spinner, show results (slide down, stagger cards)
      ↓
Each semester card animates in (50ms delay between each)
```

### UI Design Specifications

**Colors:**
- Background: `from-purple-50 to-pink-50`
- Border: `border-purple-200`
- Selected: `border-purple-500 bg-purple-100`
- Hover: `hover:border-purple-300 hover:bg-purple-50`
- Active Badge: `bg-purple-600 text-white`

**Animations:**
- Container: Fade in + slide down (300ms)
- Loading: Spinner rotation (infinite)
- Cards: Stagger in from left (50ms delay each)
- Hover: Scale and shadow (200ms)

**Spacing:**
- Grid: 2 columns on desktop, 1 on mobile
- Gap: 3 (0.75rem)
- Padding: p-6 for container, p-4 for cards

## Usage Examples

### Example 1: Creating a New Class
```typescript
// User flow:
1. Enter "Math 101" as class name
2. Select "Grade 10"
3. Select start date: Jan 1, 2024
4. Select end date: May 31, 2024
   → Semester popup appears with animation
   → Shows "Spring 2024" and "Full Year 2024"
5. Click "Spring 2024"
   → Card highlights with checkmark
6. Click "Save & Continue"
   → Class created with semester_id = 1
```

### Example 2: Editing Class in Detail Page
```typescript
// User flow:
1. Navigate to /class_detail/1
2. Click "Edit Mode"
3. Update start date to Aug 1, 2024
4. Update end date to Dec 15, 2024
   → Previous semester (Spring) is cleared
   → New semester popup appears
   → Shows "Fall 2024"
5. Select "Fall 2024"
6. Click "Save Changes"
   → Class updated with new semester
```

## Error Handling

**API Failure:**
- Shows error message with red alert
- "Failed to load semesters. Please try again."
- Does not block form submission

**No Dates:**
- Popup doesn't appear at all
- Form can still be submitted

**No Semesters Found:**
- Shows friendly empty state
- "No semesters available"
- User can proceed without selecting a semester

## Performance Optimizations

1. **Lazy Query Execution**
   - API only called when both dates are set
   - 300ms debounce prevents rapid re-fetching

2. **React Query Caching**
   - Results cached for 5 minutes
   - Subsequent loads are instant

3. **Conditional Rendering**
   - Component unmounts when dates are cleared
   - Cleanup prevents memory leaks

4. **Optimistic Updates**
   - Selected state updates immediately
   - No loading state when clicking semesters

## Testing Checklist

- [ ] Create class with no semester (should work)
- [ ] Create class with semester selection
- [ ] Change dates and verify semester list updates
- [ ] Edit class and change semester
- [ ] Verify loading animation appears
- [ ] Test with API error (should show error state)
- [ ] Test with empty results (should show empty state)
- [ ] Verify animations are smooth
- [ ] Test on mobile and desktop
- [ ] Verify semester persists after save

## Future Enhancements

1. **Semester Management**
   - Allow multiple active semesters per class
   - Show semester timeline view
   - Drag-and-drop semester scheduling

2. **Smart Suggestions**
   - Auto-select semester if only one matches
   - Suggest semester based on class history
   - Warn if dates don't match any semester

3. **Batch Operations**
   - Apply semester to multiple classes
   - Clone semester settings
   - Bulk semester updates

## Notes

- Semester selection is **optional** - classes can exist without a semester
- The system supports classes with multiple semesters stored in the database
- Only one semester can be "active" at a time (displayed in the UI)
- Date ranges are inclusive - semesters that partially overlap are included
- All dates use ISO format for consistency across timezones
