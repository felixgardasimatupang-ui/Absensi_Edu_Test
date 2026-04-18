'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { StatCard } from '@/components/dashboard/stat-card'
import { StarRatingDisplay } from '@/components/evaluation/star-rating'
import {
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  Download,
  Filter,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react'
import {
  getStudents,
  getClasses,
  getSessions,
  getAttendanceRecords,
  getStarRatings,
  getTutors
} from '@/lib/store'
import { ATTENDANCE_STATUS_LABELS } from '@/lib/constants'
import type { Student, AttendanceRecord, StarRating } from '@/lib/types'
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts'

const COLORS = ['#0f766e', '#f59e0b', '#ef4444', '#3b82f6']

export default function ReportsPage() {
  const [period, setPeriod] = useState<'week' | 'month' | 'all'>('week')
  const [students, setStudents] = useState<Student[]>([])
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [ratings, setRatings] = useState<StarRating[]>([])
  const [attendanceChartData, setAttendanceChartData] = useState<Array<{ name: string; hadir: number; terlambat: number; absen: number }>>([])
  const [pieData, setPieData] = useState<Array<{ name: string; value: number }>>([])

  useEffect(() => {
    loadData()
  }, [period])

  const loadData = () => {
    const allStudents = getStudents()
    const allAttendance = getAttendanceRecords()
    const allRatings = getStarRatings()

    setStudents(allStudents)
    setAttendance(allAttendance)
    setRatings(allRatings)

    // Filter by period
    let startDate: Date
    let endDate: Date = new Date()

    if (period === 'week') {
      startDate = subDays(new Date(), 7)
    } else if (period === 'month') {
      startDate = subDays(new Date(), 30)
    } else {
      startDate = subDays(new Date(), 90)
    }

    const filteredAttendance = allAttendance.filter(a => {
      const date = new Date(a.createdAt)
      return date >= startDate && date <= endDate
    })

    // Attendance chart data
    const days = eachDayOfInterval({ start: startDate, end: endDate })
    const chartData = days.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd')
      const dayAttendance = filteredAttendance.filter(a => a.createdAt.startsWith(dayStr))
      return {
        name: format(day, 'dd/MM'),
        hadir: dayAttendance.filter(a => a.status === 'present').length,
        terlambat: dayAttendance.filter(a => a.status === 'late').length,
        absen: dayAttendance.filter(a => a.status === 'absent').length
      }
    })
    setAttendanceChartData(chartData.slice(-14)) // Last 14 days for readability

    // Pie chart data
    const present = filteredAttendance.filter(a => a.status === 'present').length
    const late = filteredAttendance.filter(a => a.status === 'late').length
    const absent = filteredAttendance.filter(a => a.status === 'absent').length
    const excused = filteredAttendance.filter(a => a.status === 'excused').length

    setPieData([
      { name: 'Hadir', value: present },
      { name: 'Terlambat', value: late },
      { name: 'Tidak Hadir', value: absent },
      { name: 'Izin', value: excused }
    ])
  }

  // Calculate stats
  const totalSessions = getSessions().length
  const totalAttendance = attendance.length
  const presentCount = attendance.filter(a => a.status === 'present' || a.status === 'late').length
  const attendanceRate = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0

  const avgRating = ratings.length > 0
    ? (ratings.reduce((acc, r) => acc + (r.keaktifan + r.pemahaman + r.sikap) / 3, 0) / ratings.length)
    : 0

  // Top students by attendance
  const studentAttendanceStats = students.map(student => {
    const studentAttendance = attendance.filter(a => a.studentId === student.id)
    const present = studentAttendance.filter(a => a.status === 'present' || a.status === 'late').length
    const rate = studentAttendance.length > 0 ? Math.round((present / studentAttendance.length) * 100) : 0
    const studentRatings = ratings.filter(r => r.studentId === student.id)
    const avgStudentRating = studentRatings.length > 0
      ? studentRatings.reduce((acc, r) => acc + (r.keaktifan + r.pemahaman + r.sikap) / 3, 0) / studentRatings.length
      : 0

    return {
      ...student,
      attendanceRate: rate,
      avgRating: Number(avgStudentRating.toFixed(1)),
      totalSessions: studentAttendance.length
    }
  }).sort((a, b) => b.attendanceRate - a.attendanceRate)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Laporan & Statistik</h1>
          <p className="text-muted-foreground">Analisis kehadiran dan performa siswa</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={(v) => setPeriod(v as typeof period)}>
            <SelectTrigger className="w-[150px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">7 Hari</SelectItem>
              <SelectItem value="month">30 Hari</SelectItem>
              <SelectItem value="all">90 Hari</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Sesi"
          value={totalSessions}
          icon={<Calendar className="w-5 h-5" />}
        />
        <StatCard
          title="Tingkat Kehadiran"
          value={`${attendanceRate}%`}
          icon={<TrendingUp className="w-5 h-5" />}
          trend={{ value: 5, label: 'dari periode lalu' }}
        />
        <StatCard
          title="Total Siswa"
          value={students.length}
          icon={<Users className="w-5 h-5" />}
        />
        <StatCard
          title="Rata-rata Rating"
          value={avgRating.toFixed(1)}
          icon={<BarChart3 className="w-5 h-5" />}
          description="dari 5.0"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Line Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Tren Kehadiran</CardTitle>
            <CardDescription>Data kehadiran harian</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceChartData}>
                  <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="hadir" fill="#0f766e" name="Hadir" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="terlambat" fill="#f59e0b" name="Terlambat" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="absen" fill="#ef4444" name="Absen" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Status</CardTitle>
            <CardDescription>Persentase kehadiran</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Students */}
      <Card>
        <CardHeader>
          <CardTitle>Peringkat Siswa</CardTitle>
          <CardDescription>Berdasarkan kehadiran dan rating</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {studentAttendanceStats.slice(0, 10).map((student, index) => (
              <div
                key={student.id}
                className="flex items-center gap-4 p-4 rounded-lg bg-muted/50"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{student.name}</p>
                  <p className="text-sm text-muted-foreground">{student.grade}</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-lg font-bold">{student.attendanceRate}%</p>
                    <p className="text-xs text-muted-foreground">Kehadiran</p>
                  </div>
                  <div className="text-center">
                    <StarRatingDisplay value={student.avgRating} size="sm" />
                    <p className="text-xs text-muted-foreground mt-1">Rating</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold">{student.totalSessions}</p>
                    <p className="text-xs text-muted-foreground">Sesi</p>
                  </div>
                </div>
              </div>
            ))}
            {students.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                Belum ada data siswa
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
