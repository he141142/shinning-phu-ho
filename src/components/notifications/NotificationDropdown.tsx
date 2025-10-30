'use client'

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, Check, CheckCheck, X, Trash2, Settings, AlertCircle, CheckCircle, Info, XCircle, MessageSquare, Loader2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/drake_libs/ui/avatar"
import { Button } from "@/components/drake_libs/ui/button"
import { Separator } from "@/components/drake_libs/ui/separator"
import { Badge } from "@/components/drake_libs/ui/badge"
import { ScrollArea } from "@/components/drake_libs/ui/scroll-area"
import type { Notification, NotificationType } from "@/models/notifications"
import { formatDistanceToNow } from "date-fns"

interface NotificationDropdownProps {
  isOpen: boolean
  onClose: () => void
  notifications: Notification[]
  unreadCount: number
  hasMore: boolean
  isLoading: boolean
  onLoadMore: () => void
  onMarkAsRead: (id: string) => void
  onMarkAllAsRead: () => void
  onDelete: (id: string) => void
}

const notificationIcons: Record<NotificationType, any> = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
  message: MessageSquare,
  system: Bell,
}

const notificationColors: Record<NotificationType, { bg: string; text: string; icon: string }> = {
  success: { bg: "bg-green-100 dark:bg-green-900/20", text: "text-green-600 dark:text-green-400", icon: "text-green-600 dark:text-green-400" },
  error: { bg: "bg-red-100 dark:bg-red-900/20", text: "text-red-600 dark:text-red-400", icon: "text-red-600 dark:text-red-400" },
  warning: { bg: "bg-orange-100 dark:bg-orange-900/20", text: "text-orange-600 dark:text-orange-400", icon: "text-orange-600 dark:text-orange-400" },
  info: { bg: "bg-blue-100 dark:bg-blue-900/20", text: "text-blue-600 dark:text-blue-400", icon: "text-blue-600 dark:text-blue-400" },
  message: { bg: "bg-purple-100 dark:bg-purple-900/20", text: "text-purple-600 dark:text-purple-400", icon: "text-purple-600 dark:text-purple-400" },
  system: { bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-600 dark:text-gray-400", icon: "text-gray-600 dark:text-gray-400" },
}

export function NotificationDropdown({
  isOpen,
  onClose,
  notifications,
  unreadCount,
  hasMore,
  isLoading,
  onLoadMore,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
}: NotificationDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (!scrollRef.current || !hasMore || isLoading) return

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
    if (scrollHeight - scrollTop <= clientHeight * 1.5) {
      onLoadMore()
    }
  }, [hasMore, isLoading, onLoadMore])

  const filteredNotifications = filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications

  const formatTime = (date: Date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true })
    } catch {
      return 'Recently'
    }
  }

  const getNotificationIcon = (notification: Notification) => {
    const IconComponent = notificationIcons[notification.type]
    const colors = notificationColors[notification.type]
    return <IconComponent className={`w-4 h-4 ${colors.icon}`} />
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Dropdown */}
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="fixed right-4 top-20 z-50 w-full max-w-md"
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                      <Bell className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Notifications</h3>
                      {unreadCount > 0 && (
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {unreadCount} unread
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      filter === 'all'
                        ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilter('unread')}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                      filter === 'unread'
                        ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50'
                    }`}
                  >
                    Unread
                    {unreadCount > 0 && (
                      <Badge className="bg-red-500 text-white text-xs px-1.5 py-0.5">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </Badge>
                    )}
                  </button>
                </div>
              </div>

              {/* Actions Bar */}
              {unreadCount > 0 && (
                <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                  <button
                    onClick={onMarkAllAsRead}
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors"
                  >
                    <CheckCheck className="w-4 h-4" />
                    Mark all as read
                  </button>
                </div>
              )}

              {/* Notifications List */}
              <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
              >
                {filteredNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-4">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
                      <Bell className="w-8 h-8 text-gray-400 dark:text-gray-600" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                      {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                    </p>
                    <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                      {filter === 'unread' ? "You're all caught up!" : 'Check back later for updates'}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    <AnimatePresence mode="popLayout">
                      {filteredNotifications.map((notification, index) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          transition={{ delay: index * 0.05 }}
                          className={`group relative p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all cursor-pointer ${
                            !notification.read ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''
                          }`}
                          onClick={() => !notification.read && onMarkAsRead(notification.id)}
                        >
                          {/* Unread indicator */}
                          {!notification.read && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-purple-500"></div>
                          )}

                          <div className="flex gap-3">
                            {/* Avatar/Icon */}
                            <div className="flex-shrink-0">
                              {notification.avatar ? (
                                <Avatar className="w-10 h-10 border-2 border-white dark:border-gray-800 shadow-sm">
                                  <AvatarImage src={notification.avatar} />
                                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-sm">
                                    {notification.title.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                              ) : (
                                <div className={`w-10 h-10 rounded-full ${notificationColors[notification.type].bg} flex items-center justify-center shadow-sm`}>
                                  {getNotificationIcon(notification)}
                                </div>
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <h4 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">
                                  {notification.title}
                                </h4>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0 mt-1"></div>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500 dark:text-gray-500">
                                  {formatTime(notification.timestamp)}
                                </span>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  {!notification.read && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        onMarkAsRead(notification.id)
                                      }}
                                      className="p-1.5 hover:bg-green-100 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                      title="Mark as read"
                                    >
                                      <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                                    </button>
                                  )}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      onDelete(notification.id)
                                    }}
                                    className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}

                {/* Loading More Indicator */}
                {isLoading && hasMore && (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-5 h-5 animate-spin text-indigo-600 dark:text-indigo-400" />
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Loading more...</span>
                  </div>
                )}

                {/* End of List */}
                {!hasMore && notifications.length > 0 && (
                  <div className="text-center py-4 text-xs text-gray-400 dark:text-gray-600">
                    You've reached the end
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
                <button className="w-full px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors flex items-center justify-center gap-2">
                  <Settings className="w-4 h-4" />
                  Notification Settings
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
