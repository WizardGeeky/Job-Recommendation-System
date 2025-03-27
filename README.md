# Job Portal System

### Overview
This Job Portal System is designed to provide users with a seamless experience in job searching, resume management, and job recommendations. The system includes authentication, session management, and job-related features integrated with external job APIs.

### Live Project

https://job-recommendation-system-ten.vercel.app/

### Technologies & Frameworks

- Next JS
- TypeScript
- Tailwind Css
- Nodemailer
- JWT
- Mongo DB
- Remote API Integration
- Vercel

## Features

### Authentication & User Management
- Create Account: Users can sign up for a new account.
- Login: Secure login using credentials.
- Forgot Password: Users can recover their password via email validation and OTP verification.
- Update Password: Allows users to change their password.

### Session Management
- JWT Token: Used for authentication and authorization.
- Session Management: Maintains user sessions securely.
- Remove Sessions: Allows users to log out and terminate active sessions.
- Logout: Securely logs out users from the system.

### Dashboard & Job Management
- Dashboard: Provides an overview of job-related activities.
- All Jobs: Users can view all available job listings.
- Upload Resume: Users can upload their resumes for job applications.
- Skills Extraction: Extracts key skills from the uploaded resume.
- Job Suggestions: Provides job recommendations based on user skills and preferences.
- Remote Ok Job API: Integrates with external job APIs for remote job listings.
- Job Recommendations: Personalized job recommendations based on user data.

## Technology Stack
- Frontend: Next.js
- Backend: Node.js
- Database: MongoDB
- Authentication: JWT
- Tailwind Css
- External API: Remote OK Job API


## Installation & Setup

Follow these steps to set up and run the project locally:

### Clone the repository  
- git clone https://github.com/WizardGeeky/Job-Recommendation-System.git

### Navigate to the project directory
- cd Job-Recommendation-System

### Install dependencies
npm install

### Set up environment variables
- MONGODB_URI=your_mongodb_connection_string
- CIPHER_SECRET=your_cipher_secret
- NEXT_PUBLIC_JWT_SECRET=your_jwt_secret
- NEXT_PUBLIC_PERSONAL_EMAIL=your_email
- NEXT_PUBLIC_BURNER_PASSWORD=your_burner_password

### Start the development server
- npm run dev

### Application Flow

![image](https://github.com/user-attachments/assets/4bb695c3-4675-4a79-8b06-68b0bab9cb10)
