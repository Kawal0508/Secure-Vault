# SecureVault

SecureVault is a cloud-based file storage application that allows users to securely upload, encrypt, and manage files in their AWS S3 buckets. The application provides seamless integration with AWS services, offering multiple encryption methods to ensure data security.

## Features

- **File Upload**: Drag-and-drop or browse to upload files to AWS S3.
- **Encryption**: Supports AWS-managed keys (SSE-S3), KMS-managed keys (SSE-KMS), and customer-managed keys (SSE-C).
- **File Management**: View, search, filter, and download files stored in AWS S3.
- **AWS Configuration**: Configure AWS credentials and bucket settings directly from the app.
- **Notifications**: Manage notification preferences for file uploads, encryption changes, and more.

## Technologies Used

- **Frontend**: React, Next.js, Tailwind CSS
- **Backend**: Prisma, AWS SDK, Next.js Server Actions
- **Database**: PostgreSQL (via Prisma ORM)
- **Authentication**: NextAuth.js with Google OAuth
- **Encryption**: AES-256-CBC (custom encryption) and AWS server-side encryption

## Setup Instructions

### Prerequisites

1. Node.js (v20 or later)
2. PostgreSQL database
3. AWS account with S3 and KMS services enabled
4. Environment variables configured in a `.env` and `.env.local` file as per `.env.example` and `.env.local.example`

### Installation

1. Get into the secure-vault project directory:

   ```bash
   cd secure-vault
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. (Optional) Set up PostgreSQL using Docker Compose:

   If you don't have PostgreSQL installed locally, you can use Docker Compose to set it up:

   1. Start the PostgreSQL container:

      ```bash
      docker-compose up -d
      ```

   2. Use `securevault` as username, password and database name in `.env` and `.env.local`

4. Create and configure environment variables in a:

   `.env` file:

   ```env
   DATABASE_URL=
   ENCRYPTION_KEY=
   ```

   `.env.local` file:

   ```env
   AUTH_SECRET=
   NODE_ENV=development
   POSTGRES_USER=
   POSTGRES_PASSWORD=
   POSTGRES_DB=
   DATABASE_URL=
   AUTH_GOOGLE_ID=
   AUTH_GOOGLE_SECRET=
   ```

5. Run database migrations:

   ```bash
    npx prisma migrate dev
   ```

6. Start the development server:

   ```bash
   npm run dev
   ```

7. Open the app in your browser at [http://localhost:3000](http://localhost:3000).

## Project Structure

### Important Files and Directories

- **`/app`**: Contains the main application logic.

  - **`/app/(dashboard)`**: Dashboard-related pages and actions.
  - **`/app/page.tsx`**: Landing page for the application.
  - **`/app/layout.tsx`**: Root layout for the application.

- **`/components`**: Reusable UI components.

  - **`/components/file-upload.tsx`**: Handles file upload functionality.
  - **`/components/files-tab.tsx`**: Displays and filters files.
  - **`/components/settings-tab.tsx`**: AWS and encryption settings management.

- **`/lib`**: Utility functions and encryption logic.

  - **`/lib/encrypt.ts`**: Custom AES encryption and decryption methods.
  - **`/lib/utils.ts`**: Utility functions for class merging.

- **`/services`**: Backend services for interacting with the database.

  - **`/services/service.ts`**: Contains methods to fetch user and AWS configuration data.

- **`/prisma`**: Prisma schema and migrations.

  - **`/prisma/schema.prisma`**: Defines the database schema.
  - **`/prisma/migrations`**: Contains migration files.

- **`/types`**: TypeScript type definitions.
  - **`/types/types.ts`**: Defines types for users, AWS configurations, and files.

### Key Methods

#### File Upload

- **`uploadFileToS3`** (`/app/(dashboard)/upload/actions.ts`):
  Encrypts and uploads files to AWS S3 using the user's selected encryption method.

#### File Download

- **`downloadFileFromS3`** (`/app/(dashboard)/dashboard/actions.ts`):
  Downloads and decrypts files from AWS S3.

#### AWS Configuration

- **`saveAWSCredentials`** (`/app/(dashboard)/settings/actions.ts`):
  Saves and validates AWS credentials and bucket configuration.
- **`testAWSCredentials`** (`/app/(dashboard)/settings/actions.ts`):
  Tests the connectivity of AWS credentials.

#### Encryption

- **`encryptFileWithAES`** (`/lib/encrypt.ts`):
  Encrypts files using AES-256-CBC.
- **`decryptFileWithAES`** (`/lib/encrypt.ts`):
  Decrypts files using AES-256-CBC.

## How It Works

1. **Authentication**: Users sign in using Google OAuth via NextAuth.js.
2. **AWS Configuration**: Users configure their AWS credentials, region, and bucket name in the settings page.
3. **File Upload**: Files are encrypted locally using AES or AWS server-side encryption before being uploaded to S3.
4. **File Management**: Users can view, search, filter, and download their files from the dashboard.
5. **Encryption Settings**: Users can choose between AWS-managed, KMS-managed, or customer-managed encryption keys.

## Security Features

- **AES-256 Encryption**: Ensures files are encrypted before upload.
- **Environment Variables**: Sensitive data like AWS credentials and encryption keys are stored securely.
- **Role-Based Access**: Only authenticated users can access their files and configurations.

## Future Enhancements

- Add support for multi-file uploads.
- Implement file sharing with secure links.
- Add detailed analytics for file usage and access.
