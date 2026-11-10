import { useEffect, useState } from 'react'
import loaderAnimation from './assets/Leafy Logo Loader Animation.gif'
import officialLogo from './assets/officialogo.png'

export function LeafyLoading() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), 120)
    return () => window.clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center bg-[#F7F9F4] p-6"
    >
      <picture>
        <source media="(prefers-reduced-motion: reduce)" srcSet={officialLogo} />
        <img
          src={loaderAnimation}
          alt="Leafy is loading"
          className="h-auto max-h-[65svh] w-56 max-w-[72vw] object-contain sm:w-72"
        />
      </picture>
      <span className="sr-only">Loading page content</span>
    </div>
  )
}
