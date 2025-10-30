# Class Detail Edit Mode Feature

## Overview
This feature adds comprehensive edit mode functionality to the class detail page at `/class_detail/[id]`, allowing administrators to update class information inline.

## Features Implemented

### 1. Edit Mode Toggle
- **Edit Mode Button**: Located in the header, allows entering edit mode
- **Save/Cancel Buttons**: Appear when in edit mode with loading state during save

### 2. Editable Fields

#### Class Name (Inline Edit)
- Text input field replaces the display title
- Updates in real-time as user types

#### Teacher Selection (Modal)
- "Change" button appears next to teacher info in edit mode
- Opens a modern modal with:
  - Search functionality (by name or email)
  - Scrollable list of all teachers
  - Visual selection indicator
  - Current teacher badge
  - Teacher details (name, email, student count)

#### Semester Selection (Dropdown)
- Inline dropdown replaces semester display
- Fetches list of semesters via API
- Fallback to mock data if API doesn't exist

#### Grade Selection (Dropdown)
- Inline dropdown for grade selection
- Uses existing grades API

### 3. Data Persistence
- Updates are sent via GraphQL mutation
- Only changed fields are included in the update
- Success/error toast notifications
- Automatic page refresh on success

## Files Created

### Models
- `src/models/semesters/ListSemesters.ts` - Semester list response type
- `src/models/class/UpdateClass.ts` - Update class input/response types

### Hooks
- `src/hooks/semesters/useGetListSemesters.ts` - Fetch semesters list
- `src/hooks/semesters/index.ts` - Semester hooks export
- `src/hooks/classes/useUpdateClass.ts` - Update class mutation

### Components
- `src/components/classes/TeacherSelectionModal.tsx` - Modern teacher selection modal with search

### Updated Files
- `src/pages/class_detail/components/class-detail.tsx` - Main implementation
- `src/models/class/class.detail.ts` - Added grade_id field
- `src/hooks/classes/index.ts` - Export useUpdateClass

## Usage

1. Navigate to any class detail page: `http://localhost:3000/class_detail/1`
2. Click "Edit Mode" button in the header
3. Make changes:
   - Type in the class name field
   - Click "Change" next to teacher to open selection modal
   - Use dropdowns to change semester or grade
4. Click "Save Changes" to persist
5. Or click "Cancel" to discard changes

## API Requirements

### Required GraphQL Mutations
```graphql
mutation UpdateClass($input: UpdateClassInput!) {
  UpdateClass(input: $input) {
    status
    message
    class_id
  }
}
```

### Required GraphQL Queries
```graphql
query ListSemesters($input: ListSemestersInput!) {
  ListSemesters(input: $input) {
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

### Query Updates
The `GetClassById` query now includes `grade_id` field:
```graphql
query {
  GetClassById(input: { class_id: 1 }) {
    grade
    grade_id  # New field
    # ... other fields
  }
}
```

## Design Features

- **Modern UI**: Gradient colors, smooth transitions, and animations
- **Loading States**: Spinner animation on save button
- **Validation**: Only saves if changes were made
- **Accessibility**: Proper labels, focus states, and keyboard navigation
- **Responsive**: Works on mobile and desktop
- **User Feedback**: Toast notifications for success/error states

## Notes

- If the semester list API doesn't exist, the hook will fail gracefully
- The teacher modal uses the existing `useGetListTeachers` hook
- Grade selection uses the existing `useGetAllGrades` hook
- Changes are applied optimistically with cache invalidation
