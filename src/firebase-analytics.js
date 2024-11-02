// Import the functions you need from the Firebase SDK
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js';
import { getAnalytics, logEvent } from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-analytics.js';

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyBmDhYZawBfB-Rwoj4up2JFPxpBepY69mQ",
	authDomain: "spotto-finance.firebaseapp.com",
	projectId: "spotto-finance",
	storageBucket: "spotto-finance.firebasestorage.app",
	messagingSenderId: "4512021352",
	appId: "1:4512021352:web:6497bff497ef537dd3b4dd",
	measurementId: "G-X5TNX7N05Q"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Analytics
const analytics = getAnalytics(app);

// Export the analytics instance for use in other files
export { analytics, logEvent };
