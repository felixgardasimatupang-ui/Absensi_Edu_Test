'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
import {
  BookOpen,
  Plus,
  Search,
  Users,
  Clock,
  MapPin,
  GraduationCap,
  Calendar
} from 'lucide-react'
import {
  getClasses,
  getTutors,
  getStudents,
  addClass,
  generateId
} from '@/lib/store'
import { SUBJECTS, DAYS_OF_WEEK, DEFAULT_LOCATION } from '@/lib/constants'
import type { Class, Tutor, Student } from '@/lib/types'
import { toast } from 'sonner'

export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>([])
  const [tutors, setTutors] = useState<Tutor[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    tutorId: '',
    day: '',
    startTime: '',
    endTime: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setClasses(getClasses())
    setTutors(getTutors())
    setStudents(getStudents())
  }

  const filteredClasses = classes.filter(cls =>
    cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cls.subject.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddClass = () => {
    if (!formData.name || !formData.subject || !formData.tutorId) {
      toast.error('Mohon lengkapi data yang diperlukan')
      return
    }

    const newClass: Class = {
      id: generateId(),
      name: formData.name,
      subject: formData.subject,
      tutorId: formData.tutorId,
      studentIds: [],
      schedule: formData.day && formData.startTime && formData.endTime
        ? [{ day: formData.day as Class['schedule'][0]['day'], startTime: formData.startTime, endTime: formData.endTime }]
        : [],
      location: DEFAULT_LOCATION,
      createdAt: new Date().toISOString()
    }

    addClass(newClass)
    loadData()
    setIsDialogOpen(false)
    setFormData({
      name: '',
      subject: '',
      tutorId: '',
      day: '',
      startTime: '',
      endTime: ''
    })
    toast.success('Kelas berhasil ditambahkan!')
  }

  const getTutorName = (tutorId: string) => {
    return tutors.find(t => t.id === tutorId)?.name || 'Unknown'
  }

  const getStudentCount = (classId: string) => {
    const cls = classes.find(c => c.id === classId)
    return cls?.studentIds.length || 0
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Manajemen Kelas</h1>
          <p className="text-muted-foreground">Kelola kelas dan jadwal bimbel</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Kelas
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Kelas Baru</DialogTitle>
              <DialogDescription>
                Masukkan informasi kelas dan jadwal
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nama Kelas *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Matematika SMP Kelas 8"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Mata Pelajaran *</label>
                <Select
                  value={formData.subject}
                  onValueChange={(value) => setFormData({ ...formData, subject: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih mata pelajaran" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBJECTS.map((subject) => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tutor *</label>
                <Select
                  value={formData.tutorId}
                  onValueChange={(value) => setFormData({ ...formData, tutorId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tutor" />
                  </SelectTrigger>
                  <SelectContent>
                    {tutors.map((tutor) => (
                      <SelectItem key={tutor.id} value={tutor.id}>{tutor.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="border-t pt-4">
                <p className="text-sm font-medium mb-3">Jadwal (Opsional)</p>
                <div className="grid gap-3 sm:grid-cols-3">
                  <Select
                    value={formData.day}
                    onValueChange={(value) => setFormData({ ...formData, day: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Hari" />
                    </SelectTrigger>
                    <SelectContent>
                      {DAYS_OF_WEEK.map((day) => (
                        <SelectItem key={day} value={day}>{day}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    placeholder="Mulai"
                  />
                  <Input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    placeholder="Selesai"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button>
              <Button onClick={handleAddClass}>Simpan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama kelas atau mata pelajaran..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{classes.length}</p>
                <p className="text-sm text-muted-foreground">Total Kelas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{tutors.length}</p>
                <p className="text-sm text-muted-foreground">Tutor Aktif</p>
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
                <p className="text-2xl font-bold">{students.length}</p>
                <p className="text-sm text-muted-foreground">Total Siswa</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Classes Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredClasses.length > 0 ? (
          filteredClasses.map((cls) => (
            <Card key={cls.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{cls.name}</CardTitle>
                    <CardDescription>{cls.subject}</CardDescription>
                  </div>
                  <Badge variant="secondary">{cls.studentIds.length} siswa</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <GraduationCap className="w-4 h-4 text-muted-foreground" />
                  <span>{getTutorName(cls.tutorId)}</span>
                </div>
                {cls.schedule.length > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>
                      {cls.schedule.map(s => `${s.day} ${s.startTime}-${s.endTime}`).join(', ')}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{cls.location.name}</span>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-20" />
                <p>
                  {searchQuery ? 'Tidak ada kelas yang sesuai' : 'Belum ada kelas'}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
