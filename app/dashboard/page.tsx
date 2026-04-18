'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatCard } from '@/components/dashboard/stat-card'
import { StarRatingDisplay } from '@/components/evaluation/star-rating'
import {
  Users,
  GraduationCap,
  BookOpen,
  QrCode,
  TrendingUp,
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import {
  getStudents,
  getTutors,
  getClasses,
  getSessions,
  getAttendanceRecords,
  getStarRatings
} from '@/lib/store'
import { ATTENDANCE_STATUS_LABELS, ATTENDANCE_STATUS_COLORS } from '@/lib/constants'
import { format } from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTutors: 0,
    totalClasses: 0,
    todaySessions: 0,
    attendanceRate: 0,
    averageRating: 0
  })
  const [recentActivity, setRecentActivity] = useState<Array<{
    id: string
    type: 'attendance' | 'evaluation'
    studentName: string
    description: string
    time: string
    status?: string
  }>>([])
  const [chartData, setChartData] = useState<Array<{
    name: string
    hadir: number
    terlambat: number
    absen: number
  }>>([])

  useEffect(() => {
    const students = getStudents()
    const tutors = getTutors()
    const classes = getClasses()
    const sessions = getSessions()
    const attendance = getAttendanceRecords()
    const ratings = getStarRatings()

    const today = new Date().toISOString().split('T')[0]
    const todaySessions = sessions.filter(s => s.date === today)

    // Calculate attendance rate
    const presentCount = attendance.filter(a => a.status === 'present' || a.status === 'late').length
    const attendanceRate = attendance.length > 0 ? Math.round((presentCount / attendance.length) * 100) : 0

    // Calculate average rating
    const avgRating = ratings.length > 0
      ? ratings.reduce((acc, r) => acc + (r.keaktifan + r.pemahaman + r.sikap) / 3, 0) / ratings.length
      : 0

    setStats({
      totalStudents: students.length,
      totalTutors: tutors.length,
      totalClasses: classes.length,
      todaySessions: todaySessions.length,
      attendanceRate,
      averageRating: Number(avgRating.toFixed(1))
    })

    // Recent activity
    const activities: typeof recentActivity = []
    
    attendance.slice(0, 5).forEach(a => {
      const student = students.find(s => s.id === a.studentId)
      if (student) {
        activities.push({
          id: a.id,
          type: 'attendance',
          studentName: student.name,
          description: `Absensi ${ATTENDANCE_STATUS_LABELS[a.status].toLowerCase()}`,
          time: a.createdAt,
          status: a.status
        })
      }
    })

    ratings.slice(0, 3).forEach(r => {
      const student = students.find(s => s.id === r.studentId)
      if (student) {
        activities.push({
          id: r.id,
          type: 'evaluation',
          studentName: student.name,
          description: `Rating: ${((r.keaktifan + r.pemahaman + r.sikap) / 3).toFixed(1)}/5`,
          time: r.createdAt
        })
      }
    })

    setRecentActivity(activities.sort((a, b) => 
      new Date(b.time).getTime() - new Date(a.time).getTime()
    ).slice(0, 5))

    // Chart data (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return date.toISOString().split('T')[0]
    })

    const chartDataArr = last7Days.map(date => {
      const dayAttendance = attendance.filter(a => a.createdAt.startsWith(date))
      return {
        name: format(new Date(date), 'EEE', { locale: localeId }),
        hadir: dayAttendance.filter(a => a.status === 'present').length,
        terlambat: dayAttendance.filter(a => a.status === 'late').length,
        absen: dayAttendance.filter(a => a.status === 'absent').length
      }
    })

    setChartData(chartDataArr)
  }, [])

  const getActivityIcon = (type: string, status?: string) => {
    if (type === 'evaluation') return <StarRatingDisplay value={4} max={5} size="sm" showValue={false} />
    if (status === 'present') return <CheckCircle2 className="w-4 h-4 text-emerald-500" />
    if (status === 'late') return <AlertCircle className="w-4 h-4 text-amber-500" />
    return <XCircle className="w-4 h-4 text-red-500" />
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-balance">
            Selamat datang, {user?.name.split(' ')[0]}!
          </h1>
          <p className="text-muted-foreground">
            {format(new Date(), 'EEEE, d MMMM yyyy', { locale: localeId })}
          </p>
        </div>
        {(user?.role === 'admin' || user?.role === 'tutor') && (
          <Button asChild>
            <Link href="/dashboard/attendance">
              <QrCode className="w-4 h-4 mr-2" />
              Buat Sesi Absensi
            </Link>
          </Button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Siswa"
          value={stats.totalStudents}
          icon={<Users className="w-5 h-5" />}
          trend={{ value: 12, label: 'dari bulan lalu' }}
        />
        <StatCard
          title="Total Tutor"
          value={stats.totalTutors}
          icon={<GraduationCap className="w-5 h-5" />}
        />
        <StatCard
          title="Kelas Aktif"
          value={stats.totalClasses}
          icon={<BookOpen className="w-5 h-5" />}
        />
        <StatCard
          title="Tingkat Kehadiran"
          value={`${stats.attendanceRate}%`}
          icon={<TrendingUp className="w-5 h-5" />}
          trend={{ value: 5, label: 'dari minggu lalu' }}
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Statistik Kehadiran</CardTitle>
            <CardDescription>7 hari terakhir</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar dataKey="hadir" fill="var(--color-chart-4)" radius={[4, 4, 0, 0]} name="Hadir" />
                  <Bar dataKey="terlambat" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} name="Terlambat" />
                  <Bar dataKey="absen" fill="var(--color-chart-5)" radius={[4, 4, 0, 0]} name="Absen" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Aktivitas Terbaru</CardTitle>
              <CardDescription>Update terkini</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/notifications">
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {getActivityIcon(activity.type, activity.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{activity.studentName}</p>
                    <p className="text-xs text-muted-foreground">{activity.description}</p>
                  </div>
                  <p className="text-xs text-muted-foreground whitespace-nowrap">
                    {format(new Date(activity.time), 'HH:mm')}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Belum ada aktivitas
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Today's Sessions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Sesi Hari Ini
            </CardTitle>
            <CardDescription>Jadwal kelas yang berlangsung hari ini</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/classes">
              Lihat Semua
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {stats.todaySessions > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {getSessions()
                .filter(s => s.date === new Date().toISOString().split('T')[0])
                .map(session => {
                  const cls = getClasses().find(c => c.id === session.classId)
                  const tutor = getTutors().find(t => t.id === session.tutorId)
                  return (
                    <div
                      key={session.id}
                      className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">{cls?.name || 'Kelas'}</h4>
                        <Badge variant={session.status === 'active' ? 'default' : 'secondary'}>
                          {session.status === 'active' ? 'Berlangsung' : 'Selesai'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {tutor?.name || 'Tutor'}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{session.startTime} - {session.endTime || 'Selesai'}</span>
                      </div>
                    </div>
                  )
                })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-2 opacity-20" />
              <p>Tidak ada sesi hari ini</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
