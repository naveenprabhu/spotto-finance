// analyticsService.js
import { analytics, logEvent } from './firebase-analytics.js';

const AnalyticsService = {
    logScreenView(screenName) {
        logEvent(analytics, 'screen_view', {
            screen_name: screenName,
            screen_class: 'Main'
        });
    }
};

export default AnalyticsService;
