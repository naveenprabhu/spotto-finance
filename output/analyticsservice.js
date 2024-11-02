// analyticsService.js
import { analytics, logEvent } from './firebase-analytics.js';

const AnalyticsService = {
    logScreenView(screenName) {
        logEvent(analytics, 'screen_view', {
            screen_name: screenName,
            screen_class: 'Main'
        });
    },

		logButtonTap(buttonName) {
			logEvent(analytics, 'button_click', { button_name: buttonName });
			console.log("Button click event logged:", buttonName);
	}

		
};

export default AnalyticsService;
