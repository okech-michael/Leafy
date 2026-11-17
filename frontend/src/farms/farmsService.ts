import { initialFarmsState, type FarmsState } from './farmsStore'

const STORAGE_KEY = 'leafy-farms-state-v1'

export function loadFarmsState(): FarmsState {
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return initialFarmsState

  try {
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') throw new Error('Saved Farms data is not an object.')
    return { ...initialFarmsState, ...(parsed as Partial<FarmsState>) }
  } catch (error) {
    console.error('Unable to load saved Leafy Farms data.', error)
    window.localStorage.removeItem(STORAGE_KEY)
    return initialFarmsState
  }
}

export function saveFarmsState(state: FarmsState): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function downloadFarmCsv(filename: string, rows: string[][]): void {
  const escape = (value: string) => `"${value.replaceAll('"', '""')}"`
  const contents = rows.map((row) => row.map(escape).join(',')).join('\r\n')
  const url = URL.createObjectURL(new Blob([contents], { type: 'text/csv;charset=utf-8' }))
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

export async function farmsApi<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api/farms${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })
  if (!response.ok) {
    throw new Error(`Leafy Farms service returned HTTP ${response.status}.`)
  }
  const contentType = response.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) {
    throw new Error('Leafy Farms service returned an unexpected response.')
  }
  return await response.json() as T
}
