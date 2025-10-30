'use client'

import { useState } from 'react'
import { Bell, Sparkles } from 'lucide-react'
import { Button } from '@/components/drake_libs/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/drake_libs/ui/card'
import { Badge } from '@/components/drake_libs/ui/badge'

/**
 * Demo component to showcase the notification system features
 * This can be used on a demo/documentation page
 */
export function NotificationDemo() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-6xl">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 px-4 py-2 rounded-full mb-4">
          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
            New Feature
          </span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Notification System
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          A beautiful, modern notification system with smooth animations, lazy loading, and intelligent filtering.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {/* Feature Cards */}
        <Card className="border-2 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all hover:shadow-lg">
          <CardHeader>
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-3">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-xl">Real-time Updates</CardTitle>
            <CardDescription>
              Get instant notifications for important events and updates
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-2 hover:border-purple-300 dark:hover:border-purple-700 transition-all hover:shadow-lg">
          <CardHeader>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <CardTitle className="text-xl">Lazy Loading</CardTitle>
            <CardDescription>
              Infinite scroll with automatic pagination for better performance
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-2 hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:shadow-lg">
          <CardHeader>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <CardTitle className="text-xl">Smart Filtering</CardTitle>
            <CardDescription>
              Filter between all notifications or just unread ones
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-2 hover:border-green-300 dark:hover:border-green-700 transition-all hover:shadow-lg">
          <CardHeader>
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <CardTitle className="text-xl">Bulk Actions</CardTitle>
            <CardDescription>
              Mark all as read or delete notifications with one click
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-2 hover:border-orange-300 dark:hover:border-orange-700 transition-all hover:shadow-lg">
          <CardHeader>
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </div>
            <CardTitle className="text-xl">Dark Mode</CardTitle>
            <CardDescription>
              Fully compatible with light and dark themes
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-2 hover:border-pink-300 dark:hover:border-pink-700 transition-all hover:shadow-lg">
          <CardHeader>
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center mb-3">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-xl">Smooth Animations</CardTitle>
            <CardDescription>
              Beautiful transitions powered by Framer Motion
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Notification Types */}
      <Card className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border-2">
        <CardHeader>
          <CardTitle className="text-2xl">Notification Types</CardTitle>
          <CardDescription>
            Different types of notifications with unique styling
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Info</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">General information</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Success</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Success messages</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Warning</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Warning alerts</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Error</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Error notifications</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Message</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Direct messages</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">System</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">System notifications</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Instructions */}
      <div className="mt-12 text-center">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-shadow">
          <Bell className="w-5 h-5" />
          <span className="font-semibold">Click the bell icon in the navbar to see it in action!</span>
        </div>
      </div>
    </div>
  )
}
