import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import loaderAnimation from './assets/Leafy Logo Loader Animation.gif'
import officialLogo from './assets/officialogo.png'

const LoadingContext = createContext<(() => () => void) | null>(null)

export function LeafyLoadingProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState(false)
  const [delayElapsed, setDelayElapsed] = useState(false)
  const [assetReady, setAssetReady] = useState(false)
  const [assetFailed, setAssetFailed] = useState(false)
  const [fallbackFailed, setFallbackFailed] = useState(false)
  const visible = pending && delayElapsed && assetReady
  const pendingCount = useRef(0)
  const delayTimer = useRef<number | null>(null)

  const beginLoading = useCallback(() => {
    pendingCount.current += 1

    if (pendingCount.current === 1) {
      setPending(true)
      setDelayElapsed(false)
      if (delayTimer.current !== null) window.clearTimeout(delayTimer.current)
      delayTimer.current = window.setTimeout(() => {
        delayTimer.current = null
        setDelayElapsed(true)
      }, 120)
    }

    let active = true
    return () => {
      if (!active) return
      active = false
      pendingCount.current = Math.max(0, pendingCount.current - 1)

      if (pendingCount.current === 0) {
        if (delayTimer.current !== null) window.clearTimeout(delayTimer.current)
        delayTimer.current = null
        setPending(false)
        setDelayElapsed(false)
      }
    }
  }, [])

  useEffect(() => () => {
    if (delayTimer.current !== null) window.clearTimeout(delayTimer.current)
  }, [])

  return (
    <LoadingContext.Provider value={beginLoading}>
      {children}
      <link rel="preload" as="image" href={loaderAnimation} fetchPriority="high" />
      <div
        role={visible ? 'status' : undefined}
        aria-live="polite"
        aria-busy={visible}
        aria-hidden={!visible}
        className={`fixed inset-0 z-[100] flex min-h-screen items-center justify-center bg-[#F7F9F4] p-6 transition-opacity duration-150 ${
          visible ? 'visible opacity-100' : 'pointer-events-none invisible opacity-0'
        }`}
      >
        <picture>
          <source media="(prefers-reduced-motion: reduce)" srcSet={officialLogo} />
          {!fallbackFailed ? (
            <img
              src={assetFailed ? officialLogo : loaderAnimation}
              alt={visible ? 'Leafy is loading' : ''}
              fetchPriority="high"
              className="h-auto max-h-[65svh] w-56 max-w-[72vw] object-contain sm:w-72"
              onLoad={(event) => {
                const image = event.currentTarget
                if (!assetFailed && image.currentSrc.endsWith('.gif')) {
                  void image.decode().then(
                    () => setAssetReady(true),
                    () => {
                      if (image.naturalWidth > 0) setAssetReady(true)
                      else setAssetFailed(true)
                    },
                  )
                } else {
                  setAssetReady(true)
                }
              }}
              onError={() => {
                if (assetFailed) {
                  setFallbackFailed(true)
                  setAssetReady(true)
                } else {
                  setAssetFailed(true)
                  setAssetReady(false)
                }
              }}
            />
          ) : (
            <span className="text-2xl font-semibold tracking-tight text-[#0B3D2E]">Leafy</span>
          )}
        </picture>
        <span className="sr-only">Loading page content</span>
      </div>
    </LoadingContext.Provider>
  )
}

export function LeafyLoading() {
  const beginLoading = useContext(LoadingContext)

  if (!beginLoading) throw new Error('LeafyLoading must be used within LeafyLoadingProvider.')

  useEffect(() => beginLoading(), [beginLoading])
  return null
}
