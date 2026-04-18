'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Notification, NotificationType } from '@/lib/types'
import {
  getNotificationsByUser,
  getUnreadNotifications,
  addNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  generateId
} from '@/lib/store'
import { ADMIN_CONTACT, WA_TEMPLATES, EMAIL_TEMPLATES } from '@/lib/constants'

interface UseNotificationsReturn {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  refresh: () => void
  createNotification: (params: CreateNotificationParams) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  sendWhatsApp: (phone: string, message: string) => void
  sendEmail: (email: string, subject: string, body: string) => void
  notifyAdmin: (message: string) => void
  notifyParent: (phone: string, email: string, message: string, type: 'whatsapp' | 'email' | 'both') => void
}

interface CreateNotificationParams {
  userId: string
  type: NotificationType
  title: string
  message: string
  data?: Record<string, unknown>
}

export function useNotifications(userId: string | null): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const refresh = useCallback(() => {
    if (!userId) {
      setNotifications([])
      setIsLoading(false)
      return
    }
    
    const userNotifications = getNotificationsByUser(userId)
    setNotifications(userNotifications.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ))
    setIsLoading(false)
  }, [userId])

  useEffect(() => {
    refresh()
  }, [refresh])

  const unreadCount = userId ? getUnreadNotifications(userId).length : 0

  const createNotification = useCallback((params: CreateNotificationParams) => {
    const notification: Notification = {
      id: generateId(),
      userId: params.userId,
      type: params.type,
      title: params.title,
      message: params.message,
      read: false,
      data: params.data,
      createdAt: new Date().toISOString()
    }
    addNotification(notification)
    refresh()
  }, [refresh])

  const markAsRead = useCallback((id: string) => {
    markNotificationAsRead(id)
    refresh()
  }, [refresh])

  const markAllAsRead = useCallback(() => {
    if (!userId) return
    markAllNotificationsAsRead(userId)
    refresh()
  }, [userId, refresh])

  // WhatsApp integration
  const sendWhatsApp = useCallback((phone: string, message: string) => {
    // Format phone number (remove leading 0, add country code if needed)
    let formattedPhone = phone.replace(/\D/g, '')
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '62' + formattedPhone.slice(1)
    }
    
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')
  }, [])

  // Email integration
  const sendEmail = useCallback((email: string, subject: string, body: string) => {
    const encodedSubject = encodeURIComponent(subject)
    const encodedBody = encodeURIComponent(body)
    const mailtoUrl = `mailto:${email}?subject=${encodedSubject}&body=${encodedBody}`
    window.location.href = mailtoUrl
  }, [])

  // Notify admin via WhatsApp
  const notifyAdmin = useCallback((message: string) => {
    sendWhatsApp(ADMIN_CONTACT.phone, message)
  }, [sendWhatsApp])

  // Notify parent via WhatsApp, Email, or both
  const notifyParent = useCallback((
    phone: string,
    email: string,
    message: string,
    type: 'whatsapp' | 'email' | 'both'
  ) => {
    if (type === 'whatsapp' || type === 'both') {
      sendWhatsApp(phone, message)
    }
    if (type === 'email' || type === 'both') {
      sendEmail(email, 'Pemberitahuan dari Bimbel Cerdas', message)
    }
  }, [sendWhatsApp, sendEmail])

  return {
    notifications,
    unreadCount,
    isLoading,
    refresh,
    createNotification,
    markAsRead,
    markAllAsRead,
    sendWhatsApp,
    sendEmail,
    notifyAdmin,
    notifyParent
  }
}

// Export templates for use in components
export { WA_TEMPLATES, EMAIL_TEMPLATES }
