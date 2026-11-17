const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()
export const API_BASE_URL = (configuredBaseUrl || '/api/v1').replace(/\/$/, '')

export class ApiError extends Error {
  status: number
  code?: string

  constructor(message: string, status: number, code?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

type ErrorResponse = { error?: { message?: string; code?: string } }

export async function apiRequest<T>(path: string, init: RequestInit = {}, accessToken?: string): Promise<T> {
  const headers = new Headers(init.headers)
  if (init.body && !(init.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`)

  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers,
      credentials: 'include',
    })
  } catch {
    throw new ApiError('Could not connect to Leafy. Check your connection and try again.', 0, 'NETWORK_ERROR')
  }

  if (response.status === 204) return undefined as T
  const contentType = response.headers.get('content-type') ?? ''
  const payload = contentType.includes('application/json') ? await response.json() as T & ErrorResponse : undefined
  if (!response.ok) {
    throw new ApiError(
      payload?.error?.message ?? `Leafy API request failed (HTTP ${response.status}).`,
      response.status,
      payload?.error?.code,
    )
  }
  if (!payload) throw new ApiError('Leafy returned an unexpected response.', response.status, 'INVALID_RESPONSE')
  return payload
}

export type PublicUser = {
  id: string
  email: string | null
  emailVerified: boolean
  createdAt: string
  metadata: { fullName: string | null; phone: string | null; avatarUrl?: string | null }
}

export type PublicSession = {
  accessToken: string
  tokenType: string
  expiresAt: number
  expiresIn: number
}

type SessionResponse = { data: { user: PublicUser; session: PublicSession } }
type RegisterResponse = { message: string; data: { session: null } }

export const authApi = {
  register(input: { name: string; email: string; phone: string; password: string; confirmPassword: string }) {
    return apiRequest<RegisterResponse>('/auth/register', { method: 'POST', body: JSON.stringify(input) })
  },
  login(input: { email: string; password: string }) {
    return apiRequest<SessionResponse>('/auth/login', { method: 'POST', body: JSON.stringify(input) })
  },
  google(input: { credential?: string; code?: string }) {
    return apiRequest<SessionResponse>('/auth/google', { method: 'POST', body: JSON.stringify(input) })
  },
  getGoogleOAuthUrl(returnTo = '/dashboard') {
    return `${API_BASE_URL}/auth/google?returnTo=${encodeURIComponent(returnTo)}`
  },
  refresh() {
    return apiRequest<SessionResponse>('/auth/refresh', { method: 'POST' })
  },
  logout(accessToken: string) {
    return apiRequest<void>('/auth/logout', { method: 'POST' }, accessToken)
  },
  me(accessToken: string) {
    return apiRequest<{ data: { user: PublicUser; profile: unknown } }>('/auth/me', {}, accessToken)
  },
  requestPasswordReset(email: string) {
    return apiRequest<{ message: string }>('/auth/password-reset', { method: 'POST', body: JSON.stringify({ email }) })
  },
  updatePassword(accessToken: string, password: string) {
    return apiRequest<void>('/auth/password', { method: 'POST', body: JSON.stringify({ password }) }, accessToken)
  },
}

export const healthApi = {
  live: () => apiRequest<{ status: string }>('/health/live'),
  ready: () => apiRequest<{ status: string }>('/health/ready'),
}

export type ContactTopic = 'General question' | 'Volunteering' | 'Partnership' | 'Community initiative' | 'Story consent'
export const contactApi = {
  submit(input: { name: string; email: string; topic: ContactTopic; message: string }) {
    return apiRequest<{ message: string; data: { id: string; name: string; email: string; topic: ContactTopic; status: string; createdAt: string } }>(
      '/contact', { method: 'POST', body: JSON.stringify(input) },
    )
  },
}

export type Innovation = {
  id: string
  title: string
  summary: string
  description?: string
  agricultural_sector: string
  development_stage: string
  support_needs?: string[]
  status?: string
  submitted_at?: string | null
  created_at?: string
  updated_at?: string
}

type InnovationResult<T> = { data: T }
export const innovationApi = {
  browse(params: { limit?: number; offset?: number } = {}) {
    const query = new URLSearchParams()
    if (params.limit !== undefined) query.set('limit', String(params.limit))
    if (params.offset !== undefined) query.set('offset', String(params.offset))
    return apiRequest<{ data: Innovation[]; pagination: { limit: number; offset: number; count: number } }>(`/innovations${query.size ? `?${query}` : ''}`)
  },
  mine(accessToken: string) {
    return apiRequest<InnovationResult<Innovation[]>>('/innovations/mine', {}, accessToken)
  },
  get(innovationId: string) {
    return apiRequest<InnovationResult<Innovation>>(`/innovations/${encodeURIComponent(innovationId)}`)
  },
  create(accessToken: string, input: {
    title: string
    summary: string
    description: string
    agriculturalSector: string
    developmentStage: string
    supportNeeds?: string[]
    organisationId?: string
  }) {
    return apiRequest<InnovationResult<Innovation>>('/innovations', { method: 'POST', body: JSON.stringify(input) }, accessToken)
  },
  update(accessToken: string, innovationId: string, input: Partial<{
    title: string
    summary: string
    description: string
    agriculturalSector: string
    developmentStage: string
    supportNeeds: string[]
  }>) {
    return apiRequest<InnovationResult<Innovation>>(`/innovations/${encodeURIComponent(innovationId)}`, { method: 'PATCH', body: JSON.stringify(input) }, accessToken)
  },
  submit(accessToken: string, innovationId: string) {
    return apiRequest<InnovationResult<Innovation>>(`/innovations/${encodeURIComponent(innovationId)}/submit`, { method: 'POST' }, accessToken)
  },
}
