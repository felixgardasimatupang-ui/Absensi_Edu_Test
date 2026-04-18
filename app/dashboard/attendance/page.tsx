'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { QRGenerator } from '@/components/attendance/qr-generator'
import { LocationVerifier } from '@/components/attendance/location-verifier'
import { WhatsAppButton } from '@/components/notifications/whatsapp-button'
import {
  QrCode,
  MapPin,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import {
  getClasses,
  getSessions,
  getAttendanceRecords,
  getStudents,
  getTutors
} from '@/lib/store'
import { ATTENDANCE_STATUS_LABELS, ATTENDANCE_STATUS_COLORS, WA_TEMPLATES } from '@/lib/constants'
import type { AttendanceSession, Class, AttendanceRecord, Student } from '@/lib/types'
import { format } from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import { toast } from 'sonner'

export default function AttendancePage() {
  const { user } = useAuth()
  const [classes, setClasses] = useState<Class[]>([])
  const [sessions, setSessions] = useState<AttendanceSession[]>([])
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [selectedSession, setSelectedSession] = useState<AttendanceSession | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const allClasses = getClasses()
    const allSessions = getSessions()
    const allAttendance = getAttendanceRecords()
    const allStudents = getStudents()

    // Filter based on user role
    if (user?.role === 'tutor') {
      setClasses(allClasses.filter(c => c.tutorId === user.id))
      setSessions(allSessions.filter(s => s.tutorId === user.id))
    } else {
      setClasses(allClasses)
      setSessions(allSessions)
    }

    setAttendance(allAttendance)
    setStudents(allStudents)
  }

  const handleSessionCreated = (session: AttendanceSession) => {
    setSessions(prev => [session, ...prev])
    setSelectedSession(session)
    toast.success('Sesi absensi berhasil dibuat!')
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />
      case 'late': return <AlertCircle className="w-4 h-4 text-amber-500" />
      case 'absent': return <XCircle className="w-4 h-4 text-red-500" />
      default: return <Clock className="w-4 h-4 text-blue-500" />
    }
  }

  const todaySessions = sessions.filter(s => s.date === new Date().toISOString().split('T')[0])
  const activeSessions = sessions.filter(s => s.status === 'active')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Absensi</h1>
        <p className="text-muted-foreground">Kelola absensi dengan QR Code dan verifikasi lokasi</p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <QrCode className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeSessions.length}</p>
                <p className="text-sm text-muted-foreground">Sesi Aktif</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{todaySessions.length}</p>
                <p className="text-sm text-muted-foreground">Sesi Hari Ini</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {attendance.filter(a => a.createdAt.startsWith(new Date().toISOString().split('T')[0])).length}
                </p>
                <p className="text-sm text-muted-foreground">Absensi Hari Ini</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="generate" className="space-y-4">
        <TabsList>
          <TabsTrigger value="generate">Generate QR</TabsTrigger>
          <TabsTrigger value="sessions">Sesi Absensi</TabsTrigger>
          <TabsTrigger value="records">Rekap Absensi</TabsTrigger>
        </TabsList>

        {/* Generate QR Tab */}
        <TabsContent value="generate" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <QRGenerator
              classes={classes}
              tutorId={user?.id || ''}
              onSessionCreated={handleSessionCreated}
            />
            <LocationVerifier />
          </div>
        </TabsContent>

        {/* Sessions Tab */}
        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <CardTitle>Sesi Absensi</CardTitle>
              <CardDescription>Daftar semua sesi absensi yang telah dibuat</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kelas</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Waktu</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Kehadiran</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.length > 0 ? (
                    sessions.map(session => {
                      const cls = classes.find(c => c.id === session.classId)
                      const sessionAttendance = attendance.filter(a => a.sessionId === session.id)
                      const presentCount = sessionAttendance.filter(a => a.status === 'present' || a.status === 'late').length
                      
                      return (
                        <TableRow key={session.id}>
                          <TableCell className="font-medium">{cls?.name || 'Kelas'}</TableCell>
                          <TableCell>
                            {format(new Date(session.date), 'd MMM yyyy', { locale: localeId })}
                          </TableCell>
                          <TableCell>{session.startTime}</TableCell>
                          <TableCell>
                            <Badge variant={session.status === 'active' ? 'default' : 'secondary'}>
                              {session.status === 'active' ? 'Aktif' : 'Selesai'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {presentCount}/{cls?.studentIds.length || 0}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedSession(session)}
                            >
                              Detail
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Belum ada sesi absensi
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Records Tab */}
        <TabsContent value="records">
          <Card>
            <CardHeader>
              <CardTitle>Rekap Absensi</CardTitle>
              <CardDescription>Detail kehadiran siswa</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Siswa</TableHead>
                    <TableHead>Waktu Check-in</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Lokasi</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendance.length > 0 ? (
                    attendance.slice(0, 20).map(record => {
                      const student = students.find(s => s.id === record.studentId)
                      
                      return (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(record.status)}
                              {student?.name || 'Siswa'}
                            </div>
                          </TableCell>
                          <TableCell>
                            {record.checkInTime || '-'}
                          </TableCell>
                          <TableCell>
                            <Badge className={ATTENDANCE_STATUS_COLORS[record.status]}>
                              {ATTENDANCE_STATUS_LABELS[record.status]}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {record.verifiedLocation ? (
                              <Badge variant="outline" className="text-emerald-600">
                                <MapPin className="w-3 h-3 mr-1" />
                                Terverifikasi
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-muted-foreground">
                                Tidak ada
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <WhatsAppButton
                              phone={student?.phone || ''}
                              message={WA_TEMPLATES.attendanceConfirm(
                                student?.name || '',
                                'Kelas',
                                format(new Date(record.createdAt), 'HH:mm, d MMM', { locale: localeId })
                              )}
                              variant="ghost"
                              size="sm"
                            >
                              WA
                            </WhatsAppButton>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        Belum ada data absensi
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
