# GraphQL Error Handling Guide

## Overview

This application uses a consistent error handling pattern for all GraphQL mutations. The error messages from the backend are automatically extracted and can be displayed to users.

## GraphQL Error Response Format

The backend returns errors in the following format:

```json
{
  "errors": [
    {
      "message": "email existed, please use another email",
      "path": ["RegisterTeacherAccount"]
    }
  ],
  "data": null
}
```

## How Error Handling Works

### 1. GraphQL Client (`src/lib/graphql/client.ts`)

The GraphQL client automatically extracts error messages from the response:

```typescript
export async function graphqlRequest<TData = any, TVariables = Record<string, any>>(
  query: string,
  variables?: TVariables,
): Promise<TData> {
  try {
    const data = await request<TData>(GRAPHQL_ENDPOINT, query, variables as any);
    return data;
  } catch (error: any) {
    // Handle GraphQL errors
    if (error?.response?.errors) {
      const graphqlError = error.response.errors[0];
      throw new Error(graphqlError.message || 'GraphQL request failed');
    }

    // Handle network errors
    if (error?.message) {
      throw new Error(error.message);
    }

    throw new Error('An unknown error occurred');
  }
}
```

**Key Points:**
- ✅ Automatically extracts `error.response.errors[0].message`
- ✅ Creates a JavaScript `Error` object with the message
- ✅ Falls back to generic messages if error format is unexpected
- ✅ Handles both GraphQL errors and network errors

### 2. Mutation Hooks

All mutation hooks accept an `onError` callback that receives the Error object:

```typescript
export function useCreateGrade(options?: {
  onSuccess?: (data: CreateGradeResponse['CreateGrade']) => void;
  onError?: (error: Error) => void;  // <-- Error object with message
}) {
  return useGraphQLMutationWithUnwrap<
    CreateGradeResponse['CreateGrade'],
    { input: CreateGradeInput }
  >(
    'CreateGrade',
    CREATE_GRADE_MUTATION,
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['grades'] });
        queryClient.invalidateQueries({ queryKey: ['students'] });
        options?.onSuccess?.(data);
      },
      onError: options?.onError,  // <-- Passes error to callback
    }
  );
}
```

### 3. Component Usage

In your components, use `error.message` to access the backend error message:

```typescript
const { mutate: createGrade, isPending } = useCreateGrade();

const handleSubmit = (data: GradeFormData) => {
  createGrade(
    { input: { grade_name: data.grade_name } },
    {
      onSuccess: (response) => {
        toast({
          ...RenderSuccessToast(response.message || "Grade created successfully!")
        });
        onClose();
      },
      onError: (error) => {
        // error.message contains the backend error message
        toast({
          ...RenderFailedToast(error.message || "Failed to create grade.")
        });
      },
    }
  );
};
```

## Best Practices

### ✅ DO: Use error.message

```typescript
onError: (error) => {
  toast({
    ...RenderFailedToast(error.message || "Operation failed")
  });
}
```

### ❌ DON'T: Use hardcoded messages

```typescript
// Bad - ignores backend error message
onError: () => {
  toast({
    ...RenderFailedToast("Operation failed")
  });
}
```

### ✅ DO: Provide fallback messages

Always provide a fallback message in case the error doesn't have a message:

```typescript
onError: (error) => {
  toast({
    ...RenderFailedToast(
      error.message || "Failed to create grade. Please try again."
    )
  });
}
```

### ✅ DO: Log errors for debugging

```typescript
onError: (error) => {
  console.error('Grade creation failed:', error);
  toast({
    ...RenderFailedToast(error.message || "Failed to create grade.")
  });
}
```

## Common Error Messages from Backend

Here are some common error messages you might receive:

| Error Message | Meaning | User Action |
|--------------|---------|-------------|
| "email existed, please use another email" | Email already registered | Use different email |
| "username existed, please use another username" | Username taken | Choose different username |
| "invalid credentials" | Wrong username/password | Check credentials |
| "grade name already exists" | Duplicate grade name | Use different name |
| "grade is being used by students" | Can't delete grade in use | Remove students first |
| "unauthorized" | No permission | Check user role |

