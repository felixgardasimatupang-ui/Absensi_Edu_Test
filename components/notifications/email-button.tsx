'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Mail, ChevronDown } from 'lucide-react'
import { ADMIN_CONTACT } from '@/lib/constants'

interface EmailButtonProps {
  email?: string
  subject?: string
  body?: string
  variant?: 'default' | 'outline' | 'ghost' | 'secondary'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  children?: React.ReactNode
}

export function EmailButton({
  email = ADMIN_CONTACT.email,
  subject = '',
  body = '',
  variant = 'outline',
  size = 'default',
  className,
  children
}: EmailButtonProps) {
  const handleClick = () => {
    const params = new URLSearchParams()
    if (subject) params.set('subject', subject)
    if (body) params.set('body', body)

    const queryString = params.toString()
    const url = `mailto:${email}${queryString ? `?${queryString}` : ''}`
    window.location.href = url
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={className}
    >
      <Mail className="w-4 h-4 mr-2" />
      {children || 'Email'}
    </Button>
  )
}

interface EmailDropdownProps {
  contacts: Array<{
    name: string
    email: string
    role?: string
  }>
  subject?: string
  body?: string
  variant?: 'default' | 'outline' | 'ghost' | 'secondary'
  size?: 'default' | 'sm' | 'lg'
}

export function EmailDropdown({
  contacts,
  subject = '',
  body = '',
  variant = 'outline',
  size = 'default'
}: EmailDropdownProps) {
  const handleContact = (email: string) => {
    const params = new URLSearchParams()
    if (subject) params.set('subject', subject)
    if (body) params.set('body', body)

    const queryString = params.toString()
    const url = `mailto:${email}${queryString ? `?${queryString}` : ''}`
    window.location.href = url
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size}>
          <Mail className="w-4 h-4 mr-2" />
          Kirim Email
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {contacts.map((contact, index) => (
          <DropdownMenuItem
            key={index}
            onClick={() => handleContact(contact.email)}
            className="cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Mail className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">{contact.name}</p>
                {contact.role && (
                  <p className="text-xs text-muted-foreground">{contact.role}</p>
                )}
              </div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Quick email admin button
export function EmailAdminButton({ 
  subject = 'Pertanyaan dari Aplikasi Bimbel',
  body = '' 
}: { 
  subject?: string
  body?: string 
}) {
  return (
    <EmailButton
      email={ADMIN_CONTACT.email}
      subject={subject}
      body={body}
      variant="outline"
    >
      Email Admin
    </EmailButton>
  )
}
