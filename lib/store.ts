import { STORAGE_KEYS } from './constants'
import type {
  User,
  Student,
  Tutor,
  Class,
  AttendanceSession,
  AttendanceRecord,
  StarRating,
  RubricEvaluation,
  Notification,
  AuthState
} from './types'

// Helper to safely access localStorage
const isBrowser = typeof window !== 'undefined'

function getItem<T>(key: string, defaultValue: T): T {
  if (!isBrowser) return defaultValue
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

function setItem<T>(key: string, value: T): void {
  if (!isBrowser) return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

// Auth
export function getAuth(): AuthState {
  return getItem<AuthState>(STORAGE_KEYS.AUTH, { user: null, isAuthenticated: false })
}

export function setAuth(auth: AuthState): void {
  setItem(STORAGE_KEYS.AUTH, auth)
}

export function logout(): void {
  setAuth({ user: null, isAuthenticated: false })
}

// Users
export function getUsers(): User[] {
  return getItem<User[]>(STORAGE_KEYS.USERS, [])
}

export function setUsers(users: User[]): void {
  setItem(STORAGE_KEYS.USERS, users)
}

export function getUserById(id: string): User | undefined {
  return getUsers().find(u => u.id === id)
}

export function addUser(user: User): void {
  const users = getUsers()
  users.push(user)
  setUsers(users)
}

// Students
export function getStudents(): Student[] {
  return getItem<Student[]>(STORAGE_KEYS.STUDENTS, [])
}

export function setStudents(students: Student[]): void {
  setItem(STORAGE_KEYS.STUDENTS, students)
}

export function getStudentById(id: string): Student | undefined {
  return getStudents().find(s => s.id === id)
}

export function addStudent(student: Student): void {
  const students = getStudents()
  students.push(student)
  setStudents(students)
}

export function updateStudent(id: string, data: Partial<Student>): void {
  const students = getStudents()
  const index = students.findIndex(s => s.id === id)
  if (index !== -1) {
    students[index] = { ...students[index], ...data }
    setStudents(students)
  }
}

export function deleteStudent(id: string): void {
  const students = getStudents().filter(s => s.id !== id)
  setStudents(students)
}

// Tutors
export function getTutors(): Tutor[] {
  return getItem<Tutor[]>(STORAGE_KEYS.TUTORS, [])
}

export function setTutors(tutors: Tutor[]): void {
  setItem(STORAGE_KEYS.TUTORS, tutors)
}

export function getTutorById(id: string): Tutor | undefined {
  return getTutors().find(t => t.id === id)
}

export function addTutor(tutor: Tutor): void {
  const tutors = getTutors()
  tutors.push(tutor)
  setTutors(tutors)
}

export function updateTutor(id: string, data: Partial<Tutor>): void {
  const tutors = getTutors()
  const index = tutors.findIndex(t => t.id === id)
  if (index !== -1) {
    tutors[index] = { ...tutors[index], ...data }
    setTutors(tutors)
  }
}

export function deleteTutor(id: string): void {
  const tutors = getTutors().filter(t => t.id !== id)
  setTutors(tutors)
}

// Classes
export function getClasses(): Class[] {
  return getItem<Class[]>(STORAGE_KEYS.CLASSES, [])
}

export function setClasses(classes: Class[]): void {
  setItem(STORAGE_KEYS.CLASSES, classes)
}

export function getClassById(id: string): Class | undefined {
  return getClasses().find(c => c.id === id)
}

export function addClass(cls: Class): void {
  const classes = getClasses()
  classes.push(cls)
  setClasses(classes)
}

export function updateClass(id: string, data: Partial<Class>): void {
  const classes = getClasses()
  const index = classes.findIndex(c => c.id === id)
  if (index !== -1) {
    classes[index] = { ...classes[index], ...data }
    setClasses(classes)
  }
}

export function deleteClass(id: string): void {
  const classes = getClasses().filter(c => c.id !== id)
  setClasses(classes)
}

// Attendance Sessions
export function getSessions(): AttendanceSession[] {
  return getItem<AttendanceSession[]>(STORAGE_KEYS.SESSIONS, [])
}

export function setSessions(sessions: AttendanceSession[]): void {
  setItem(STORAGE_KEYS.SESSIONS, sessions)
}

export function getSessionById(id: string): AttendanceSession | undefined {
  return getSessions().find(s => s.id === id)
}

export function addSession(session: AttendanceSession): void {
  const sessions = getSessions()
  sessions.push(session)
  setSessions(sessions)
}

export function updateSession(id: string, data: Partial<AttendanceSession>): void {
  const sessions = getSessions()
  const index = sessions.findIndex(s => s.id === id)
  if (index !== -1) {
    sessions[index] = { ...sessions[index], ...data }
    setSessions(sessions)
  }
}

// Attendance Records
export function getAttendanceRecords(): AttendanceRecord[] {
  return getItem<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, [])
}

export function setAttendanceRecords(records: AttendanceRecord[]): void {
  setItem(STORAGE_KEYS.ATTENDANCE, records)
}

export function getAttendanceBySession(sessionId: string): AttendanceRecord[] {
  return getAttendanceRecords().filter(r => r.sessionId === sessionId)
}

export function getAttendanceByStudent(studentId: string): AttendanceRecord[] {
  return getAttendanceRecords().filter(r => r.studentId === studentId)
}

export function addAttendanceRecord(record: AttendanceRecord): void {
  const records = getAttendanceRecords()
  records.push(record)
  setAttendanceRecords(records)
}

export function updateAttendanceRecord(id: string, data: Partial<AttendanceRecord>): void {
  const records = getAttendanceRecords()
  const index = records.findIndex(r => r.id === id)
  if (index !== -1) {
    records[index] = { ...records[index], ...data }
    setAttendanceRecords(records)
  }
}

// Star Ratings
export function getStarRatings(): StarRating[] {
  return getItem<StarRating[]>(STORAGE_KEYS.STAR_RATINGS, [])
}

export function setStarRatings(ratings: StarRating[]): void {
  setItem(STORAGE_KEYS.STAR_RATINGS, ratings)
}

export function getStarRatingsByStudent(studentId: string): StarRating[] {
  return getStarRatings().filter(r => r.studentId === studentId)
}

export function addStarRating(rating: StarRating): void {
  const ratings = getStarRatings()
  ratings.push(rating)
  setStarRatings(ratings)
}

// Rubric Evaluations
export function getRubricEvaluations(): RubricEvaluation[] {
  return getItem<RubricEvaluation[]>(STORAGE_KEYS.RUBRIC_EVALUATIONS, [])
}

export function setRubricEvaluations(evaluations: RubricEvaluation[]): void {
  setItem(STORAGE_KEYS.RUBRIC_EVALUATIONS, evaluations)
}

export function getRubricEvaluationsByStudent(studentId: string): RubricEvaluation[] {
  return getRubricEvaluations().filter(e => e.studentId === studentId)
}

export function addRubricEvaluation(evaluation: RubricEvaluation): void {
  const evaluations = getRubricEvaluations()
  evaluations.push(evaluation)
  setRubricEvaluations(evaluations)
}

// Notifications
export function getNotifications(): Notification[] {
  return getItem<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, [])
}

