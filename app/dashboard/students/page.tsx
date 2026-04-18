'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { WhatsAppButton, WhatsAppDropdown } from '@/components/notifications/whatsapp-button'
import { EmailButton } from '@/components/notifications/email-button'
import { StarRatingDisplay } from '@/components/evaluation/star-rating'
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  GraduationCap,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye
} from 'lucide-react'
import {
  getStudents,
  getUsers,
  getClasses,
  getStarRatings,
  getAttendanceRecords,
  addStudent,
  deleteStudent,
  generateId
} from '@/lib/store'
import { GRADES } from '@/lib/constants'
import type { Student } from '@/lib/types'
import { toast } from 'sonner'

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGrade, setSelectedGrade] = useState<string>('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    grade: '',
    parentName: '',
    parentEmail: '',
    parentPhone: ''
  })

  useEffect(() => {
    loadStudents()
  }, [])

  const loadStudents = () => {
    setStudents(getStudents())
  }

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          student.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesGrade = selectedGrade === 'all' || student.grade === selectedGrade
    return matchesSearch && matchesGrade
  })

  const handleAddStudent = () => {
    if (!formData.name || !formData.email || !formData.grade) {
      toast.error('Mohon lengkapi data yang diperlukan')
      return
    }

    const newStudent: Student = {
      id: generateId(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: 'student',
      grade: formData.grade,
      parentId: '',
      enrolledClasses: [],
      createdAt: new Date().toISOString()
    }

    addStudent(newStudent)
    loadStudents()
    setIsDialogOpen(false)
    setFormData({
      name: '',
      email: '',
      phone: '',
      grade: '',
      parentName: '',
      parentEmail: '',
      parentPhone: ''
    })
    toast.success('Siswa berhasil ditambahkan!')
  }

  const handleDeleteStudent = (id: string) => {
    deleteStudent(id)
    loadStudents()
    toast.success('Siswa berhasil dihapus')
  }

  const getStudentStats = (studentId: string) => {
    const attendance = getAttendanceRecords().filter(a => a.studentId === studentId)
    const ratings = getStarRatings().filter(r => r.studentId === studentId)
    
    const presentCount = attendance.filter(a => a.status === 'present' || a.status === 'late').length
    const attendanceRate = attendance.length > 0 ? Math.round((presentCount / attendance.length) * 100) : 0
    
    const avgRating = ratings.length > 0
      ? ratings.reduce((acc, r) => acc + (r.keaktifan + r.pemahaman + r.sikap) / 3, 0) / ratings.length
      : 0

    return { attendanceRate, avgRating: Number(avgRating.toFixed(1)), totalSessions: attendance.length }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Manajemen Siswa</h1>
          <p className="text-muted-foreground">Kelola data siswa dan orangtua</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Siswa
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Tambah Siswa Baru</DialogTitle>
              <DialogDescription>
                Masukkan data siswa dan orangtua
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nama Siswa *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nama lengkap"
                />
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label>No. Telepon</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="08123456789"
                />
              </div>
              <div className="space-y-2">
                <Label>Kelas/Tingkat *</Label>
                <Select
                  value={formData.grade}
                  onValueChange={(value) => setFormData({ ...formData, grade: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    {GRADES.map((grade) => (
                      <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="border-t pt-4">
                <p className="text-sm font-medium mb-3">Data Orangtua</p>
                <div className="space-y-3">
                  <Input
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    placeholder="Nama orangtua"
                  />
                  <Input
                    value={formData.parentPhone}
                    onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                    placeholder="No. telepon orangtua"
                  />
                  <Input
                    type="email"
                    value={formData.parentEmail}
                    onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                    placeholder="Email orangtua"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button>
              <Button onClick={handleAddStudent}>Simpan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama atau email siswa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter kelas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kelas</SelectItem>
                {GRADES.map((grade) => (
                  <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{students.length}</p>
                <p className="text-sm text-muted-foreground">Total Siswa</p>
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
                <p className="text-2xl font-bold">
                  {new Set(students.map(s => s.grade)).size}
                </p>
                <p className="text-sm text-muted-foreground">Tingkat Kelas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Phone className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {students.filter(s => s.parentId).length}
                </p>
                <p className="text-sm text-muted-foreground">Dengan Orangtua</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Siswa</CardTitle>
          <CardDescription>
            {filteredStudents.length} dari {students.length} siswa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Siswa</TableHead>
                <TableHead>Kelas</TableHead>
                <TableHead>Kehadiran</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Kontak</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => {
                  const stats = getStudentStats(student.id)
                  const parent = getUsers().find(u => u.id === student.parentId)
                  
                  return (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {student.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-muted-foreground">{student.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{student.grade}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500"
                              style={{ width: `${stats.attendanceRate}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">{stats.attendanceRate}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {stats.avgRating > 0 ? (
                          <StarRatingDisplay value={stats.avgRating} />
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <WhatsAppButton
                            phone={student.phone}
                            variant="ghost"
                            size="icon"
                          >
                            <Phone className="w-4 h-4" />
                          </WhatsAppButton>
                          <EmailButton
                            email={student.email}
                            variant="ghost"
                            size="icon"
                          >
                            <Mail className="w-4 h-4" />
                          </EmailButton>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteStudent(student.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    {searchQuery || selectedGrade !== 'all'
                      ? 'Tidak ada siswa yang sesuai filter'
                      : 'Belum ada data siswa'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
