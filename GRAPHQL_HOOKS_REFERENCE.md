# GraphQL Hooks Quick Reference

## 📚 Student Hooks

### useGetListStudent
Fetch paginated list of students.

```typescript
import { useGetListStudent } from '@/hooks/students';

const { data, isLoading, error, refetch } = useGetListStudent({
  page: 1,
  limit: 10,
  order_by: 'id desc',
  where: { grade_id: 1 }  // optional filter
});

const students = data?.GetListStudent?.data || [];
const total = data?.GetListStudent?.total || 0;
```

**Returns:**
- `data.GetListStudent.data` - Array of students
- `data.GetListStudent.total` - Total count
- `isLoading` - Boolean (first load)
- `isFetching` - Boolean (any fetch)
- `error` - Error object
- `refetch()` - Function to manually refetch

---

### useGetStudentDetail
Fetch single student details.

```typescript
import { useGetStudentDetail } from '@/hooks/students';

const { data, isLoading } = useGetStudentDetail(studentId);

const student = data?.GetStudentDetail;
```

**Query Key:** `['student', studentId]`

---

### useCreateStudent
Create a new student.

```typescript
import { useCreateStudent } from '@/hooks/students';
import { useToast } from '@/hooks/use-toast';

const { toast } = useToast();

const { mutate: createStudent, isPending } = useCreateStudent({
  onSuccess: (data) => {
    toast({ title: 'Student created!', description: data.message });
    router.push('/students');
  },
  onError: (error) => {
    toast({ title: 'Error', description: error.message, variant: 'destructive' });
  }
});

// Use it
const handleSubmit = (formData: CreateStudentInput) => {
  createStudent({ input: formData });
};
```

**Auto-invalidates:** `['students']`

---

### useJoinStudentToClass
Join a student to a class.

```typescript
import { useJoinStudentToClass } from '@/hooks/students';

const { mutate: joinClass, isPending } = useJoinStudentToClass({
  onSuccess: (data) => {
    toast({ title: 'Success!', description: data.message });
  }
});

// Use it
joinClass({ student_id: 123, class_id: 456 });
```

**Auto-invalidates:** `['students']`, `['student', studentId]`, `['class', classId]`, `['classes']`

---

## 📘 Class Hooks

### useGetListClass
Fetch paginated list of classes.

```typescript
import { useGetListClass } from '@/hooks/classes';

const { data, isLoading, refetch } = useGetListClass({
  page: 1,
  limit: 10,
  order_by: 'class_id desc',
  where: { not_having_teacher: true }  // optional filter
});

const classes = data?.GetListClass?.data || [];
const total = data?.GetListClass?.total || 0;
```

---

### useGetClassById
Fetch single class details.

```typescript
import { useGetClassById } from '@/hooks/classes';

const { data, isLoading } = useGetClassById(classId);

const classDetail = data?.GetClassById;
const students = classDetail?.students || [];
const teacher = classDetail?.teacher;
```

**Query Key:** `['class', classId]`

---

## 👨‍🏫 Teacher Hooks

### useGetListTeachers
Fetch paginated list of teachers.

```typescript
import { useGetListTeachers } from '@/hooks/teachers';

const { data, isLoading } = useGetListTeachers({
  page: 1,
  limit: 10,
  order_by: 'name desc'
});

const teachers = data?.ListTeachers?.data || [];
const total = data?.ListTeachers?.total || 0;
```

---

### useAddTeacherToClass
Add a teacher to a class.

```typescript
import { useAddTeacherToClass } from '@/hooks/teachers';

const { mutate: addTeacher, isPending } = useAddTeacherToClass({
  onSuccess: (data) => {
    toast({ title: 'Teacher added!' });
  }
});

// Use it
addTeacher({ teacher_id: 123, class_id: 456 });
```

**Auto-invalidates:** `['teachers']`, `['teacher', teacherId]`, `['class', classId]`, `['classes']`

---

## 📊 Grade Hooks

### useGetAllGrades
Fetch all grades (heavily cached).

```typescript
import { useGetAllGrades } from '@/hooks/grades';

const { data, isLoading } = useGetAllGrades();

const grades = data?.ListAllGrades || [];
```

**Cache Duration:** 30 minutes

---

## 🛠 Advanced Usage

### Conditional Queries
```typescript
// Only fetch when studentId is valid
const { data } = useGetStudentDetail(studentId, {
  enabled: !!studentId && studentId > 0
});
```

### Manual Refetch
```typescript
const { data, refetch } = useGetListStudent({ page: 1, limit: 10 });

// Later...
await refetch();
```

