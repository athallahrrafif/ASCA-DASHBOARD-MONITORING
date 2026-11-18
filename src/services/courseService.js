import { resolve, mock } from './apiClient'
import { courses, programs } from '@/data/courses'

/** GET /courses */
export function getCourses(params = {}) {
  const { search = '', semester = 'all', type = 'all', sks = 'all', programId = 'all' } = params

  return resolve({
    path: '/courses',
    params,
    mockFn: () => {
      const filtered = courses.filter((course) => {
        if (search && !`${course.name} ${course.code}`.toLowerCase().includes(search.toLowerCase())) return false
        if (semester !== 'all' && String(course.semester) !== String(semester)) return false
        if (type !== 'all' && course.type !== type) return false
        if (sks !== 'all' && String(course.sks) !== String(sks)) return false
        if (programId !== 'all' && course.programId !== programId) return false
        return true
      })
      return mock(filtered, { total: filtered.length })
    },
  })
}

/** GET /courses/programs */
export function getPrograms() {
  return resolve({ path: '/courses/programs', mockFn: () => mock(programs) })
}
