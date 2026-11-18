import { resolve, mock } from './apiClient'
import { currentUser } from '@/data/users'

/** GET /users/me */
export function getCurrentUser() {
  return resolve({ path: '/users/me', mockFn: () => mock(currentUser) })
}
