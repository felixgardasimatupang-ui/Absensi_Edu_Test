'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { MessageCircle, Phone, ChevronDown } from 'lucide-react'
import { ADMIN_CONTACT } from '@/lib/constants'

interface WhatsAppButtonProps {
  phone?: string
  message?: string
  variant?: 'default' | 'outline' | 'ghost' | 'secondary'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  children?: React.ReactNode
}

export function WhatsAppButton({
  phone = ADMIN_CONTACT.phone,
  message = '',
  variant = 'default',
  size = 'default',
  className,
  children
}: WhatsAppButtonProps) {
  const handleClick = () => {
    // Format phone number
    let formattedPhone = phone.replace(/\D/g, '')
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '62' + formattedPhone.slice(1)
    }

    const encodedMessage = encodeURIComponent(message)
    const url = `https://wa.me/${formattedPhone}${message ? `?text=${encodedMessage}` : ''}`
    window.open(url, '_blank')
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={className}
    >
      <MessageCircle className="w-4 h-4 mr-2" />
      {children || 'WhatsApp'}
    </Button>
  )
}

interface WhatsAppDropdownProps {
  contacts: Array<{
    name: string
    phone: string
    role?: string
  }>
  message?: string
  variant?: 'default' | 'outline' | 'ghost' | 'secondary'
  size?: 'default' | 'sm' | 'lg'
}

export function WhatsAppDropdown({
  contacts,
  message = '',
  variant = 'outline',
  size = 'default'
}: WhatsAppDropdownProps) {
  const handleContact = (phone: string) => {
    let formattedPhone = phone.replace(/\D/g, '')
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '62' + formattedPhone.slice(1)
    }

    const encodedMessage = encodeURIComponent(message)
    const url = `https://wa.me/${formattedPhone}${message ? `?text=${encodedMessage}` : ''}`
    window.open(url, '_blank')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size}>
          <MessageCircle className="w-4 h-4 mr-2" />
          Hubungi via WhatsApp
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {contacts.map((contact, index) => (
          <DropdownMenuItem
            key={index}
            onClick={() => handleContact(contact.phone)}
            className="cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <Phone className="w-4 h-4 text-emerald-600" />
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

// Quick contact admin button
export function ContactAdminButton({ message = '' }: { message?: string }) {
  return (
    <WhatsAppButton
      phone={ADMIN_CONTACT.phone}
      message={message || `Halo Admin ${ADMIN_CONTACT.name}, saya ingin bertanya tentang...`}
      variant="outline"
    >
      Hubungi Admin
    </WhatsAppButton>
  )
}
