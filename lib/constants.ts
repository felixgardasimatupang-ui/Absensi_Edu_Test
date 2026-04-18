import type { Location, RubricCriteria } from './types'

// Default Bimbel Location (Jakarta)
export const DEFAULT_LOCATION: Location = {
  name: 'Bimbel Cerdas Indonesia',
  address: 'Jl. Pendidikan No. 123, Jakarta Selatan',
  latitude: -6.2088,
  longitude: 106.8456,
  radius: 100 // 100 meters radius
}

// QR Code Settings
export const QR_EXPIRY_MINUTES = 30
export const QR_SIZE = 256

// Geolocation Settings
export const GEO_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0
}

// Admin Contact
export const ADMIN_CONTACT = {
  name: 'Admin Bimbel',
  phone: '6281234567890',
  email: 'admin@bimbelcerdas.id'
}

// Attendance Status Labels
export const ATTENDANCE_STATUS_LABELS = {
  present: 'Hadir',
  late: 'Terlambat',
  absent: 'Tidak Hadir',
  excused: 'Izin'
} as const

// Attendance Status Colors
export const ATTENDANCE_STATUS_COLORS = {
  present: 'bg-emerald-100 text-emerald-700',
  late: 'bg-amber-100 text-amber-700',
  absent: 'bg-red-100 text-red-700',
  excused: 'bg-blue-100 text-blue-700'
} as const

// Star Rating Labels
export const STAR_RATING_CATEGORIES = [
  { key: 'keaktifan', label: 'Keaktifan', description: 'Partisipasi aktif dalam pembelajaran' },
  { key: 'pemahaman', label: 'Pemahaman', description: 'Tingkat pemahaman materi' },
  { key: 'sikap', label: 'Sikap', description: 'Sikap dan perilaku selama belajar' }
] as const

// Rubric Criteria
export const DEFAULT_RUBRIC_CRITERIA: RubricCriteria[] = [
  {
    id: 'kognitif-1',
    name: 'Penguasaan Materi',
    description: 'Kemampuan memahami dan menerapkan konsep',
    weight: 25,
    category: 'kognitif'
  },
  {
    id: 'kognitif-2',
    name: 'Kemampuan Analisis',
    description: 'Kemampuan menganalisis dan memecahkan masalah',
    weight: 20,
    category: 'kognitif'
  },
  {
    id: 'afektif-1',
    name: 'Kedisiplinan',
    description: 'Ketepatan waktu dan kepatuhan terhadap aturan',
    weight: 15,
    category: 'afektif'
  },
  {
    id: 'afektif-2',
    name: 'Kerjasama',
    description: 'Kemampuan bekerja sama dengan teman',
    weight: 10,
    category: 'afektif'
  },
  {
    id: 'psikomotorik-1',
    name: 'Keterampilan Praktik',
    description: 'Kemampuan menerapkan teori dalam praktik',
    weight: 20,
    category: 'psikomotorik'
  },
  {
    id: 'psikomotorik-2',
    name: 'Kreativitas',
    description: 'Kemampuan berpikir kreatif dan inovatif',
    weight: 10,
    category: 'psikomotorik'
  }
]

// Score Labels
export const SCORE_LABELS = {
  A: { label: 'Sangat Baik', value: 4, color: 'bg-emerald-500' },
  B: { label: 'Baik', value: 3, color: 'bg-teal-500' },
  C: { label: 'Cukup', value: 2, color: 'bg-amber-500' },
  D: { label: 'Kurang', value: 1, color: 'bg-orange-500' },
  E: { label: 'Sangat Kurang', value: 0, color: 'bg-red-500' }
} as const

// Days of week in Indonesian
export const DAYS_OF_WEEK = [
  'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'
] as const

// Subjects
export const SUBJECTS = [
  'Matematika',
  'Fisika',
  'Kimia',
  'Biologi',
  'Bahasa Indonesia',
  'Bahasa Inggris',
  'IPA Terpadu',
  'IPS Terpadu'
] as const

