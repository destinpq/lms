export default () => ({
  port: parseInt(process.env.PORT || '3001', 10),
  database: {
    type: process.env.DB_TYPE || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'lms',
    synchronize: process.env.DB_SYNCHRONIZE === 'true' || true,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'lms-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  email: {
    host: process.env.EMAIL_HOST || 'smtp.example.com',
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    secure: process.env.EMAIL_SECURE === 'true' || false,
    auth: {
      user: process.env.EMAIL_USER || 'user@example.com',
      pass: process.env.EMAIL_PASS || 'password',
    },
    from: process.env.EMAIL_FROM || 'info@lms.com',
  },
  uploadDir: process.env.UPLOAD_DIR || './uploads',
});
