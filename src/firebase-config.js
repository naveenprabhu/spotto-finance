// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import {
  getAnalytics,
  logEvent,
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-analytics.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBmDhYZawBfB-Rwoj4up2JFPxpBepY69mQ",
  authDomain: "spotto-finance.firebaseapp.com",
  projectId: "spotto-finance",
  storageBucket: "spotto-finance.firebasestorage.app",
  messagingSenderId: "4512021352",
  appId: "1:4512021352:web:6497bff497ef537dd3b4dd",
  measurementId: "G-X5TNX7N05Q",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); // Keep the analytics instance for use

function logScreenView(screenName) {
  logEvent(analytics, "screen_view", {
    screen_name: screenName,
    screen_class: "Main",
  });
  console.log("Screen view logged:", screenName);
}

// Log a button click event
function logButtonClick(buttonName) {
  logEvent(analytics, "button_click", { button_name: buttonName });
}

function logApiFailure(apiName, error) {
  logEvent(analytics, "api_call_failure", {
    error_message: error.message, // Log the error message
    apiName: apiName, // Optionally log the API endpoint
  });
}

function logApiSuccess(apiName) {
  logEvent(analytics, "api_call_success", {
    apiName: apiName, // Optionally log the API endpoint
  });
}

function logUserAction(actionName) {
  logEvent(analytics, "user_action", {
    action_name: actionName,
  });
}

// Assign it to the global scope
window.logScreenView = logScreenView;
window.logButtonClick = logButtonClick; // Make logEvent globally accessible
window.logApiFailure = logApiFailure; // Make logEvent globally accessible
window.logApiSuccess = logApiSuccess; // Make logEvent globally accessible
window.logUserAction = logUserAction; // Make logEvent globally accessible
