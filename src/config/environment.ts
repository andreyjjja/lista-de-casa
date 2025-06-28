export const ENVIRONMENT = {
  development: {
    apiTimeout: 10000,
    retryAttempts: 3,
    syncInterval: 30000, // 30 segundos
  },
  production: {
    apiTimeout: 15000,
    retryAttempts: 5,
    syncInterval: 60000, // 1 minuto
  },
};

export const getEnvironmentConfig = () => {
  return __DEV__ ? ENVIRONMENT.development : ENVIRONMENT.production;
}; 