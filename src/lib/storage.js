const KEY = 'userData'
const TTL = 3_600_000 // 1 hour

export function saveUserData(name, mobileNumber) {
  localStorage.setItem(KEY, JSON.stringify({
    name,
    mobileNumber,
    expiry: Date.now() + TTL,
  }))
}

export function getUserData() {
  const raw = localStorage.getItem(KEY)
  if (!raw) return null
  const item = JSON.parse(raw)
  if (Date.now() > item.expiry) {
    localStorage.removeItem(KEY)
    return null
  }
  return item
}

export function formatPhone(raw) {
  const digits = raw.replace(/\D/g, '')
  let formatted
  if (digits.startsWith('0') && digits.length === 10) {
    formatted = `+61${digits.slice(1)}`
  } else if (digits.startsWith('61') && digits.length === 11) {
    formatted = `+${digits}`
  } else {
    return null // invalid AU mobile
  }
  // Must match +61XXXXXXXXX
  if (!/^\+61\d{9}$/.test(formatted)) return null
  return formatted
}
