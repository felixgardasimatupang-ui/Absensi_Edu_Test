'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { StarRatingInput, StarRatingDisplay, calculateAverageRating } from '@/components/evaluation/star-rating'
import { RubricForm } from '@/components/evaluation/rubric-form'
import { WhatsAppButton } from '@/components/notifications/whatsapp-button'
import { EmailButton } from '@/components/notifications/email-button'
import {
  Star,
  ClipboardList,
  Plus,
  TrendingUp,
  Users,
  Calendar,
  Send
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import {
  getStudents,
  getClasses,
  getSessions,
  getStarRatings,
  getRubricEvaluations,
  addStarRating,
  addRubricEvaluation,
  generateId
} from '@/lib/store'
import { STAR_RATING_CATEGORIES, WA_TEMPLATES, DEFAULT_RUBRIC_CRITERIA, SCORE_LABELS } from '@/lib/constants'
import type { Student, StarRating, RubricEvaluation, Class, AttendanceSession } from '@/lib/types'
import { format } from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import { toast } from 'sonner'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts'

export default function EvaluationsPage() {
  const { user } = useAuth()
  const [students, setStudents] = useState<Student[]>([])
  const [starRatings, setStarRatings] = useState<StarRating[]>([])
  const [rubricEvaluations, setRubricEvaluations] = useState<RubricEvaluation[]>([])
  const [sessions, setSessions] = useState<AttendanceSession[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<string>('')
  const [selectedSession, setSelectedSession] = useState<string>('')
  const [evaluationType, setEvaluationType] = useState<'star' | 'rubric'>('star')
  const [starValues, setStarValues] = useState({
    keaktifan: 0,
    pemahaman: 0,
    sikap: 0
  })
  const [comment, setComment] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setStudents(getStudents())
    setStarRatings(getStarRatings())
    setRubricEvaluations(getRubricEvaluations())
    setSessions(getSessions())
    setClasses(getClasses())
  }

  const handleSubmitStarRating = () => {
    if (!selectedStudent || !selectedSession) {
      toast.error('Pilih siswa dan sesi terlebih dahulu')
      return
    }

    if (starValues.keaktifan === 0 || starValues.pemahaman === 0 || starValues.sikap === 0) {
      toast.error('Mohon isi semua rating')
      return
    }

    const newRating: StarRating = {
      id: generateId(),
      sessionId: selectedSession,
      studentId: selectedStudent,
      tutorId: user?.id || '',
      keaktifan: starValues.keaktifan,
      pemahaman: starValues.pemahaman,
      sikap: starValues.sikap,
      comment,
      createdAt: new Date().toISOString()
    }

    addStarRating(newRating)
    loadData()
    resetForm()
    setIsDialogOpen(false)
    toast.success('Evaluasi berhasil disimpan!')
  }

  const handleSubmitRubric = (evaluation: Omit<RubricEvaluation, 'id' | 'createdAt'>) => {
    const newEvaluation: RubricEvaluation = {
      ...evaluation,
      id: generateId(),
      createdAt: new Date().toISOString()
    }

    addRubricEvaluation(newEvaluation)
    loadData()
    setIsDialogOpen(false)
    toast.success('Evaluasi rubrik berhasil disimpan!')
  }

  const resetForm = () => {
    setSelectedStudent('')
    setSelectedSession('')
    setStarValues({ keaktifan: 0, pemahaman: 0, sikap: 0 })
    setComment('')
  }

  const getStudentRatings = (studentId: string) => {
    const ratings = starRatings.filter(r => r.studentId === studentId)
    if (ratings.length === 0) return null

    const avg = ratings.reduce((acc, r) => ({
      keaktifan: acc.keaktifan + r.keaktifan,
      pemahaman: acc.pemahaman + r.pemahaman,
      sikap: acc.sikap + r.sikap
    }), { keaktifan: 0, pemahaman: 0, sikap: 0 })

    return {
      keaktifan: Number((avg.keaktifan / ratings.length).toFixed(1)),
      pemahaman: Number((avg.pemahaman / ratings.length).toFixed(1)),
      sikap: Number((avg.sikap / ratings.length).toFixed(1)),
      total: ratings.length
    }
  }

  // Chart data
  const chartData = students.slice(0, 6).map(student => {
    const ratings = getStudentRatings(student.id)
    return {
      name: student.name.split(' ')[0],
      keaktifan: ratings?.keaktifan || 0,
      pemahaman: ratings?.pemahaman || 0,
      sikap: ratings?.sikap || 0
    }
  })

  const totalEvaluations = starRatings.length + rubricEvaluations.length
  const avgOverallRating = starRatings.length > 0
    ? (starRatings.reduce((acc, r) => acc + calculateAverageRating(r), 0) / starRatings.length).toFixed(1)
    : '0'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Evaluasi Siswa</h1>
          <p className="text-muted-foreground">Berikan penilaian dan feedback untuk siswa</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Buat Evaluasi
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Buat Evaluasi Baru</DialogTitle>
              <DialogDescription>
                Pilih jenis evaluasi dan siswa yang akan dinilai
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Select Session & Student */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sesi Kelas</label>
                  <Select value={selectedSession} onValueChange={setSelectedSession}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih sesi" />
                    </SelectTrigger>
                    <SelectContent>
                      {sessions.map(session => {
                        const cls = classes.find(c => c.id === session.classId)
                        return (
                          <SelectItem key={session.id} value={session.id}>
                            {cls?.name} - {format(new Date(session.date), 'd MMM', { locale: localeId })}
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Siswa</label>
                  <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih siswa" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map(student => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Evaluation Type Tabs */}
              <Tabs value={evaluationType} onValueChange={(v) => setEvaluationType(v as 'star' | 'rubric')}>
                <TabsList className="w-full">
                  <TabsTrigger value="star" className="flex-1">
                    <Star className="w-4 h-4 mr-2" />
                    Rating Bintang
                  </TabsTrigger>
                  <TabsTrigger value="rubric" className="flex-1">
                    <ClipboardList className="w-4 h-4 mr-2" />
                    Rubrik Detail
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="star" className="space-y-4 mt-4">
                  {STAR_RATING_CATEGORIES.map(category => (
                    <StarRatingInput
                      key={category.key}
                      label={category.label}
                      description={category.description}
                      value={starValues[category.key as keyof typeof starValues]}
                      onChange={(value) => setStarValues(prev => ({
                        ...prev,
                        [category.key]: value
                      }))}
                      size="lg"
                    />
                  ))}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Komentar (Opsional)</label>
                    <Textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Tuliskan komentar atau saran..."
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button>
                    <Button onClick={handleSubmitStarRating}>Simpan Evaluasi</Button>
                  </DialogFooter>
                </TabsContent>

                <TabsContent value="rubric" className="mt-4">
                  {selectedStudent && selectedSession ? (
                    <RubricForm
                      studentName={students.find(s => s.id === selectedStudent)?.name || ''}
                      studentId={selectedStudent}
                      sessionId={selectedSession}
                      tutorId={user?.id || ''}
                      onSubmit={handleSubmitRubric}
                    />
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      Pilih sesi dan siswa terlebih dahulu
                    </p>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Star className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalEvaluations}</p>
                <p className="text-sm text-muted-foreground">Total Evaluasi</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{avgOverallRating}</p>
                <p className="text-sm text-muted-foreground">Rata-rata Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {new Set(starRatings.map(r => r.studentId)).size}
                </p>
                <p className="text-sm text-muted-foreground">Siswa Dinilai</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart & Recent */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Perbandingan Rating Siswa</CardTitle>
            <CardDescription>Rata-rata rating per kategori</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} domain={[0, 5]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="keaktifan" fill="var(--color-chart-1)" name="Keaktifan" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pemahaman" fill="var(--color-chart-2)" name="Pemahaman" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="sikap" fill="var(--color-chart-3)" name="Sikap" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Evaluations */}
        <Card>
          <CardHeader>
            <CardTitle>Evaluasi Terbaru</CardTitle>
            <CardDescription>Rating yang baru diberikan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {starRatings.slice(0, 5).map(rating => {
              const student = students.find(s => s.id === rating.studentId)
              const avg = calculateAverageRating(rating)

              return (
                <div key={rating.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {student?.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium truncate">{student?.name}</p>
                      <StarRatingDisplay value={avg} size="sm" />
                    </div>
                    {rating.comment && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {rating.comment}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(rating.createdAt), 'd MMM yyyy, HH:mm', { locale: localeId })}
                    </p>
                  </div>
                  <WhatsAppButton
                    phone={student?.phone || ''}
                    message={WA_TEMPLATES.evaluationReport(student?.name || '', avg)}
                    variant="ghost"
                    size="icon"
                  >
                    <Send className="w-4 h-4" />
                  </WhatsAppButton>
                </div>
              )
            })}
            {starRatings.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                Belum ada evaluasi
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
