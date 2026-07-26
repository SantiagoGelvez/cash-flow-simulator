/**
 * Thin, defensive wrapper around localStorage: a corrupted or missing entry
 * degrades to the caller's fallback instead of throwing into the app.
 */
export function readLocalStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeLocalStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage full/unavailable (private browsing, quota, etc.) — fail silently,
    // the in-memory state is still usable for the rest of the session.
  }
}

export function removeLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch {
    // ignore
  }
}
