import { useState, useCallback, useEffect } from 'react'
import type { Notification, NotificationResponse, GetNotificationsInput } from '@/models/notifications'

// Mock notification data generator
const generateMockNotifications = (page: number, limit: number): Notification[] => {
  const types: Array<Notification['type']> = ['info', 'success', 'warning', 'error', 'message', 'system']
  const titles = [
    'New student enrolled',
    'Class schedule updated',
    'Assignment submitted',
    'Grade posted',
    'Payment received',
    'New message received',
    'System maintenance scheduled',
    'Profile updated successfully',
    'New teacher joined',
    'Attendance marked',
    'Document uploaded',
    'Reminder: Class starts soon',
    'Feedback received',
    'Certificate generated',
    'Course completed',
  ]

  const messages = [
    'A new student has been enrolled in your class.',
    'The schedule for Mathematics 101 has been updated.',
    'John Doe submitted the final project assignment.',
    'Your grade for Physics Quiz 3 has been posted.',
    'Payment of $500 has been received for Spring semester.',
    'You have a new message from Sarah Johnson.',
    'System maintenance is scheduled for tonight at 2 AM.',
    'Your profile information has been updated successfully.',
    'Dr. Emily Chen has joined the faculty.',
    'Attendance has been marked for today\'s class.',
    'New study material has been uploaded to the library.',
    'Your class "Introduction to Biology" starts in 30 minutes.',
    'You received feedback on your recent assignment.',
    'Your completion certificate is ready to download.',
    'Congratulations! You have completed the Data Science course.',
  ]

  const avatars = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    null,
  ]

  const startIndex = (page - 1) * limit
  const notifications: Notification[] = []

  for (let i = 0; i < limit; i++) {
    const index = startIndex + i
    if (index >= 50) break // Total mock data limit

    const type = types[index % types.length]
    const titleIndex = index % titles.length
    const messageIndex = index % messages.length
    const avatarIndex = index % avatars.length

    // Make some notifications read, some unread
    const isRead = index % 3 === 0

    // Generate timestamps with varying recency
    const hoursAgo = index < 5 ? index : index < 15 ? index * 2 : index * 4
    const timestamp = new Date(Date.now() - hoursAgo * 60 * 60 * 1000)

    notifications.push({
      id: `notif-${index + 1}`,
      type,
      title: titles[titleIndex],
      message: messages[messageIndex],
      timestamp,
      read: isRead,
      avatar: avatars[avatarIndex],
      actionUrl: `/notification/${index + 1}`,
      metadata: {
        userId: Math.floor(Math.random() * 1000),
        entityId: Math.floor(Math.random() * 100),
        entityType: ['class', 'student', 'teacher', 'assignment'][Math.floor(Math.random() * 4)],
      },
    })
  }

  return notifications
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const limit = 10

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length

  // Initial load
  useEffect(() => {
    loadNotifications(1)
  }, [])

  const loadNotifications = useCallback(async (pageNum: number) => {
    setIsLoading(true)

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))

    const newNotifications = generateMockNotifications(pageNum, limit)

    if (pageNum === 1) {
      setNotifications(newNotifications)
    } else {
      setNotifications(prev => [...prev, ...newNotifications])
    }

    // Check if there are more notifications
    setHasMore(newNotifications.length === limit && pageNum < 5) // Max 5 pages
    setPage(pageNum)
    setIsLoading(false)
  }, [limit])

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      loadNotifications(page + 1)
    }
  }, [page, isLoading, hasMore, loadNotifications])

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    )
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }, [])

  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const refresh = useCallback(() => {
    setPage(1)
    setHasMore(true)
    loadNotifications(1)
  }, [loadNotifications])

  return {
    notifications,
    unreadCount,
    hasMore,
    isLoading,
    loadMore,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh,
  }
}
