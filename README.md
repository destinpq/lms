# Learning Management System (LMS)

A comprehensive Learning Management System built with Next.js for the frontend and Nest.js for the backend.

## Features

### Core Features

- **User Management**
  - Role-based access control (Admin, Instructor, Student, Guest)
  - User registration and login
  - Profile management
  - Bulk user import/export

- **Course Management**
  - Create, edit, and organize courses and modules
  - Support for multiple content types (text, PDF, video, etc.)
  - Course templates and reuse

- **Assessment & Quizzing**
  - Multiple question types
  - Timed quizzes and randomized questions
  - Auto-grading and manual grading
  - Question banks

- **Progress Tracking**
  - Course completion tracking
  - Module-wise progress indicators
  - Prerequisite enforcement
  - Certificates of completion

- **Communication & Engagement**
  - Discussion forums
  - Announcements & notifications
  - Messaging (1-on-1 or group)
  - Live classes integration

- **Content Management**
  - File uploads (PDF, DOCX, PPTX, videos, images)
  - Video embedding
  - Resource libraries

- **Analytics & Reporting**
  - User activity logs
  - Course and quiz performance reports
  - Engagement metrics
  - Downloadable reports

### Advanced Features

- **Gamification**
  - Badges and achievements
  - Leaderboards
  - Points and reward systems

- **Mobile Accessibility**
  - Responsive web design
  - Offline access support

- **Integrations**
  - Payment gateways
  - Third-party tools (Zoom, Google Drive, etc.)

- **Automation**
  - Enrollment rules
  - Drip content release
  - Automated reminders & notifications

- **Security & Compliance**
  - SSL encryption
  - GDPR/FERPA compliance
  - Secure login (2FA)
  - Audit logs

## Tech Stack

### Frontend (Next.js)
- React 19
- Next.js 14
- TypeScript
- Tailwind CSS
- React Query
- React Hook Form
- Socket.io Client

### Backend (Nest.js)
- Nest.js
- TypeORM
- PostgreSQL
- JWT Authentication
- Socket.io
- Multer (File Uploads)
- Nodemailer

## Project Structure

```
lms/
├── lms-frontend/         # Next.js frontend application
│   ├── app/              # App router pages
│   ├── components/       # Reusable UI components
│   ├── lib/              # Utility functions and hooks
│   └── public/           # Static assets
│
├── lms-backend/          # Nest.js backend application
│   ├── src/
│   │   ├── users/        # User management module
│   │   ├── auth/         # Authentication module
│   │   ├── courses/      # Course management module
│   │   ├── assessments/  # Assessments and quizzes module
│   │   ├── progress/     # Progress tracking module
│   │   ├── communication/# Forums and messaging module
│   │   ├── files/        # File upload and management module
│   │   ├── analytics/    # Analytics and reporting module
│   │   ├── gamification/ # Badges and rewards module
│   │   └── integration/  # Third-party integrations module
│   └── uploads/          # Uploaded files storage
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/lms.git
cd lms
```

2. Install frontend dependencies:
```bash
cd lms-frontend
npm install
```

3. Install backend dependencies:
```bash
cd ../lms-backend
npm install
```

4. Configure your database settings in `lms-backend/.env`

5. Start the development servers:

Frontend:
```bash
cd lms-frontend
npm run dev
```

Backend:
```bash
cd lms-backend
npm run start:dev
```

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
```

### Backend (.env)
```
PORT=3001
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=lms
DB_SYNCHRONIZE=true
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=1d
```

## License

[MIT](LICENSE) # lms
