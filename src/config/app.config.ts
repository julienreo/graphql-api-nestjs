export default () => ({
  environment: process.env.NODE_ENV || 'development',
  database: {
    connectionUri: process.env.DATABASE_CONNECTION_URI,
  },
  cache: {
    host: process.env.CACHE_HOST,
    port: parseInt(process.env.CACHE_PORT, 10) || 6439,
  },
});
