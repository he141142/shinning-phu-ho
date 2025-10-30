# 🔔 Notification System Documentation

## Overview

A modern, feature-rich notification system with stunning animations, lazy loading, and a polished UI that integrates seamlessly with your application.

## ✨ Features

### Core Features
- **Real-time Notifications** - Display system, user, and activity notifications
- **Unread Count Badge** - Animated badge showing unread notification count
- **Smart Filtering** - Toggle between "All" and "Unread" notifications
- **Mark as Read** - Individual or bulk mark as read functionality
- **Delete Notifications** - Remove individual notifications
- **Lazy Loading** - Infinite scroll with automatic loading of more notifications
- **Mock Data** - 50 pre-generated mock notifications for testing

### UI/UX Features
- **Smooth Animations** - Powered by Framer Motion for delightful interactions
- **Dark Mode Support** - Full dark mode compatibility
- **Responsive Design** - Works perfectly on all screen sizes
- **Type-based Styling** - Different colors and icons for notification types
- **Relative Timestamps** - Human-readable time formats (e.g., "2 hours ago")
- **Empty States** - Beautiful empty state designs
- **Loading States** - Smooth loading indicators
- **Backdrop Blur** - Modern glassmorphism effects

### Notification Types
- 🔵 **Info** - General information
- ✅ **Success** - Success messages
- ⚠️ **Warning** - Warning alerts
- ❌ **Error** - Error notifications
- 💬 **Message** - Direct messages
- 🔔 **System** - System notifications

## 📁 File Structure

```
src/
├── components/
│   └── notifications/
│       ├── NotificationDropdown.tsx   # Main notification dropdown component
│       └── index.ts                   # Export file
├── hooks/
│   └── notifications/
│       ├── useNotifications.ts        # Notification hook with mock data
│       └── index.ts                   # Export file
└── models/
    └── notifications/
        └── index.ts                   # TypeScript types and interfaces
```

## 🚀 Usage

The notification system is already integrated into the main layout header:

```tsx
// src/components/layouts/index.tsx
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown"
import { useNotifications } from "@/hooks/notifications/useNotifications"

function Layout() {
  const {
    notifications,
    unreadCount,
    hasMore,
    isLoading,
    loadMore,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications()

  return (
    <NotificationDropdown
      isOpen={isNotificationOpen}
      onClose={() => setIsNotificationOpen(false)}
      notifications={notifications}
      unreadCount={unreadCount}
      hasMore={hasMore}
      isLoading={isLoading}
      onLoadMore={loadMore}
      onMarkAsRead={markAsRead}
      onMarkAllAsRead={markAllAsRead}
      onDelete={deleteNotification}
    />
  )
}
```

## 🎨 Customization

### Adding New Notification Types

Edit `src/models/notifications/index.ts`:

```typescript
export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'message' | 'system' | 'custom'
```

Then update the icon and color mappings in `NotificationDropdown.tsx`:

```typescript
const notificationIcons: Record<NotificationType, any> = {
  // ... existing types
  custom: YourCustomIcon,
}

const notificationColors: Record<NotificationType, { bg: string; text: string; icon: string }> = {
  // ... existing types
  custom: {
    bg: "bg-custom-100 dark:bg-custom-900/20",
    text: "text-custom-600 dark:text-custom-400",
    icon: "text-custom-600 dark:text-custom-400"
  },
}
```

### Connecting to Real API

Replace the mock hook with a real API implementation:

```typescript
// src/hooks/notifications/useNotifications.ts
export function useNotifications() {
  // Replace mock data generator with:
  const { data, isLoading, mutate } = useSWR('/api/notifications')

  // Or use React Query:
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications
  })

  // ... rest of the implementation
}
```

## 🎯 Key Components

### NotificationDropdown Component

