# Migration Example: Student Management Page

This example shows how to migrate the student management page from the old GraphQL approach to TanStack Query.

## Before (Old Code)

```typescript
import { UseFetchGraphqlWithVariable } from "@/components/hooks/fetch-variable";
import { HOST } from "@/static/env";
import { GetListStudentResponse } from "@/models/students/GetListStudent/GetListStudent";

export default function StudentManagements() {
    const router = useRouter();
    const page = router.query?.page ? parseInt(router.query.page as string) : 1;
    const [limit, setLimit] = useState(12);

    const variables = useMemo(() => ({
        input: {
            page: page,
            limit: limit,
            order_by: "class desc",
            where: {}
        }
    }), [page, limit]);

    // OLD APPROACH - Custom hook with manual query string
    const { data, error, loading } = UseFetchGraphqlWithVariable<GetListStudentResponse>(
        `${HOST}/query`,
        `
            query getListStudent($input:GetListStudentInput!){
                GetListStudent(input: $input){
                    total
                    data{
                        id
                        first_name
                        last_name
                        dob
                        email
                        address
                        phone
                        classes{
                            class_id
                            class_name
                        }
                        subject{
                            id
                            name
                        }
                        grade{
                            grade_id
                            grade_name
                        }
                    }
                }
            }
        `,
        variables
    );

    // Render logic
    if (loading) return <LoadingPage />;
    if (error) return <ErrorPage message={error} />;

    const students = data?.GetListStudent?.data || [];
    const total = data?.GetListStudent?.total || 0;

    return (
        <div>
            {/* Component JSX */}
        </div>
    );
}
```

## After (New Code with TanStack Query)

```typescript
import { useGetListStudent } from '@/hooks/students';
import { GetListStudentResponse } from "@/models/students/GetListStudent/GetListStudent";

export default function StudentManagements() {
    const router = useRouter();
    const page = router.query?.page ? parseInt(router.query.page as string) : 1;
    const [limit, setLimit] = useState(12);

    // NEW APPROACH - Clean hook with automatic caching
    const { data, error, isLoading, isFetching, refetch } = useGetListStudent({
        page: page,
        limit: limit,
        order_by: "class desc",
        where: {}
    });

    // Render logic - same as before
    if (isLoading) return <LoadingPage />;
    if (error) return <ErrorPage message={error.message} />;

    const students = data?.GetListStudent?.data || [];
    const total = data?.GetListStudent?.total || 0;

    return (
        <div>
            {/* Component JSX */}

            {/* New feature: Manual refresh button */}
            <Button
                onClick={() => refetch()}
                disabled={isFetching}
            >
                {isFetching ? 'Refreshing...' : 'Refresh Data'}
            </Button>
        </div>
    );
}
```

## Key Changes

### 1. Import Changes
```typescript
// REMOVED
import { UseFetchGraphqlWithVariable } from "@/components/hooks/fetch-variable";
import { HOST } from "@/static/env";

// ADDED
import { useGetListStudent } from '@/hooks/students';
```

### 2. Hook Usage
```typescript
// OLD - Verbose with inline GraphQL query
const { data, error, loading } = UseFetchGraphqlWithVariable<GetListStudentResponse>(
    `${HOST}/query`,
    `query getListStudent($input:GetListStudentInput!){ ... }`,
    variables
);

// NEW - Simple and clean
const { data, error, isLoading, isFetching, refetch } = useGetListStudent({
    page,
    limit,
    order_by: "class desc",
    where: {}
});
```

### 3. Loading State
```typescript
// OLD
if (loading) return <LoadingPage />;

// NEW - More granular control
if (isLoading) return <LoadingPage />;  // Initial load
if (isFetching) {
    // Show background loading indicator
}
```

### 4. Error Handling
```typescript
// OLD
if (error) return <ErrorPage message={error} />;

// NEW - Error object with message property
if (error) return <ErrorPage message={error.message} />;
```

## Benefits You Get

### ✅ Automatic Caching
```typescript
// First visit to page 1 - fetches from server
router.push('/student_managements?page=1');

// Visit page 2 - fetches from server
router.push('/student_managements?page=2');

// Back to page 1 - INSTANT! Served from cache
router.push('/student_managements?page=1');
```

### ✅ Background Refetching
```typescript
// Data automatically refetches in background when:
// - Window regains focus
// - Network reconnects
// - Stale time expires (configurable)
```

