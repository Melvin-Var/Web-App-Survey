import { config as defaultConfig } from './default.js';

export const config = {
  ...defaultConfig,
  api: {
    ...defaultConfig.api,
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://refuge-survey-backend-kuyzzpzxyq-uc.a.run.app',
    timeout: 3000 // Shorter timeout for production
  },
  analytics: {
    ...defaultConfig.analytics,
    debug: false
  }
}; 