// Grades
export const GRADES = [
  'SD Kelas 1', 'SD Kelas 2', 'SD Kelas 3', 'SD Kelas 4', 'SD Kelas 5', 'SD Kelas 6',
  'SMP Kelas 7', 'SMP Kelas 8', 'SMP Kelas 9',
  'SMA Kelas 10', 'SMA Kelas 11', 'SMA Kelas 12'
] as const

// WhatsApp Message Templates
export const WA_TEMPLATES = {
  attendanceConfirm: (studentName: string, className: string, time: string) =>
    `Halo, ${studentName} telah berhasil absen untuk kelas ${className} pada ${time}. Terima kasih.`,
  
  evaluationReport: (studentName: string, rating: number) =>
    `Laporan Evaluasi: ${studentName} mendapat rating ${rating}/5 pada sesi hari ini. Silakan cek aplikasi untuk detail lebih lanjut.`,
  
  reminder: (studentName: string, className: string, time: string) =>
    `Pengingat: ${studentName} memiliki jadwal kelas ${className} pada ${time}. Jangan lupa hadir tepat waktu!`,
  
  absent: (studentName: string, className: string, date: string) =>
    `Pemberitahuan: ${studentName} tidak hadir pada kelas ${className} tanggal ${date}. Mohon konfirmasi jika ada kendala.`
}

// Email Templates
export const EMAIL_TEMPLATES = {
  attendanceSubject: (className: string) => `Konfirmasi Kehadiran - ${className}`,
  evaluationSubject: (studentName: string) => `Laporan Evaluasi - ${studentName}`,
  reminderSubject: (className: string) => `Pengingat Jadwal - ${className}`
}

// Navigation Items
export const NAV_ITEMS = {
  admin: [
    { href: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { href: '/dashboard/attendance', label: 'Absensi', icon: 'QrCode' },
    { href: '/dashboard/students', label: 'Siswa', icon: 'Users' },
    { href: '/dashboard/tutors', label: 'Tutor', icon: 'GraduationCap' },
    { href: '/dashboard/classes', label: 'Kelas', icon: 'BookOpen' },
    { href: '/dashboard/evaluations', label: 'Evaluasi', icon: 'Star' },
    { href: '/dashboard/reports', label: 'Laporan', icon: 'BarChart3' },
    { href: '/dashboard/notifications', label: 'Notifikasi', icon: 'Bell' },
    { href: '/dashboard/settings', label: 'Pengaturan', icon: 'Settings' }
  ],
  tutor: [
    { href: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { href: '/dashboard/attendance', label: 'Absensi', icon: 'QrCode' },
    { href: '/dashboard/classes', label: 'Kelas Saya', icon: 'BookOpen' },
    { href: '/dashboard/students', label: 'Siswa', icon: 'Users' },
    { href: '/dashboard/evaluations', label: 'Evaluasi', icon: 'Star' },
    { href: '/dashboard/notifications', label: 'Notifikasi', icon: 'Bell' }
  ],
  student: [
    { href: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { href: '/scan', label: 'Scan Absensi', icon: 'QrCode' },
    { href: '/dashboard/evaluations', label: 'Evaluasi Saya', icon: 'Star' },
    { href: '/dashboard/notifications', label: 'Notifikasi', icon: 'Bell' }
  ],
  parent: [
    { href: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { href: '/dashboard/evaluations', label: 'Evaluasi Anak', icon: 'Star' },
    { href: '/dashboard/reports', label: 'Laporan', icon: 'BarChart3' },
    { href: '/dashboard/notifications', label: 'Notifikasi', icon: 'Bell' }
  ]
}

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH: 'bimbel_auth',
  USERS: 'bimbel_users',
  STUDENTS: 'bimbel_students',
  TUTORS: 'bimbel_tutors',
  CLASSES: 'bimbel_classes',
  SESSIONS: 'bimbel_sessions',
  ATTENDANCE: 'bimbel_attendance',
  STAR_RATINGS: 'bimbel_star_ratings',
  RUBRIC_EVALUATIONS: 'bimbel_rubric_evaluations',
  NOTIFICATIONS: 'bimbel_notifications'
} as const
