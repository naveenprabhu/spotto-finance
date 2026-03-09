const BASE = 'https://9v4qfkzq5g.execute-api.ap-southeast-2.amazonaws.com/dev'

async function post(path, data) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export const sendOtp = (mobileNumber) => post('/sendotp', { mobileNumber })
export const verifyOtp = (mobileNumber, code) => post('/verifyotp', { mobileNumber, code })
export const sendEmail = (data) => post('/sendemail', data)
