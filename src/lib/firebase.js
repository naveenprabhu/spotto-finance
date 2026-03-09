import { initializeApp } from 'firebase/app'
import { getAnalytics, logEvent } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: "AIzaSyBmDhYZawBfB-Rwoj4up2JFPxpBepY69mQ",
  authDomain: "spotto-finance.firebaseapp.com",
  projectId: "spotto-finance",
  storageBucket: "spotto-finance.firebasestorage.app",
  messagingSenderId: "4512021352",
  appId: "1:4512021352:web:6497bff497ef537dd3b4dd",
  measurementId: "G-X5TNX7N05Q",
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
