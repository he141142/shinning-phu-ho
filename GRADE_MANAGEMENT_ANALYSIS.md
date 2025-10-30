# Grade Management Feature Analysis

**Date:** October 30, 2025
**Status:** Planning Phase - Complete Codebase Review

---

## Executive Summary

The Grade Management feature is planned but **not yet implemented**. The codebase has:
- ✅ Foundational infrastructure (GraphQL, React Query hooks system)
- ✅ Grade data models and types
- ✅ One basic query hook for fetching grades
- ❌ No dedicated grades management page/routes
- ❌ No Create, Update, or Delete grade mutations
- ❌ No CRUD UI components for grades

The codebase uses **modern patterns** (GraphQL + React Query) that should be followed for consistent implementation.

---

## 1. Existing Grade Management Functionality

### 1.1 Grade-Related Queries (Read Operations)

**Current Implementation:**
- **File:** `src/hooks/grades/useGetAllGrades.ts`
- **Purpose:** Fetch all available grades (static/reference data)
- **Cache Strategy:** 30-minute stale time (data rarely changes)
- **GraphQL Query:**
  ```graphql
  query ListAllGrades {
    ListAllGrades {
      grade_id
      grade_name
    }
  }
  ```

**Grade Data Model:**
```typescript
// src/models/grades/ListAllGrades.ts
export interface Grade {
  grade_id: number;
  grade_name: string;
}

export interface ListAllGradesResponse {
  ListAllGrades: Grade[]
}
```

### 1.2 Grade Integration Points

Grades are used in:
- **Student Management:** Students have a grade field (many-to-one)
- **Student Creation:** Grade selection in form
- **Student Detail Page:** Shows student grade

---

## 2. Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | Next.js | 14.2.5 |
| **React** | React | 18.3.1 |
| **State Management** | React Query (TanStack) | 5.90.5 |
| **GraphQL Client** | graphql-request | 7.3.1 |
| **Forms** | React Hook Form | 7.54.2 |
| **UI Components** | Radix UI | Latest |
| **Styling** | TailwindCSS | 3.4.7 |
| **Icons** | Lucide React | 0.427.0 |
| **Animations** | Framer Motion | 12.4.7 |

---

## 3. Missing CRUD Operations

❌ **No Mutations:**
- Create grade
- Update grade  
- Delete grade

---

## 4. Similar Pages Pattern (Reference)

### Student Management Page
**File:** `src/pages/student_managements/index.tsx`
**Features:**
- Paginated list
- Search by name/email
- Filter by grade
- Grid/List toggle
- View/Edit/Delete actions

### Teacher Management Page
**File:** `src/pages/teachers/index.tsx`
**Features:**
- Paginated grid
- Search by name/email/center
- Add via modal
- View details
- Framer Motion animations

---

## 5. Recommended Directory Structure

```
src/
├── models/grades/
│   ├── CreateGrade.ts
│   ├── UpdateGrade.ts
│   └── DeleteGrade.ts
│
├── hooks/grades/
│   ├── useCreateGrade.ts
│   ├── useUpdateGrade.ts
│   ├── useDeleteGrade.ts
│   └── useGetGradeById.ts
│
├── components/grades/
│   ├── GradeForm.tsx
│   ├── CreateGradeModal.tsx
│   ├── EditGradeModal.tsx
│   └── DeleteConfirmModal.tsx
│
└── pages/grades/
    └── index.tsx
```

---

## 6. What Needs Implementation

### Backend (Priority: HIGH)
GraphQL mutations needed:
- CreateGrade
- UpdateGrade
- DeleteGrade

### Frontend Models
- CreateGradeInput interface
- UpdateGradeInput interface
- Type definitions for responses

### Frontend Hooks
- useCreateGrade()
- useUpdateGrade()
- useDeleteGrade()
- useGetGradeById() (optional)

### Frontend Components
- GradeForm (reusable)
- CreateGradeModal
- EditGradeModal
- Grade list/cards

### Frontend Page
- `src/pages/grades/index.tsx`
- Full CRUD management interface

---

## 7. Implementation Pattern Example

### Create Grade Hook
```typescript
import { useGraphQLMutationWithUnwrap, gql } from '@/lib/graphql';
import { queryClient } from '@/lib/react-query';

const CREATE_GRADE_MUTATION = gql`
  mutation CreateGrade($input: CreateGradeInput!) {
    CreateGrade(input: $input) {
      entity_id
      status
      message
    }
  }
`;

export function useCreateGrade(options?: {
  onSuccess?: (data: CommonResponse) => void;
}) {
  return useGraphQLMutationWithUnwrap<CommonResponse, { input: CreateGradeInput }>(
    'CreateGrade',
    CREATE_GRADE_MUTATION,
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['grades'] });
        options?.onSuccess?.(data);
      },
    }
  );
}
```

---

## 8. Implementation Phases

### Phase 1: Infrastructure (CRITICAL)
- Define GraphQL mutations in backend
- Create TypeScript models
- Create React Query hooks

### Phase 2: Components
- GradeForm.tsx
- Modal wrappers
- List/card components

### Phase 3: Management Page
- List with pagination
- Search/filter
- Create/Edit/Delete modals

### Phase 4: Polish
- Fix hardcoded grades in forms
- Add tests
- Performance optimization

---

## 9. Estimated Effort: 3-5 days

Dependencies:
- Backend GraphQL API ready
- Database schema supports CRUD

---

*Last Updated: October 30, 2025*
