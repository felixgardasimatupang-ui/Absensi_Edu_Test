import type {
  User,
  Student,
  Tutor,
  Class,
  AttendanceSession,
  AttendanceRecord,
  StarRating,
  Notification
} from './types'
import { DEFAULT_LOCATION } from './constants'
import {
  setUsers,
  setStudents,
  setTutors,
  setClasses,
  setSessions,
  setAttendanceRecords,
  setStarRatings,
  setNotifications
} from './store'

// Demo Admin User
const adminUser: User = {
  id: 'admin-1',
  name: 'Admin Bimbel',
  email: 'admin@bimbel.id',
  phone: '081234567890',
  role: 'admin',
  createdAt: new Date().toISOString()
}

// Demo Tutors
const tutors: Tutor[] = [
  {
    id: 'tutor-1',
    name: 'Pak Budi Santoso',
    email: 'budi@bimbel.id',
    phone: '081234567891',
    role: 'tutor',
    subjects: ['Matematika', 'Fisika'],
    assignedClasses: ['class-1', 'class-2'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'tutor-2',
    name: 'Bu Siti Rahayu',
    email: 'siti@bimbel.id',
    phone: '081234567892',
    role: 'tutor',
    subjects: ['Bahasa Inggris', 'Bahasa Indonesia'],
    assignedClasses: ['class-3'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'tutor-3',
    name: 'Pak Ahmad Wijaya',
    email: 'ahmad@bimbel.id',
    phone: '081234567893',
    role: 'tutor',
    subjects: ['Kimia', 'Biologi'],
    assignedClasses: ['class-4'],
    createdAt: new Date().toISOString()
  }
]

// Demo Parents
const parents: User[] = [
  {
    id: 'parent-1',
    name: 'Ibu Dewi',
    email: 'dewi@email.com',
    phone: '081345678901',
    role: 'parent',
    studentIds: ['student-1', 'student-2'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'parent-2',
    name: 'Bapak Hendro',
    email: 'hendro@email.com',
    phone: '081345678902',
    role: 'parent',
    studentIds: ['student-3'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'parent-3',
    name: 'Ibu Ratna',
    email: 'ratna@email.com',
    phone: '081345678903',
    role: 'parent',
    studentIds: ['student-4', 'student-5'],
    createdAt: new Date().toISOString()
  }
]

// Demo Students
const students: Student[] = [
  {
    id: 'student-1',
    name: 'Andi Pratama',
    email: 'andi@email.com',
    phone: '081456789012',
    role: 'student',
    grade: 'SMP Kelas 8',
    parentId: 'parent-1',
    enrolledClasses: ['class-1', 'class-3'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'student-2',
    name: 'Rina Pratama',
    email: 'rina@email.com',
    phone: '081456789013',
    role: 'student',
    grade: 'SMP Kelas 7',
    parentId: 'parent-1',
    enrolledClasses: ['class-1'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'student-3',
    name: 'Dimas Kurniawan',
    email: 'dimas@email.com',
    phone: '081456789014',
    role: 'student',
    grade: 'SMA Kelas 10',
    parentId: 'parent-2',
    enrolledClasses: ['class-2', 'class-4'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'student-4',
    name: 'Maya Sari',
    email: 'maya@email.com',
    phone: '081456789015',
    role: 'student',
    grade: 'SMA Kelas 11',
    parentId: 'parent-3',
    enrolledClasses: ['class-2', 'class-3'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'student-5',
    name: 'Rizky Firmansyah',
    email: 'rizky@email.com',
    phone: '081456789016',
    role: 'student',
    grade: 'SMP Kelas 9',
    parentId: 'parent-3',
    enrolledClasses: ['class-1', 'class-4'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'student-6',
    name: 'Putri Amelia',
    email: 'putri@email.com',
    phone: '081456789017',
    role: 'student',
    grade: 'SMA Kelas 12',
    parentId: 'parent-1',
    enrolledClasses: ['class-2', 'class-3', 'class-4'],
    createdAt: new Date().toISOString()
  }
]

// Demo Classes
const classes: Class[] = [
  {
    id: 'class-1',
    name: 'Matematika SMP',
    subject: 'Matematika',
    tutorId: 'tutor-1',
    studentIds: ['student-1', 'student-2', 'student-5'],
    schedule: [
      { day: 'Senin', startTime: '14:00', endTime: '16:00' },
      { day: 'Rabu', startTime: '14:00', endTime: '16:00' }
    ],
    location: DEFAULT_LOCATION,
    createdAt: new Date().toISOString()
  },
  {
    id: 'class-2',
    name: 'Fisika SMA',
    subject: 'Fisika',
    tutorId: 'tutor-1',
    studentIds: ['student-3', 'student-4', 'student-6'],
    schedule: [
      { day: 'Selasa', startTime: '16:00', endTime: '18:00' },
      { day: 'Kamis', startTime: '16:00', endTime: '18:00' }
    ],
    location: DEFAULT_LOCATION,
    createdAt: new Date().toISOString()
  },
  {
    id: 'class-3',
    name: 'Bahasa Inggris',
    subject: 'Bahasa Inggris',
    tutorId: 'tutor-2',
    studentIds: ['student-1', 'student-4', 'student-6'],
    schedule: [
      { day: 'Rabu', startTime: '16:00', endTime: '18:00' },
      { day: 'Sabtu', startTime: '09:00', endTime: '11:00' }
    ],
    location: DEFAULT_LOCATION,
    createdAt: new Date().toISOString()
  },
  {
    id: 'class-4',
    name: 'Kimia & Biologi',
    subject: 'Kimia',
    tutorId: 'tutor-3',
    studentIds: ['student-3', 'student-5', 'student-6'],
    schedule: [
      { day: 'Jumat', startTime: '14:00', endTime: '16:00' }
    ],
    location: DEFAULT_LOCATION,
    createdAt: new Date().toISOString()
  }
]

// Demo Sessions (last 7 days)
const today = new Date()
const sessions: AttendanceSession[] = [
  {
    id: 'session-1',
    classId: 'class-1',
    tutorId: 'tutor-1',
    date: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: '14:00',
    endTime: '16:00',
    qrCode: 'QR-SESSION-1',
    qrExpiry: new Date(today.getTime() + 30 * 60 * 1000).toISOString(),
    status: 'completed',
    createdAt: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'session-2',
    classId: 'class-2',
    tutorId: 'tutor-1',
    date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: '16:00',
    endTime: '18:00',
    qrCode: 'QR-SESSION-2',
    qrExpiry: new Date(today.getTime() + 30 * 60 * 1000).toISOString(),
    status: 'completed',
    createdAt: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'session-3',
    classId: 'class-3',
    tutorId: 'tutor-2',
    date: today.toISOString().split('T')[0],
    startTime: '16:00',
    endTime: '18:00',
    qrCode: 'QR-SESSION-3',
    qrExpiry: new Date(today.getTime() + 30 * 60 * 1000).toISOString(),
    status: 'active',
    createdAt: today.toISOString()
  }
]

// Demo Attendance Records
const attendanceRecords: AttendanceRecord[] = [
  {
    id: 'att-1',
    sessionId: 'session-1',
    studentId: 'student-1',
    status: 'present',
    checkInTime: '14:02',
    verifiedLocation: true,
    createdAt: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'att-2',
    sessionId: 'session-1',
    studentId: 'student-2',
    status: 'late',
    checkInTime: '14:15',
    verifiedLocation: true,
    createdAt: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'att-3',
    sessionId: 'session-1',
    studentId: 'student-5',
    status: 'absent',
    verifiedLocation: false,
    createdAt: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'att-4',
    sessionId: 'session-2',
    studentId: 'student-3',
    status: 'present',
    checkInTime: '16:00',
    verifiedLocation: true,
    createdAt: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'att-5',
    sessionId: 'session-2',
    studentId: 'student-4',
    status: 'present',
    checkInTime: '16:05',
    verifiedLocation: true,
    createdAt: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
]

// Demo Star Ratings
const starRatings: StarRating[] = [
  {
    id: 'rating-1',
    sessionId: 'session-1',
    studentId: 'student-1',
    tutorId: 'tutor-1',
    keaktifan: 5,
    pemahaman: 4,
    sikap: 5,
    comment: 'Sangat aktif dan memahami materi dengan baik',
    createdAt: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'rating-2',
    sessionId: 'session-1',
    studentId: 'student-2',
    tutorId: 'tutor-1',
    keaktifan: 3,
    pemahaman: 4,
    sikap: 4,
    comment: 'Perlu lebih aktif bertanya',
    createdAt: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'rating-3',
    sessionId: 'session-2',
    studentId: 'student-3',
    tutorId: 'tutor-1',
    keaktifan: 4,
    pemahaman: 5,
    sikap: 4,
    comment: 'Pemahaman materi sangat baik',
    createdAt: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
]

// Demo Notifications
const notifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'admin-1',
    type: 'attendance',
    title: 'Absensi Berhasil',
    message: 'Andi Pratama telah berhasil absen untuk kelas Matematika SMP',
    read: false,
    createdAt: new Date(today.getTime() - 1 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'notif-2',
    userId: 'admin-1',
    type: 'evaluation',
    title: 'Evaluasi Baru',
    message: 'Pak Budi Santoso telah memberikan evaluasi untuk 2 siswa',
    read: false,
    createdAt: new Date(today.getTime() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'notif-3',
    userId: 'parent-1',
    type: 'attendance',
    title: 'Konfirmasi Kehadiran',
    message: 'Anak Anda, Andi Pratama, telah hadir di kelas Matematika SMP',
    read: true,
    createdAt: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'notif-4',
    userId: 'parent-1',
    type: 'evaluation',
    title: 'Laporan Evaluasi',
    message: 'Evaluasi baru tersedia untuk Andi Pratama',
    read: false,
    createdAt: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
]

export function initializeMockData(): void {
  setUsers([adminUser, ...parents])
  setStudents(students)
  setTutors(tutors)
  setClasses(classes)
  setSessions(sessions)
  setAttendanceRecords(attendanceRecords)
  setStarRatings(starRatings)
  setNotifications(notifications)
}

// Demo login credentials
export const DEMO_CREDENTIALS = {
  admin: { email: 'admin@bimbel.id', password: 'admin123' },
  tutor: { email: 'budi@bimbel.id', password: 'tutor123' },
  student: { email: 'andi@email.com', password: 'student123' },
  parent: { email: 'dewi@email.com', password: 'parent123' }
}