export function setNotifications(notifications: Notification[]): void {
  setItem(STORAGE_KEYS.NOTIFICATIONS, notifications)
}

export function getNotificationsByUser(userId: string): Notification[] {
  return getNotifications().filter(n => n.userId === userId)
}

export function getUnreadNotifications(userId: string): Notification[] {
  return getNotificationsByUser(userId).filter(n => !n.read)
}

export function addNotification(notification: Notification): void {
  const notifications = getNotifications()
  notifications.unshift(notification)
  setNotifications(notifications)
}

export function markNotificationAsRead(id: string): void {
  const notifications = getNotifications()
  const index = notifications.findIndex(n => n.id === id)
  if (index !== -1) {
    notifications[index].read = true
    setNotifications(notifications)
  }
}

export function markAllNotificationsAsRead(userId: string): void {
  const notifications = getNotifications()
  notifications.forEach(n => {
    if (n.userId === userId) {
      n.read = true
    }
  })
  setNotifications(notifications)
}

// Generate unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Initialize with mock data if empty
export function initializeStore(): void {
  if (!isBrowser) return
  
  // Check if already initialized
  const users = getUsers()
  if (users.length > 0) return
  
  // Import and set mock data
  import('./mock-data').then(({ initializeMockData }) => {
    initializeMockData()
  })
}
