# ✅ TanStack Query + GraphQL Setup Complete

Your GraphQL setup has been successfully migrated to use **TanStack Query (React Query)** with `gql` tags from `graphql-request`.

## 📦 What's Included

### Core Infrastructure
- ✅ TanStack Query client configuration (`src/lib/react-query/`)
- ✅ GraphQL client utilities (`src/lib/graphql/`)
- ✅ React Query Provider setup in `_app.tsx`
- ✅ DevTools integration (development only)

### Ready-to-Use Hooks
All your existing GraphQL operations have been converted to React Query hooks:

#### Students (`src/hooks/students/`)
- `useGetListStudent` - Fetch paginated student list
- `useGetStudentDetail` - Fetch student details
- `useCreateStudent` - Create new student
- `useJoinStudentToClass` - Join student to class

#### Classes (`src/hooks/classes/`)
- `useGetListClass` - Fetch paginated class list
- `useGetClassById` - Fetch class details

#### Teachers (`src/hooks/teachers/`)
- `useGetListTeachers` - Fetch paginated teacher list
- `useAddTeacherToClass` - Add teacher to class

#### Grades (`src/hooks/grades/`)
- `useGetAllGrades` - Fetch all grades (cached 30 min)

## 🚀 Quick Start

### 1. Import and Use Hooks

```typescript
import { useGetListStudent, useCreateStudent } from '@/hooks/students';

function StudentList() {
  // Query
  const { data, isLoading, error, refetch } = useGetListStudent({
    page: 1,
    limit: 10
  });

  // Mutation
  const { mutate: createStudent, isPending } = useCreateStudent({
    onSuccess: () => {
      toast({ title: 'Student created!' });
    }
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.GetListStudent?.data?.map(student => (
        <div key={student.id}>{student.first_name}</div>
      ))}
    </div>
  );
}
```

### 2. Key Changes from Old Code

| Old | New |
|-----|-----|
| `UseFetch` | `useGetListStudent` |
| `UseFetchGraphqlWithVariable` | `useGetListStudent` |
| `useGraphQLMutation` | `useCreateStudent` |
| `loading` | `isLoading` |
| `error` (string) | `error.message` |
| Manual refetch | `refetch()` |

### 3. Migration Path

For each component using old GraphQL hooks:

1. **Replace the import:**
   ```typescript
   // Before
   import { UseFetchGraphqlWithVariable } from '@/components/hooks/fetch-variable';

   // After
   import { useGetListStudent } from '@/hooks/students';
   ```

2. **Update the hook call:**
   ```typescript
   // Before
   const { data, loading, error } = UseFetchGraphqlWithVariable(...);

   // After
   const { data, isLoading, error } = useGetListStudent({ page: 1, limit: 10 });
   ```

3. **Update loading/error checks:**
   ```typescript
   // Before
   if (loading) return <LoadingPage />;
   if (error) return <ErrorPage message={error} />;

   // After
   if (isLoading) return <LoadingPage />;
   if (error) return <ErrorPage message={error.message} />;
   ```

## 📚 Documentation

We've created comprehensive documentation for you:

1. **[GRAPHQL_MIGRATION_GUIDE.md](./GRAPHQL_MIGRATION_GUIDE.md)**
   - Complete migration guide
   - Architecture overview
   - Best practices
   - Troubleshooting

2. **[GRAPHQL_HOOKS_REFERENCE.md](./GRAPHQL_HOOKS_REFERENCE.md)**
   - Quick reference for all hooks
   - Common patterns
   - Code snippets
   - Advanced usage

3. **[MIGRATION_EXAMPLE.md](./MIGRATION_EXAMPLE.md)**
   - Real-world migration example
   - Before/after comparison
   - Performance benefits

## 🎯 Key Benefits

### 🚀 Performance
- **Automatic caching** - Revisit a page? Instant load from cache
- **Request deduplication** - Same query called twice? Only one request
- **Background refetching** - Data stays fresh automatically
- **Smart garbage collection** - Unused data is cleaned up

### 🛠 Developer Experience
- **Type safety** - Full TypeScript support
- **DevTools** - Visual debugging of queries and cache
- **Less boilerplate** - No manual loading/error state management
- **Auto-refetch** - Mutations invalidate related queries automatically

