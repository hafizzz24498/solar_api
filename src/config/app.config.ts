export default () => ({
    servicePort: process.env.SERVICE_PORT || 3000,
    servicePrefix: process.env.SERVICE_PREFIX || 'api',
    serviceUrl: process.env.SERVICE_URL || `http://localhost:${process.env.SERVICE_PORT || 3000}`,
    serviceSaltRound: process.env.SERVICE_SALT_ROUND || 10
})