**Props:**
- `isOpen: boolean` - Controls dropdown visibility
- `onClose: () => void` - Callback when dropdown closes
- `notifications: Notification[]` - Array of notifications
- `unreadCount: number` - Count of unread notifications
- `hasMore: boolean` - Whether more notifications are available
- `isLoading: boolean` - Loading state for pagination
- `onLoadMore: () => void` - Callback to load more notifications
- `onMarkAsRead: (id: string) => void` - Mark single notification as read
- `onMarkAllAsRead: () => void` - Mark all notifications as read
- `onDelete: (id: string) => void` - Delete a notification

### useNotifications Hook

**Returns:**
- `notifications: Notification[]` - Current loaded notifications
- `unreadCount: number` - Number of unread notifications
- `hasMore: boolean` - If more notifications are available
- `isLoading: boolean` - Loading state
- `loadMore: () => void` - Load next page
- `markAsRead: (id: string) => void` - Mark as read
- `markAllAsRead: () => void` - Mark all as read
- `deleteNotification: (id: string) => void` - Delete notification
- `refresh: () => void` - Refresh notifications

## 📊 Data Structure

```typescript
interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: Date
  read: boolean
  avatar?: string           // Optional avatar URL
  icon?: string            // Optional custom icon
  actionUrl?: string       // Optional action URL
  metadata?: {             // Optional metadata
    userId?: number
    entityId?: number
    entityType?: string
  }
}
```

## 🎭 Animation Details

The notification system uses Framer Motion for smooth animations:

- **Dropdown Enter/Exit** - Scale and fade animation
- **Backdrop** - Fade animation with blur
- **Notification Items** - Staggered entry animation
- **Delete Animation** - Slide out animation
- **Badge Pulse** - Continuous pulse for unread indicator

## 🌈 Styling

The component uses:
- **Tailwind CSS** for utility-first styling
- **CSS Variables** for theme colors
- **Dark Mode** via class-based dark mode
- **Gradient Accents** for visual hierarchy
- **Backdrop Blur** for modern glassmorphism

## 🔧 Performance

- **Lazy Loading** - Only loads 10 notifications at a time
- **Virtual Scrolling** - Efficient rendering of large lists
- **Memoization** - Prevents unnecessary re-renders
- **Debounced Scroll** - Optimized infinite scroll
- **Conditional Rendering** - Smart component mounting

## 📱 Responsive Design

- **Desktop** - Full-width dropdown (max-w-md)
- **Tablet** - Adjusted positioning
- **Mobile** - Full-screen overlay option
- **Touch-friendly** - Large tap targets

## 🎨 Visual Features

### Badge Indicators
- Red pulsing dot for unread notifications
- Count badge showing unread count
- Active state styling when dropdown is open

### Type-based Styling
Each notification type has unique colors:
- Success: Green
- Error: Red
- Warning: Orange
- Info: Blue
- Message: Purple
- System: Gray

### Interactive States
- Hover effects on notifications
- Button hover states
- Active/focus states
- Loading states
- Empty states

## 🚦 Next Steps

To connect to a real backend:

1. **Create API endpoints**:
   - `GET /api/notifications?page=1&limit=10`
   - `PATCH /api/notifications/:id/read`
   - `PATCH /api/notifications/mark-all-read`
   - `DELETE /api/notifications/:id`

2. **Replace mock hook with GraphQL/REST queries**

3. **Add WebSocket support for real-time notifications**

4. **Implement notification preferences/settings**

5. **Add notification sound effects**

6. **Implement push notifications**

## 📝 Notes

- Current implementation uses **50 mock notifications** across **5 pages**
- Pagination loads **10 notifications per page**
- Simulated API delay of **800ms** for realistic behavior
- All notifications are client-side (no persistence)

## 🎉 Credits

Built with:
- React & Next.js
- TypeScript
- Tailwind CSS
- Framer Motion
- Radix UI
- Lucide Icons
- date-fns

---

**Enjoy your beautiful notification system!** 🚀✨