### 🏗 Architecture
- **Separation of concerns** - GraphQL logic separated from components
- **Reusable hooks** - One hook, use everywhere
- **Centralized configuration** - Global cache settings
- **Easy testing** - Mock queries easily

## 🔧 Configuration

### Query Client Settings (`src/lib/react-query/client.ts`)

```typescript
{
  queries: {
    staleTime: 5 * 60 * 1000,      // 5 minutes
    gcTime: 10 * 60 * 1000,         // 10 minutes
    retry: 3,                        // Retry 3 times
    refetchOnWindowFocus: false,    // Don't refetch on focus
    refetchOnReconnect: true,       // Refetch on reconnect
  },
  mutations: {
    retry: 1,                        // Retry once
  }
}
```

You can customize these settings in `src/lib/react-query/client.ts`.

## 🎨 DevTools

React Query DevTools are included and show up in development mode.

**Features:**
- 🔍 View all active queries
- 💾 Inspect cached data
- 🔄 Force refetch queries
- ❌ Invalidate cache manually
- 📊 Monitor network activity

Look for the TanStack Query icon in the bottom corner of your app.

## 📁 File Structure

```
src/
├── lib/
│   ├── graphql/
│   │   ├── client.ts                    # GraphQL utilities
│   │   ├── hooks/
│   │   │   ├── useGraphQLQuery.ts      # Base query hook
│   │   │   └── useGraphQLMutation.ts   # Base mutation hook
│   │   └── index.ts
│   └── react-query/
│       ├── client.ts                    # Query client config
│       ├── provider.tsx                 # Provider component
│       └── index.ts
├── hooks/
│   ├── students/
│   │   ├── useGetListStudent.ts
│   │   ├── useGetStudentDetail.ts
│   │   ├── useCreateStudent.ts
│   │   ├── useJoinStudentToClass.ts
│   │   └── index.ts
│   ├── classes/
│   │   ├── useGetListClass.ts
│   │   ├── useGetClassById.ts
│   │   └── index.ts
│   ├── teachers/
│   │   ├── useGetListTeachers.ts
│   │   ├── useAddTeacherToClass.ts
│   │   └── index.ts
│   ├── grades/
│   │   ├── useGetAllGrades.ts
│   │   └── index.ts
│   └── index.ts                         # Export all hooks
└── pages/
    └── _app.tsx                         # ✅ Updated with provider
```

## 🔄 Next Steps

### Immediate
1. ✅ Start using the new hooks in your components
2. ✅ Remove old custom hooks as you migrate
3. ✅ Test with DevTools to see caching in action

### Soon
1. Add more hooks for remaining operations
2. Implement optimistic updates for better UX
3. Add prefetching for instant navigation
4. Configure cache persistence (optional)

### Advanced
1. Set up MSW for testing
2. Add error boundaries
3. Implement offline support
4. Add request/response interceptors

## 💡 Pro Tips

1. **Use query keys consistently** - Makes cache invalidation easier
2. **Leverage stale time** - Reduce unnecessary refetches
3. **Invalidate smartly** - Only invalidate what changed
4. **Prefetch on hover** - Better perceived performance
5. **Use DevTools** - Understand what's cached and why

## 🐛 Troubleshooting

### Query not updating?
- Check if stale time is too long
- Verify query invalidation in mutations
- Use `refetch()` for manual updates

### TypeScript errors?
- Ensure types are imported from `/src/models`
- Check that response structure matches types
- Use proper generic types in hooks

### DevTools not showing?
- Only available in development mode
- Check console for errors
- Try refreshing the page

## 📞 Need Help?

1. Check the [Migration Guide](./GRAPHQL_MIGRATION_GUIDE.md)
2. See [Hooks Reference](./GRAPHQL_HOOKS_REFERENCE.md)
3. Review [Migration Example](./MIGRATION_EXAMPLE.md)
4. Visit [TanStack Query Docs](https://tanstack.com/query/latest)

## ✨ What's Next?

Your GraphQL setup is now production-ready with:
- ✅ Automatic caching and refetching
- ✅ Type-safe hooks for all operations
- ✅ DevTools for debugging
- ✅ Optimized performance
- ✅ Better developer experience

Start migrating your components today and enjoy the benefits! 🚀

---

**Note:** The old hooks in `src/components/hooks/` are still available but deprecated. You can remove them once migration is complete.
