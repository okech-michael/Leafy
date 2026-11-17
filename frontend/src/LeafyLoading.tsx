import { useEffect, useState } from 'react'
import loaderAnimation from './assets/Leafy Logo Loader Transparent.gif'
import officialLogo from './assets/officialogo.png'

const LOADING_INDICATOR_DELAY = 180

export function LeafyLoading() {
  const [shouldShow, setShouldShow] = useState(false)
  const [animationReady, setAnimationReady] = useState(false)
  const [animationFailed, setAnimationFailed] = useState(false)
  const [logoFailed, setLogoFailed] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setShouldShow(true), LOADING_INDICATOR_DELAY)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <>
      <link
        rel="preload"
        as="image"
        href={loaderAnimation}
        media="(prefers-reduced-motion: no-preference)"
        fetchPriority="low"
      />
      {shouldShow && (
        <div
          role="status"
          aria-live="polite"
          aria-busy="true"
          className="flex min-h-48 w-full items-center justify-center py-8"
        >
          <div className="relative h-16 w-24">
            {!logoFailed ? (
              <img
                src={officialLogo}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-contain"
                onError={() => setLogoFailed(true)}
              />
            ) : (
              <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-[#0B3D2E]">
                Leafy
              </span>
            )}
            {!animationFailed && (
              <picture
                className={`absolute inset-0 transition-opacity duration-100 ${
                  animationReady ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <source media="(prefers-reduced-motion: reduce)" srcSet={officialLogo} />
                <img
                  src={loaderAnimation}
                  alt=""
                  aria-hidden="true"
                  className="h-full w-full object-contain"
                  onLoad={() => setAnimationReady(true)}
                  onError={() => setAnimationFailed(true)}
                />
              </picture>
            )}
          </div>
          <span className="sr-only">Loading page content</span>
        </div>
      )}
    </>
  )
}
