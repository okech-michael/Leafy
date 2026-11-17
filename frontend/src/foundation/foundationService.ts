import { initialFoundationState, type FoundationState } from './foundationStore'

const STORAGE_KEY = 'leafy-foundation-state-v1'

export function loadFoundationState(): FoundationState {
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return initialFoundationState
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') throw new Error('Saved Foundation data is malformed.')
    return { ...initialFoundationState, ...(parsed as Partial<FoundationState>) }
  } catch (error) {
    console.error('Unable to load saved Foundation data.', error)
    window.localStorage.removeItem(STORAGE_KEY)
    return initialFoundationState
  }
}

export function saveFoundationState(state: FoundationState): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function foundationId(prefix: string): string {
  return `${prefix}-${globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`}`
}
