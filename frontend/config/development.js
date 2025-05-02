import { config as defaultConfig } from './default.js';

export const config = {
  ...defaultConfig,
  api: {
    ...defaultConfig.api,
    baseUrl: 'http://localhost:8080',
    timeout: 10000 // Longer timeout for development
  },
  analytics: {
    ...defaultConfig.analytics,
    debug: true
  }
}; 