### Access Query Client Directly
```typescript
import { queryClient } from '@/lib/react-query';

// Invalidate manually
queryClient.invalidateQueries({ queryKey: ['students'] });

// Get cached data
const cachedData = queryClient.getQueryData(['student', 123]);

// Set data manually
queryClient.setQueryData(['student', 123], newData);
```

### Prefetch Data
```typescript
import { queryClient } from '@/lib/react-query';
import { gql, graphqlRequest } from '@/lib/graphql';

// Prefetch on hover
const handleMouseEnter = () => {
  queryClient.prefetchQuery({
    queryKey: ['student', studentId],
    queryFn: () => graphqlRequest(GET_STUDENT_QUERY, { id: studentId })
  });
};
```

---

## 🎯 Common Patterns

### Loading States
```typescript
const { data, isLoading, isFetching } = useGetListStudent({ page: 1, limit: 10 });

if (isLoading) return <Skeleton />;  // First load
if (isFetching) return <div>Updating... <Spinner /></div>;  // Background fetch
```

### Error Handling
```typescript
const { data, error } = useGetListStudent({ page: 1, limit: 10 });

if (error) {
  return <Alert variant="destructive">{error.message}</Alert>;
}
```

### Pagination
```typescript
const [page, setPage] = useState(1);
const { data, isLoading } = useGetListStudent({ page, limit: 10 });

const handleNextPage = () => setPage(p => p + 1);
const handlePrevPage = () => setPage(p => Math.max(1, p - 1));
```

### Dependent Queries
```typescript
// First, get student detail
const { data: studentData } = useGetStudentDetail(studentId);

// Then, get class detail (only if student has a class)
const classId = studentData?.GetStudentDetail?.classes?.[0]?.class_id;
const { data: classData } = useGetClassById(classId, {
  enabled: !!classId  // Only fetch when we have a classId
});
```

### Mutation with Redirect
```typescript
const router = useRouter();

const { mutate: createStudent, isPending } = useCreateStudent({
  onSuccess: (data) => {
    toast({ title: 'Student created!' });
    router.push(`/students/${data.entity_id}`);
  }
});
```

### Mutation with Form Reset
```typescript
const form = useForm();

const { mutate: createStudent } = useCreateStudent({
  onSuccess: () => {
    toast({ title: 'Success!' });
    form.reset();  // Reset form after success
  }
});
```

---

## 🔑 Query Keys Reference

| Hook | Query Key |
|------|-----------|
| useGetListStudent | `['students', variables]` |
| useGetStudentDetail | `['student', studentId]` |
| useGetListClass | `['classes', variables]` |
| useGetClassById | `['class', classId]` |
| useGetListTeachers | `['teachers', variables]` |
| useGetAllGrades | `['grades']` |

---

## 🚀 Performance Tips

1. **Use appropriate stale times** - Longer for static data (grades), shorter for dynamic data (students)
2. **Invalidate smartly** - Only invalidate what changed
3. **Prefetch on hover** - Load data before user clicks
4. **Use pagination** - Don't load all data at once
5. **Leverage caching** - Same query keys return cached data instantly

---

## 📦 Import Paths

```typescript
// Hooks
import { useGetListStudent, useCreateStudent } from '@/hooks/students';
import { useGetListClass, useGetClassById } from '@/hooks/classes';
import { useGetListTeachers, useAddTeacherToClass } from '@/hooks/teachers';
import { useGetAllGrades } from '@/hooks/grades';

// Utilities
import { queryClient } from '@/lib/react-query';
import { gql, graphqlRequest } from '@/lib/graphql';

// Base hooks (for custom hooks)
import { useGraphQLQuery, useGraphQLQueryWithVariables } from '@/lib/graphql';
import { useGraphQLMutation, useGraphQLMutationWithUnwrap } from '@/lib/graphql';
```

---

## 🐛 Debugging

### Enable DevTools
DevTools are automatically enabled in development. Look for the TanStack Query icon in the bottom corner.

### Check Query Status
```typescript
const query = useGetListStudent({ page: 1, limit: 10 });

console.log({
  isLoading: query.isLoading,
  isFetching: query.isFetching,
  isError: query.isError,
  isSuccess: query.isSuccess,
  status: query.status,
  fetchStatus: query.fetchStatus,
});
```

### Monitor Cache
```typescript
import { queryClient } from '@/lib/react-query';

// Get all queries
console.log(queryClient.getQueryCache().getAll());

// Get specific query
console.log(queryClient.getQueryState(['student', 123]));
```

---

Need more help? Check the [full migration guide](./GRAPHQL_MIGRATION_GUIDE.md) or [TanStack Query docs](https://tanstack.com/query/latest/docs/react/overview).
