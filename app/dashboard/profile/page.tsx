'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Edit,
  Check
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { getStudents, getTutors, getAttendanceByStudent, getStarRatings } from '@/lib/store'
import { format } from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import { toast } from 'sonner'

export default function ProfilePage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  })

  if (!user) return null

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  }

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin: 'Administrator',
      tutor: 'Tutor / Pengajar',
      student: 'Siswa',
      parent: 'Orang Tua'
    }
    return labels[role] || role
  }

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: 'bg-primary text-primary-foreground',
      tutor: 'bg-emerald-500 text-white',
      student: 'bg-amber-500 text-white',
      parent: 'bg-purple-500 text-white'
    }
    return colors[role] || 'bg-muted'
  }

  const handleSave = () => {
    toast.success('Profil berhasil diperbarui')
    setIsEditing(false)
  }

  // Get additional info based on role
  const getAdditionalInfo = () => {
    if (user.role === 'student') {
      const students = getStudents()
      const student = students.find(s => s.userId === user.id)
      if (student) {
        const attendance = getAttendanceByStudent(student.id)
        const ratings = getStarRatings().filter(r => r.studentId === student.id)
        const avgRating = ratings.length > 0
          ? (ratings.reduce((acc, r) => acc + (r.keaktifan + r.pemahaman + r.sikap) / 3, 0) / ratings.length).toFixed(1)
          : '-'
        const attendanceRate = attendance.length > 0
          ? Math.round((attendance.filter(a => a.status === 'present' || a.status === 'late').length / attendance.length) * 100)
          : 0

        return {
          grade: student.grade,
          attendanceRate: `${attendanceRate}%`,
          avgRating,
          totalSessions: attendance.length
        }
      }
    }

    if (user.role === 'tutor') {
      const tutors = getTutors()
      const tutor = tutors.find(t => t.userId === user.id)
      if (tutor) {
        return {
          subjects: tutor.subjects.join(', '),
          totalClasses: tutor.subjects.length
        }
      }
    }

    return null
  }

  const additionalInfo = getAdditionalInfo()

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <User className="w-7 h-7 text-primary" />
          Profil Saya
        </h1>
        <p className="text-muted-foreground">Kelola informasi profil Anda</p>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-muted-foreground">{user.email}</p>
                <Badge className={`mt-2 ${getRoleColor(user.role)}`}>
                  <Shield className="w-3 h-3 mr-1" />
                  {getRoleLabel(user.role)}
                </Badge>
              </div>
            </div>
            <Button
              variant={isEditing ? 'default' : 'outline'}
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            >
              {isEditing ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Simpan
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Separator />
          
          {/* Basic Info */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Nama Lengkap
              </Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              ) : (
                <p className="text-sm py-2">{user.name}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              ) : (
                <p className="text-sm py-2">{user.email}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                No. Telepon
              </Label>
              {isEditing ? (
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              ) : (
                <p className="text-sm py-2">{user.phone || '-'}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Tanggal Bergabung
              </Label>
              <p className="text-sm py-2">
                {format(new Date(user.createdAt), 'd MMMM yyyy', { locale: localeId })}
              </p>
            </div>
          </div>

          {/* Role-specific Info */}
          {additionalInfo && (
            <>
              <Separator />
              <div>
                <h3 className="font-medium mb-4">Informasi Tambahan</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {user.role === 'student' && (
                    <>
                      <Card>
                        <CardContent className="pt-4">
                          <p className="text-sm text-muted-foreground">Kelas</p>
                          <p className="text-lg font-semibold">{additionalInfo.grade}</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-4">
                          <p className="text-sm text-muted-foreground">Tingkat Kehadiran</p>
                          <p className="text-lg font-semibold">{additionalInfo.attendanceRate}</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-4">
                          <p className="text-sm text-muted-foreground">Rating Rata-rata</p>
                          <p className="text-lg font-semibold">{additionalInfo.avgRating}/5</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-4">
                          <p className="text-sm text-muted-foreground">Total Sesi</p>
                          <p className="text-lg font-semibold">{additionalInfo.totalSessions}</p>
                        </CardContent>
                      </Card>
                    </>
                  )}
                  {user.role === 'tutor' && (
                    <>
                      <Card className="sm:col-span-2">
                        <CardContent className="pt-4">
                          <p className="text-sm text-muted-foreground">Mata Pelajaran</p>
                          <p className="text-lg font-semibold">{additionalInfo.subjects || '-'}</p>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
