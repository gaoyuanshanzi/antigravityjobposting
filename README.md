# Job Posting Aggregator Service

A full-stack web application built with Next.js App Router, designed for aggregating and emailing job postings.
Optimized for local development and Vercel zero-config deployment.

## Features

- **Authentication**: Secured dashboard with session-cookie based login.
- **Dynamic UI**: Sidebar for multi-selecting top 10 cities across KR, JP, US.
- **Localized Content**: Displays job postings in the local language (Korean, Japanese, English).
- **Email Integration**: Send selected job postings to multiple recipients via Nodemailer.
- **Vercel Ready**: Full compatibility with Vercel's zero-config deployment architecture.

## Requirements

- Node.js 18+
- npm (or yarn/pnpm)

## Local Development Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   Create a `.env.local` file in the root directory (one has been pre-generated for you):
   ```env
   ADMIN_ID="admin"
   ADMIN_PASSWORD="123jesus"

   # Nodemailer setup (Update these with real credentials for sending emails)
   EMAIL_SERVER_USER="your-email@naver.com"
   EMAIL_SERVER_PASSWORD="your-app-password"
   SMTP_HOST="smtp.naver.com"
   SMTP_PORT="465"
   ```
   *Note: For Naver, ensure you have enabled SMTP/IMAP in your Naver Mail settings and use your password (or App Password if 2FA is enabled).*

3. **Start the Development Server**
   ```bash
   npm run dev
   ```

4. **Access the Application**
   Open [http://localhost:3000](http://localhost:3000) in your browser.
   Login using the credentials defined in `.env.local` (default: `admin` / `123jesus`).

## Vercel Deployment

This project is optimized for deployment on Vercel.

1. Push your code to a GitHub repository. (Make sure `.env.local` is **NOT** committed).
2. Import the project into Vercel.
3. In the Vercel project settings, go to **Environment Variables** and add all the variables from your `.env.local` file.
4. Deploy! Vercel will automatically detect the Next.js framework and configure the build settings.

## Project Structure

- `/src/app/page.tsx` - Main Dashboard Layout
- `/src/app/login/page.tsx` - Login Screen
- `/src/app/api/auth/` - Authentication API Routes
- `/src/app/api/jobs/` - Mock Job Data Generation API
- `/src/app/api/email/` - Nodemailer Integration API
- `/src/components/` - React Components (Sidebar, JobCard, EmailModal)
- `/src/lib/` - Shared Utilities (Session Auth, Mock Data)
