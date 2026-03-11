const STORAGE_KEY = 'moodloop_entries'

export function loadEntries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

export function addEntry(entry) {
  const entries = loadEntries()
  entries.unshift(entry)
  saveEntries(entries)
  return entries
}

export function updateEntry(id, updates) {
  const entries = loadEntries()
  const idx = entries.findIndex((e) => e.id === id)
  if (idx !== -1) {
    entries[idx] = { ...entries[idx], ...updates }
    saveEntries(entries)
  }
  return entries
}

export function deleteEntry(id) {
  const entries = loadEntries().filter((e) => e.id !== id)
  saveEntries(entries)
  return entries
}

export function getEntry(id) {
  return loadEntries().find((e) => e.id === id) || null
}
