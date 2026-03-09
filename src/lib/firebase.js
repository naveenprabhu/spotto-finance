import { initializeApp } from 'firebase/app'
import { getAnalytics, logEvent } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)

export function logScreenView(screenName) {
  logEvent(analytics, 'screen_view', { screen_name: screenName, screen_class: 'Main' })
}

export function logButtonClick(buttonName) {
  logEvent(analytics, 'button_click', { button_name: buttonName })
}

export function logApiFailure(apiName, error) {
  logEvent(analytics, 'api_call_failure', { error_message: error?.message, apiName })
}

export function logApiSuccess(apiName) {
  logEvent(analytics, 'api_call_success', { apiName })
}

export function logUserAction(actionName) {
  logEvent(analytics, 'user_action', { action_name: actionName })
}
