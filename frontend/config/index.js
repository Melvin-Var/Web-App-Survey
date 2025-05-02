import { config as developmentConfig } from './development.js';
import { config as productionConfig } from './production.js';

const env = import.meta.env.MODE || 'development';

export const config = env === 'production' ? productionConfig : developmentConfig;

// Export a function to get config values with fallback
export const getConfig = (path, defaultValue) => {
  const keys = path.split('.');
  let current = config;
  
  for (const key of keys) {
    if (current[key] === undefined) {
      return defaultValue;
    }
    current = current[key];
  }
  
  return current;
}; 