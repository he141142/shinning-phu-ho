# GraphQL + TanStack Query Migration Guide

This guide explains how to use the new GraphQL setup with TanStack Query (React Query) in this project.

## Table of Contents
- [Overview](#overview)
- [What Changed](#what-changed)
- [New Architecture](#new-architecture)
- [Migration Examples](#migration-examples)
- [Available Hooks](#available-hooks)
- [Best Practices](#best-practices)

---

## Overview

The project has been migrated from custom GraphQL fetch hooks to **TanStack Query** (React Query) for better:
- ✅ Automatic caching and background refetching
- ✅ Optimistic updates and query invalidation
- ✅ Loading and error states management
- ✅ Request deduplication
- ✅ DevTools for debugging
- ✅ Type safety with TypeScript
- ✅ Automatic retries and stale data handling

---

## What Changed

### Before (Old Approach)
```typescript
// Custom hooks with manual loading/error handling
import { UseFetch } from '@/components/hooks/fetch-data';

const { data, loading, error } = UseFetch<StudentData>(
  `${HOST}/query`,
  `query { GetListStudent { ... } }`
);
```

### After (New Approach)
```typescript
// TanStack Query hooks with automatic caching
import { useGetListStudent } from '@/hooks/students';

const { data, isLoading, error, refetch } = useGetListStudent({
  page: 1,
  limit: 10
});
```

---

## New Architecture

### Directory Structure
```
src/
├── lib/
│   ├── graphql/
│   │   ├── client.ts              # GraphQL client utilities
│   │   ├── hooks/
│   │   │   ├── useGraphQLQuery.ts    # Base query hook
│   │   │   └── useGraphQLMutation.ts # Base mutation hook
│   │   └── index.ts
│   └── react-query/
│       ├── client.ts              # Query client config
│       ├── provider.tsx           # Provider component
│       └── index.ts
└── hooks/
    ├── students/                  # Student-specific hooks
    ├── classes/                   # Class-specific hooks
    ├── teachers/                  # Teacher-specific hooks
    ├── grades/                    # Grade-specific hooks
    └── index.ts                   # Export all hooks
```

### Core Files

#### 1. GraphQL Client (`src/lib/graphql/client.ts`)
```typescript
import { request, gql as gqlTag } from 'graphql-request';
import { HOST } from '@/static/env';

export const GRAPHQL_ENDPOINT = `${HOST}/query`;
export { gqlTag as gql };

export async function graphqlRequest<TData, TVariables>(
  query: string,
  variables?: TVariables,
): Promise<TData> {
  // Handles errors and makes the request
}
```

#### 2. React Query Provider (`src/pages/_app.tsx`)
```typescript
import { ReactQueryProvider } from '@/lib/react-query';

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => RootLayout({ children: page }));

  return (
    <ReactQueryProvider>
      {getLayout(<Component {...pageProps} />)}
    </ReactQueryProvider>
  );
}
```

---

## Migration Examples

### Example 1: Fetching Student List

#### Old Code
```typescript
import { UseFetchGraphqlWithVariable } from '@/components/hooks/fetch-variable';

const variables = {
  input: {
    page: page,
    limit: perPage,
    order_by: "id desc",
    where: {}
  }
};

const { data, loading, error } = UseFetchGraphqlWithVariable<GetListStudentResponse>(
  `${HOST}/query`,
  `query getListStudent($input: GetListStudentInput!) { ... }`,
  variables
);
```

#### New Code
```typescript
import { useGetListStudent } from '@/hooks/students';

const { data, isLoading, error, refetch } = useGetListStudent({
  page: page,
  limit: perPage,
  order_by: "id desc",
  where: {}
});

// Access data
const students = data?.GetListStudent?.data || [];
const total = data?.GetListStudent?.total || 0;
```

**Benefits:**
- Automatic caching - subsequent calls with same params are instant
- Background refetching keeps data fresh
- No need to manually construct variables object

---

### Example 2: Creating a Student

#### Old Code
```typescript
import { request, gql } from "graphql-request";
import { useGraphQLMutation } from "@/components/hooks/useMutation";

const mutation = gql`
  mutation CreateStudent($input: CreateStudentInput!) {
    CreateStudent(input: $input) {
      entity_id
      status
      message
    }
  }
`;

const handleSubmit = async (formData) => {
  try {
    const data = await request(endpoint, mutation, { input: formData });
    if (data.CreateStudent.status === "200") {
      toast({ title: "Success!" });
    }
  } catch (error) {
    toast({ title: "Error", description: error.message });
  }
};
```

#### New Code
```typescript
import { useCreateStudent } from '@/hooks/students';
import { useToast } from '@/hooks/use-toast';

const { toast } = useToast();

const { mutate: createStudent, isPending } = useCreateStudent({
  onSuccess: (data) => {
    if (data.status === "200") {
      toast({ title: "Success!", description: data.message });
      // Student list is automatically refetched!
    }
  },
  onError: (error) => {
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive"
    });
  }
});

const handleSubmit = (formData) => {
  createStudent({ input: formData });
};

// Use isPending for loading state
<Button disabled={isPending}>
  {isPending ? "Creating..." : "Create Student"}
</Button>
```

**Benefits:**
- Automatic query invalidation (student list refetches)
- Built-in loading state (`isPending`)
- Cleaner error handling
- No try/catch needed

---

### Example 3: Class Details Page

#### Old Code
```typescript
import { UseFetch } from '@/components/hooks/fetch-data';

const { data, loading, error } = UseFetch<GetClassByIdResponse>(
  `${HOST}/query`,
  `query { GetClassById(class_id: ${id}) { ... } }`
);

if (loading) return <div>Loading...</div>;
if (error) return <div>Error: {error}</div>;
```

#### New Code
```typescript
import { useGetClassById } from '@/hooks/classes';

const { data, isLoading, error, refetch } = useGetClassById(Number(id));

if (isLoading) return <div>Loading...</div>;
if (error) return <div>Error: {error.message}</div>;

const classDetail = data?.GetClassById;
```

**Benefits:**
- Cached - switching between class pages is instant
- Refetch function available for manual updates
- Better TypeScript support

---

### Example 4: Joining Student to Class

#### Old Code
```typescript
import { useGraphQLMutation } from '@/components/hooks/useMutation';

const { executeMutation, loading, error } = useGraphQLMutation();

const handleJoin = async (studentId: number, classId: number) => {
  const query = `
    mutation JoinStudent($student_id: Int!, $class_id: Int!) {
      JoinStudentToClass(input: { student_id: $student_id, class_id: $class_id }) {
        status
        message
      }
    }
  `;

  const result = await executeMutation(query, { student_id: studentId, class_id: classId });
  // Manual refetch needed
};
```

#### New Code
```typescript
import { useJoinStudentToClass } from '@/hooks/students';

const { mutate: joinClass, isPending } = useJoinStudentToClass({
  onSuccess: (data) => {
    toast({ title: "Success!", description: data.message });
    // All related queries automatically refetch:
    // - Student list
    // - Student detail
    // - Class detail
    // - Class list
  }
});

const handleJoin = (studentId: number, classId: number) => {
  joinClass({ student_id: studentId, class_id: classId });
};
```

**Benefits:**
- Automatic invalidation of all related data
- UI updates everywhere automatically
- Optimistic updates possible

---

## Available Hooks

### Student Hooks
```typescript
import {
  useGetListStudent,      // Fetch paginated student list
  useGetStudentDetail,    // Fetch single student details
  useCreateStudent,       // Create new student
  useJoinStudentToClass,  // Join student to class
} from '@/hooks/students';
```

### Class Hooks
```typescript
import {
  useGetListClass,        // Fetch paginated class list
  useGetClassById,        // Fetch single class details
} from '@/hooks/classes';
```

### Teacher Hooks
```typescript
import {
  useGetListTeachers,     // Fetch paginated teacher list
  useAddTeacherToClass,   // Add teacher to class
} from '@/hooks/teachers';
```

### Grade Hooks
```typescript
import {
  useGetAllGrades,        // Fetch all grades (cached for 30 min)
} from '@/hooks/grades';
```

---

## Best Practices

### 1. Use Query Keys Consistently
```typescript
// Good - predictable cache keys
['students', { page: 1, limit: 10 }]
['student', studentId]
['class', classId]

// Bad - hard to invalidate
['data', Math.random()]
```

### 2. Invalidate Related Queries
```typescript
// When creating a student, invalidate the list
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ['students'] });
}

// When joining student to class, invalidate both
onSuccess: (_, variables) => {
  queryClient.invalidateQueries({ queryKey: ['students'] });
  queryClient.invalidateQueries({ queryKey: ['student', variables.student_id] });
  queryClient.invalidateQueries({ queryKey: ['class', variables.class_id] });
}
```

### 3. Use Stale Time Wisely
```typescript
// Data that changes frequently - short stale time
useQuery({ staleTime: 1 * 60 * 1000 }); // 1 minute

// Data that rarely changes - long stale time
useQuery({ staleTime: 30 * 60 * 1000 }); // 30 minutes
```

### 4. Enable/Disable Queries Conditionally
```typescript
// Only fetch when we have a valid ID
const { data } = useGetStudentDetail(studentId, {
  enabled: !!studentId && studentId > 0
});
```

### 5. Handle Loading and Error States
```typescript
const { data, isLoading, error, isFetching } = useGetListStudent({ page: 1, limit: 10 });

// isLoading - first load
// isFetching - any fetch (including background refetch)
// error - Error object if request failed

if (isLoading) return <Spinner />;
if (error) return <Alert>Error: {error.message}</Alert>;
```

### 6. Use Optimistic Updates (Advanced)
```typescript
const { mutate } = useJoinStudentToClass({
  // Optimistic update - update UI before server responds
  onMutate: async (variables) => {
    await queryClient.cancelQueries({ queryKey: ['student', variables.student_id] });

    const previousData = queryClient.getQueryData(['student', variables.student_id]);

    queryClient.setQueryData(['student', variables.student_id], (old: any) => ({
      ...old,
      classes: [...old.classes, { class_id: variables.class_id }]
    }));

    return { previousData };
  },

  // Rollback on error
  onError: (err, variables, context) => {
    queryClient.setQueryData(['student', variables.student_id], context.previousData);
  },
});
```

---

## React Query DevTools

The DevTools are automatically enabled in development mode. You'll see a small icon in the bottom corner of your app.

**Features:**
- View all queries and their states
- See cached data
- Force refetch queries
- Invalidate cache
- Monitor network requests

---

## Creating New Hooks

### For Queries
```typescript
import { useGraphQLQueryWithVariables, gql } from '@/lib/graphql';

const GET_SOMETHING_QUERY = gql`
  query GetSomething($id: Int!) {
    GetSomething(id: $id) {
      # fields
    }
  }
`;

export function useGetSomething(id: number) {
  return useGraphQLQueryWithVariables<ResponseType>(
    'something',  // base key
    GET_SOMETHING_QUERY,
    { id },
    {
      staleTime: 5 * 60 * 1000,
      enabled: !!id
    }
  );
}
```

### For Mutations
```typescript
import { useGraphQLMutationWithUnwrap, gql } from '@/lib/graphql';
import { queryClient } from '@/lib/react-query';

const DO_SOMETHING_MUTATION = gql`
  mutation DoSomething($input: SomeInput!) {
    DoSomething(input: $input) {
      status
      message
    }
  }
`;

export function useDoSomething(options?: {
  onSuccess?: (data: any) => void;
}) {
  return useGraphQLMutationWithUnwrap(
    'DoSomething',
    DO_SOMETHING_MUTATION,
    {
      onSuccess: (data) => {
        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: ['something'] });
        options?.onSuccess?.(data);
      }
    }
  );
}
```

---

## Troubleshooting

### Query Not Refetching?
- Check `staleTime` - data might still be considered fresh
- Use `refetch()` for manual refetch
- Check if query is enabled: `enabled: true`

### Mutation Not Updating UI?
- Make sure you're invalidating related queries in `onSuccess`
- Check query keys match exactly

### TypeScript Errors?
- Ensure response types are correctly defined in `/src/models`
- Use proper generic types in hooks

### Data Not Cached?
- Check if query keys are consistent
- Verify `gcTime` (garbage collection time) isn't too short

---

## Resources

- [TanStack Query Docs](https://tanstack.com/query/latest/docs/react/overview)
- [graphql-request Docs](https://github.com/jasonkuhrt/graphql-request)
- [React Query DevTools](https://tanstack.com/query/latest/docs/react/devtools)

---

## Summary

The migration brings significant improvements:

✅ **Better Performance** - Automatic caching and request deduplication
✅ **Simpler Code** - Less boilerplate, cleaner components
✅ **Automatic Updates** - UI updates everywhere when data changes
✅ **Better DX** - DevTools, TypeScript support, predictable behavior
✅ **Production Ready** - Battle-tested library used by thousands of apps

Start using the new hooks in your components today!
