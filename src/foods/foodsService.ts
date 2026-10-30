import { initialFoodState, type FoodState } from './foodsStore'

const STORAGE_KEY = 'leafy-foods-state-v1'

export function loadFoodState(): FoodState {
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return initialFoodState
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') throw new Error('Saved Leafy Foods data is malformed.')
    return { ...initialFoodState, ...(parsed as Partial<FoodState>) }
  } catch (error) {
    console.error('Unable to load saved Leafy Foods data.', error)
    window.localStorage.removeItem(STORAGE_KEY)
    return initialFoodState
  }
}

export function saveFoodState(state: FoodState): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export async function readFoodApi<T>(response: Response, unavailableMessage: string): Promise<T> {
  if (!response.headers.get('content-type')?.includes('application/json')) {
    throw new Error(`${unavailableMessage} (HTTP ${response.status}; no JSON response was returned).`)
  }
  try {
    return await response.json() as T
  } catch (error) {
    throw new Error(`${unavailableMessage} (HTTP ${response.status}; the response was invalid JSON).`, { cause: error })
  }
}

export function foodCsv(filename: string, rows: string[][]): void {
  const body = rows.map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(',')).join('\r\n')
  const url = URL.createObjectURL(new Blob([body], { type: 'text/csv;charset=utf-8' }))
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}
