import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    env: {
      NODE_ENV: 'test',
      PORT: '4000',
      MONGODB_URI: 'mongodb://127.0.0.1:27017/proximi-test?replicaSet=rs0',
      JWT_ACCESS_SECRET: 'test-access-secret-minimum-32-chars-long!',
      JWT_REFRESH_SECRET: 'test-refresh-secret-minimum-32-chars-long!',
      ACCESS_TOKEN_TTL: '15m',
      REFRESH_TOKEN_TTL: '7d',
      CLOUDINARY_CLOUD_NAME: 'test-cloud',
      CLOUDINARY_API_KEY: 'test-key',
      CLOUDINARY_API_SECRET: 'test-secret',
      CLIENT_ORIGIN: 'http://localhost:5173'
    }
  }
});
