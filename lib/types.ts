// User Roles
export type UserRole = 'admin' | 'tutor' | 'student' | 'parent'

// User Interface
export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: UserRole
  avatar?: string
  createdAt: string
  parentId?: string // For students - links to parent
  studentIds?: string[] // For parents - links to students
}

// Student extends User with additional fields
export interface Student extends User {
  role: 'student'
  parentId: string
  grade: string
  enrolledClasses: string[]
}

// Tutor extends User
export interface Tutor extends User {
  role: 'tutor'
  subjects: string[]
  assignedClasses: string[]
}

// Class/Course
export interface Class {
  id: string
  name: string
  subject: string
  tutorId: string
  studentIds: string[]
  schedule: Schedule[]
  location: Location
  createdAt: string
}

export interface Schedule {
  day: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu' | 'Minggu'
  startTime: string
  endTime: string
}

export interface Location {
  name: string
  address: string
  latitude: number
  longitude: number
  radius: number // in meters
}

// Attendance
export interface AttendanceSession {
  id: string
  classId: string
  tutorId: string
  date: string
  startTime: string
  endTime: string
  qrCode: string
  qrExpiry: string
  status: 'active' | 'completed' | 'cancelled'
  createdAt: string
}

export interface AttendanceRecord {
  id: string
  sessionId: string
  studentId: string
  status: 'present' | 'late' | 'absent' | 'excused'
  checkInTime?: string
  location?: {
    latitude: number
    longitude: number
    accuracy: number
  }
  verifiedLocation: boolean
  notes?: string
  createdAt: string
}

// Evaluation - Star Rating
export interface StarRating {
  id: string
  sessionId: string
  studentId: string
  tutorId: string
  keaktifan: number // 1-5
  pemahaman: number // 1-5
  sikap: number // 1-5
  comment?: string
  createdAt: string
}

// Evaluation - Rubric
export interface RubricCriteria {
  id: string
  name: string
  description: string
  weight: number // percentage
  category: 'kognitif' | 'afektif' | 'psikomotorik'
}

export interface RubricScore {
  criteriaId: string
  score: 'A' | 'B' | 'C' | 'D' | 'E'
  notes?: string
}

export interface RubricEvaluation {
  id: string
  sessionId: string
  studentId: string
  tutorId: string
  scores: RubricScore[]
  overallComment?: string
  createdAt: string
}

// Notifications
export type NotificationType = 'attendance' | 'evaluation' | 'reminder' | 'announcement' | 'system'

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  data?: Record<string, unknown>
  createdAt: string
}

// QR Code Data
export interface QRCodeData {
  sessionId: string
  classId: string
  timestamp: number
  expiry: number
  signature: string
}

// Auth State
export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

// Dashboard Stats
export interface DashboardStats {
  totalStudents: number
  totalTutors: number
  totalClasses: number
  todaySessions: number
  attendanceRate: number
  averageRating: number
}

// Form Types
export interface LoginForm {
  email: string
  password: string
}

export interface StudentForm {
  name: string
  email: string
  phone: string
  grade: string
  parentName: string
  parentEmail: string
  parentPhone: string
}

export interface ClassForm {
  name: string
  subject: string
  tutorId: string
  schedule: Schedule[]
}

// Chart Data
export interface AttendanceChartData {
  date: string
  hadir: number
  terlambat: number
  absen: number
}

export interface EvaluationChartData {
  name: string
  keaktifan: number
  pemahaman: number
  sikap: number
}
