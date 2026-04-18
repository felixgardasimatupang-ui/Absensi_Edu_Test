'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Checkbox } from '@/components/ui/checkbox'
import {
  GraduationCap,
  Plus,
  Search,
  MoreVertical,
  Mail,
  Phone,
  BookOpen,
  Edit,
  Trash2,
  Users,
  Star
} from 'lucide-react'
import { WhatsAppButton } from '@/components/notifications/whatsapp-button'
import { EmailButton } from '@/components/notifications/email-button'
import { getTutors, addTutor, updateTutor, deleteTutor, getClasses, generateId } from '@/lib/store'
import { SUBJECTS } from '@/lib/constants'
import type { Tutor, Class } from '@/lib/types'
import { toast } from 'sonner'

export default function TutorsPage() {
  const [tutors, setTutors] = useState<Tutor[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [subjectFilter, setSubjectFilter] = useState<string>('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTutor, setEditingTutor] = useState<Tutor | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subjects: [] as string[]
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setTutors(getTutors())
    setClasses(getClasses())
  }

  const filteredTutors = tutors.filter(tutor => {
    const matchesSearch = tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutor.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSubject = subjectFilter === 'all' || tutor.subjects.includes(subjectFilter)
    return matchesSearch && matchesSubject
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Mohon lengkapi semua field')
      return
    }

    if (formData.subjects.length === 0) {
      toast.error('Pilih minimal satu mata pelajaran')
      return
    }

    if (editingTutor) {
      updateTutor(editingTutor.id, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subjects: formData.subjects
      })
      toast.success('Data tutor berhasil diperbarui')
    } else {
      const newTutor: Tutor = {
        id: generateId(),
        userId: generateId(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subjects: formData.subjects,
        createdAt: new Date().toISOString()
      }
      addTutor(newTutor)
      toast.success('Tutor baru berhasil ditambahkan')
    }

    resetForm()
    loadData()
  }

  const handleEdit = (tutor: Tutor) => {
    setEditingTutor(tutor)
    setFormData({
      name: tutor.name,
      email: tutor.email,
      phone: tutor.phone,
      subjects: tutor.subjects
    })
    setDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Yakin ingin menghapus tutor ini?')) {
      deleteTutor(id)
      toast.success('Tutor berhasil dihapus')
      loadData()
    }
  }

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', subjects: [] })
    setEditingTutor(null)
    setDialogOpen(false)
  }

  const toggleSubject = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }))
  }

  const getTutorClasses = (tutorId: string) => {
    return classes.filter(c => c.tutorId === tutorId)
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <GraduationCap className="w-7 h-7 text-primary" />
            Manajemen Tutor
          </h1>
          <p className="text-muted-foreground">Kelola data tutor dan pengajar bimbel</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          if (!open) resetForm()
          setDialogOpen(open)
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Tutor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingTutor ? 'Edit Tutor' : 'Tambah Tutor Baru'}</DialogTitle>
              <DialogDescription>
                {editingTutor ? 'Perbarui data tutor' : 'Masukkan data tutor baru'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Masukkan nama lengkap"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="tutor@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">No. Telepon</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="08123456789"
                />
              </div>
              <div className="space-y-2">
                <Label>Mata Pelajaran</Label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-lg p-3">
                  {SUBJECTS.map((subject) => (
                    <div key={subject} className="flex items-center space-x-2">
                      <Checkbox
                        id={subject}
                        checked={formData.subjects.includes(subject)}
                        onCheckedChange={() => toggleSubject(subject)}
                      />
                      <label htmlFor={subject} className="text-sm cursor-pointer">
                        {subject}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Batal
                </Button>
                <Button type="submit">
                  {editingTutor ? 'Simpan Perubahan' : 'Tambah Tutor'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tutor</p>
                <p className="text-2xl font-bold">{tutors.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Kelas</p>
                <p className="text-2xl font-bold">{classes.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Mata Pelajaran</p>
                <p className="text-2xl font-bold">{SUBJECTS.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                <Star className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama atau email tutor..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Semua Mapel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Mapel</SelectItem>
                {SUBJECTS.map(subject => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tutors Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Daftar Tutor ({filteredTutors.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTutors.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tutor</TableHead>
                    <TableHead className="hidden sm:table-cell">Kontak</TableHead>
                    <TableHead className="hidden md:table-cell">Mata Pelajaran</TableHead>
                    <TableHead className="hidden lg:table-cell">Kelas</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTutors.map((tutor) => {
                    const tutorClasses = getTutorClasses(tutor.id)
                    return (
                      <TableRow key={tutor.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {getInitials(tutor.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{tutor.name}</p>
                              <p className="text-sm text-muted-foreground sm:hidden">{tutor.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                              {tutor.email}
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                              {tutor.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex flex-wrap gap-1">
                            {tutor.subjects.slice(0, 2).map(subject => (
                              <Badge key={subject} variant="secondary" className="text-xs">
                                {subject}
                              </Badge>
                            ))}
                            {tutor.subjects.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{tutor.subjects.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span>{tutorClasses.length} kelas</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <WhatsAppButton
                              phone={tutor.phone}
                              message={`Halo ${tutor.name}, `}
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            />
                            <EmailButton
                              email={tutor.email}
                              subject={`Bimbel Cerdas - ${tutor.name}`}
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            />
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEdit(tutor)}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => handleDelete(tutor.id)}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Hapus
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <GraduationCap className="w-12 h-12 mx-auto text-muted-foreground/20 mb-4" />
              <p className="text-muted-foreground">
                {searchQuery || subjectFilter !== 'all'
                  ? 'Tidak ada tutor yang sesuai filter'
                  : 'Belum ada tutor terdaftar'}
              </p>
              {!searchQuery && subjectFilter === 'all' && (
                <Button className="mt-4" onClick={() => setDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Tutor Pertama
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