## Error Types

### 1. GraphQL Validation Errors
```json
{
  "errors": [
    {
      "message": "grade name is required",
      "path": ["CreateGrade"]
    }
  ]
}
```

**Handling:** Display `error.message` to user

### 2. Network Errors
- Connection timeout
- Server unreachable
- DNS resolution failed

**Handling:** Display generic network error message

### 3. Authentication Errors
```json
{
  "errors": [
    {
      "message": "unauthorized: token expired",
      "path": ["CreateGrade"]
    }
  ]
}
```

**Handling:** Redirect to login page

## Implementation Examples

### Example 1: Grade Management

```typescript
// src/components/grades/CreateGradeModal.tsx
const handleSubmit = (data: GradeFormData) => {
  createGrade(
    { input: { grade_name: data.grade_name } },
    {
      onSuccess: (response) => {
        toast({
          ...RenderSuccessToast(
            response.message || "Grade created successfully!"
          ),
        });
        onClose();
      },
      onError: (error) => {
        // Backend error message automatically displayed
        toast({
          ...RenderFailedToast(
            error.message || "Failed to create grade. Please try again."
          ),
        });
      },
    }
  );
};
```

### Example 2: Teacher Registration

```typescript
// src/pages/teachers/components/create-teacher-modal.tsx
registerTeacherAccount(
  { input: formData },
  {
    onSuccess: () => {
      toast.toast({ ...RenderSuccessToast("teacher account added") });
    },
    onError: (error) => {
      // Shows "email existed, please use another email" if that's the error
      toast.toast({
        ...RenderFailedToast(error.message || "teacher account failed")
      });
    },
  }
);
```

### Example 3: With Error Logging

```typescript
const handleDelete = () => {
  if (!grade) return;

  deleteGrade(
    { grade_id: grade.grade_id },
    {
      onSuccess: (response) => {
        console.log('Grade deleted:', grade.grade_id);
        toast({
          ...RenderSuccessToast(response.message || "Grade deleted!")
        });
        onClose();
      },
      onError: (error) => {
        // Log for debugging
        console.error('Delete failed:', {
          gradeId: grade.grade_id,
          error: error.message,
          timestamp: new Date().toISOString()
        });

        // Show user-friendly message
        toast({
          ...RenderFailedToast(
            error.message || "Failed to delete grade."
          )
        });
      },
    }
  );
};
```

## Testing Error Handling

### Test Scenarios

1. **Duplicate Entry**
   - Try to create grade with existing name
   - Verify error message displays: "grade name already exists"

2. **Network Failure**
   - Disconnect internet
   - Try to create grade
   - Verify generic error message displays

3. **Validation Error**
   - Submit empty form
   - Verify validation error displays

4. **Permission Error**
   - Try to delete grade as non-admin
   - Verify permission error displays

### Manual Testing

```typescript
// Test in browser console
const testError = {
  response: {
    errors: [
      {
        message: "email existed, please use another email",
        path: ["RegisterTeacherAccount"]
      }
    ]
  }
};

// Verify error extraction
console.log(testError.response.errors[0].message);
// Output: "email existed, please use another email"
```

## Troubleshooting

### Error message not displaying?

1. **Check error format**
   ```typescript
   onError: (error) => {
     console.log('Error object:', error);
     console.log('Error message:', error.message);
   }
   ```

2. **Verify toast component**
   - Ensure `RenderFailedToast` is imported correctly
   - Check toast provider is in the component tree

3. **Check GraphQL client**
   - Verify `src/lib/graphql/client.ts` has error extraction logic
   - Check GRAPHQL_ENDPOINT is correct

### Generic error instead of specific message?

- Backend might not be returning errors in expected format
- Check network tab in browser DevTools
- Verify backend error response structure

## Summary

✅ **Error messages are automatically extracted** from GraphQL responses
✅ **Use `error.message`** in your onError callbacks
✅ **Always provide fallback messages** for better UX
✅ **Log errors** in development for debugging
✅ **Test error scenarios** thoroughly

---

**Last Updated:** 2025-10-30
**Maintained By:** Development Team
