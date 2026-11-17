import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { authApi, type PublicUser } from '../lib/api'

type AuthContextValue = {
  user: PublicUser | null
  accessToken: string | null
  ready: boolean
  login: (input: { email: string; password: string }) => Promise<PublicUser>
  loginWithGoogle: (input: { credential?: string; code?: string }) => Promise<PublicUser>
  setSessionFromToken: (token: string) => Promise<PublicUser>
  register: (input: { name: string; email: string; phone: string; password: string; confirmPassword: string }) => Promise<string>
  logout: () => Promise<void>
  updatePassword: (password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  const applySession = useCallback(async (result: Awaited<ReturnType<typeof authApi.refresh>>) => {
    const current = await authApi.me(result.data.session.accessToken)
    setUser(current.data.user)
    setAccessToken(result.data.session.accessToken)
    setReady(true)
    return current.data.user
  }, [])

  useEffect(() => {
    let active = true
    authApi.refresh()
      .then((result) => {
        if (active) applySession(result)
      })
      .catch(() => {
        if (active) {
          setUser(null)
          setAccessToken(null)
          setReady(true)
        }
      })
    return () => { active = false }
  }, [applySession])

  const setSessionFromToken = useCallback(async (token: string) => {
    const current = await authApi.me(token)
    setUser(current.data.user)
    setAccessToken(token)
    setReady(true)
    return current.data.user
  }, [])

  const login = useCallback(async (input: { email: string; password: string }) => {
    const result = await authApi.login(input)
    const current = await authApi.me(result.data.session.accessToken)
    setUser(current.data.user)
    setAccessToken(result.data.session.accessToken)
    return current.data.user
  }, [])

  const loginWithGoogle = useCallback(async (input: { credential?: string; code?: string }) => {
    const result = await authApi.google(input)
    const current = await authApi.me(result.data.session.accessToken)
    setUser(current.data.user)
    setAccessToken(result.data.session.accessToken)
    return current.data.user
  }, [])

  const register = useCallback(async (input: { name: string; email: string; phone: string; password: string; confirmPassword: string }) => {
    const result = await authApi.register(input)
    return result.message
  }, [])

  const logout = useCallback(async () => {
    const token = accessToken
    try {
      if (token) await authApi.logout(token)
    } finally {
      setUser(null)
      setAccessToken(null)
    }
  }, [accessToken])

  const updatePassword = useCallback(async (password: string) => {
    if (!accessToken) throw new Error('Sign in to update your password.')
    await authApi.updatePassword(accessToken, password)
  }, [accessToken])

  const value = useMemo(
    () => ({ user, accessToken, ready, login, loginWithGoogle, setSessionFromToken, register, logout, updatePassword }),
    [user, accessToken, ready, login, loginWithGoogle, setSessionFromToken, register, logout, updatePassword]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider.')
  return context
}