### ✅ Request Deduplication
```typescript
// If multiple components request the same data,
// only ONE network request is made
const query1 = useGetListStudent({ page: 1, limit: 10 });
const query2 = useGetListStudent({ page: 1, limit: 10 }); // Shares cache!
```

### ✅ Manual Refetch
```typescript
const { refetch } = useGetListStudent({ page: 1, limit: 10 });

// User clicks refresh button
<Button onClick={() => refetch()}>Refresh</Button>
```

### ✅ Optimistic Updates
When a student is created/updated elsewhere:
```typescript
// In create student page
const { mutate } = useCreateStudent({
    onSuccess: () => {
        // This automatically refetches the student list!
        queryClient.invalidateQueries({ queryKey: ['students'] });
    }
});
```

### ✅ DevTools
Open React Query DevTools to see:
- All cached queries
- Query states (fresh, stale, fetching)
- Cached data inspection
- Manual cache invalidation

## Advanced Features

### Pagination with Prefetching
```typescript
const { data, isLoading } = useGetListStudent({ page, limit });

// Prefetch next page for instant navigation
const { queryClient } = useQueryClient();

useEffect(() => {
    // Prefetch next page
    queryClient.prefetchQuery({
        queryKey: ['students', { page: page + 1, limit, order_by: "class desc", where: {} }],
        queryFn: () => fetchStudents(page + 1, limit)
    });
}, [page, limit, queryClient]);
```

### Search with Debouncing
```typescript
const [searchQuery, setSearchQuery] = useState("");
const debouncedSearch = useDebounce(searchQuery, 500);

const { data } = useGetListStudent({
    page,
    limit,
    order_by: "class desc",
    where: debouncedSearch ? { search: debouncedSearch } : {}
});

// Only fetches after user stops typing for 500ms
```

### Infinite Scroll
```typescript
import { useInfiniteQuery } from '@tanstack/react-query';

const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
} = useInfiniteQuery({
    queryKey: ['students', 'infinite'],
    queryFn: ({ pageParam = 1 }) =>
        fetchStudents(pageParam, limit),
    getNextPageParam: (lastPage, pages) =>
        lastPage.hasMore ? pages.length + 1 : undefined,
});

// All students from all pages
const allStudents = data?.pages.flatMap(page => page.data) || [];
```

## Performance Comparison

| Metric | Old Approach | TanStack Query |
|--------|-------------|----------------|
| First Load | ~500ms | ~500ms |
| Return to cached page | ~500ms | <10ms (instant!) |
| Multiple same requests | N requests | 1 request (deduplicated) |
| Background refetch | Manual only | Automatic |
| Memory usage | Higher (no GC) | Lower (smart GC) |
| Bundle size | Custom code | Well-optimized library |

## Migration Checklist

- [ ] Install `@tanstack/react-query`
- [ ] Wrap app with `ReactQueryProvider` in `_app.tsx`
- [ ] Replace `UseFetchGraphqlWithVariable` with `useGetListStudent`
- [ ] Update loading state: `loading` → `isLoading`
- [ ] Update error handling: `error` → `error.message`
- [ ] Add refetch button (optional)
- [ ] Test pagination
- [ ] Test error states
- [ ] Check DevTools

## Common Pitfalls

### ❌ Don't construct variables manually
```typescript
// Bad - variables object not needed
const variables = useMemo(() => ({
    input: { page, limit, order_by: "class desc", where: {} }
}), [page, limit]);

const { data } = useGetListStudent(variables.input);
```

```typescript
// Good - pass values directly
const { data } = useGetListStudent({
    page,
    limit,
    order_by: "class desc",
    where: {}
});
```

### ❌ Don't forget to handle loading states
```typescript
// Bad - Can cause errors
const students = data.GetListStudent.data; // Error if data is undefined!

// Good - Safe access
const students = data?.GetListStudent?.data || [];
```

### ❌ Don't ignore error.message
```typescript
// Bad
if (error) return <ErrorPage message={error} />; // [object Object]

// Good
if (error) return <ErrorPage message={error.message} />;
```

## Next Steps

1. Migrate other pages one by one
2. Add optimistic updates for mutations
3. Implement prefetching for better UX
4. Use DevTools to optimize cache settings
5. Add error boundaries for better error handling

## Resources

- [useGetListStudent Hook Reference](./GRAPHQL_HOOKS_REFERENCE.md#usegetliststudent)
- [Full Migration Guide](./GRAPHQL_MIGRATION_GUIDE.md)
- [TanStack Query Docs](https://tanstack.com/query/latest)
