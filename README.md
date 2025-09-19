# 🔐 SecureVault

[![Next.js](https://img.shields.io/badge/Next.js-15.3.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.7.0-2D3748?style=for-the-badge&logo=prisma)](https://prisma.io/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com/)

> **Enterprise-grade secure file storage solution with advanced encryption and cloud integration**

SecureVault is a production-ready, scalable file storage platform that provides enterprise-level security for cloud file management. Built with modern technologies and designed for high-performance environments, it offers seamless integration with AWS S3, multiple encryption methods, and robust authentication systems.

## 🌟 Key Features

### 🔒 **Advanced Security**
- **Multi-layer encryption** with AES-256-CBC and AWS server-side encryption
- **Multiple encryption methods**: AWS-managed keys (SSE-S3), KMS-managed keys (SSE-KMS), and customer-managed keys (SSE-C)
- **Secure authentication** with NextAuth.js and Google OAuth 2.0
- **Environment-based configuration** for sensitive data protection

### ☁️ **Cloud Integration**
- **AWS S3 integration** with configurable bucket management
- **Real-time file operations** with optimized upload/download performance
- **Scalable architecture** designed for enterprise workloads
- **Connection pooling** for optimal database performance

### 🎯 **User Experience**
- **Intuitive drag-and-drop interface** for seamless file management
- **Real-time file operations** with progress tracking
- **Advanced file filtering and search** capabilities
- **Responsive design** optimized for all devices

### 🏗️ **Enterprise Architecture**
- **Type-safe development** with TypeScript
- **Database migrations** with Prisma ORM
- **Serverless deployment** on Vercel
- **Production-ready logging** and error handling

## 🚀 Live Demo

**🔗 [View Live Application](https://secure-vault-wine-gamma.vercel.app/)**

## 🛠️ Technology Stack

### **Frontend**
- **Next.js 15.3.2** - React framework with App Router
- **TypeScript 5.0** - Type-safe development
- **Tailwind CSS 4.0** - Utility-first styling
- **Radix UI** - Accessible component library
- **Lucide React** - Modern icon library

### **Backend & Database**
- **Prisma 6.7.0** - Type-safe database ORM
- **PostgreSQL** - Robust relational database
- **Supabase** - Managed PostgreSQL with connection pooling
- **NextAuth.js 5.0** - Authentication framework

### **Cloud & Infrastructure**
- **Vercel** - Serverless deployment platform
- **AWS S3** - Object storage service
- **AWS KMS** - Key management service
- **Google OAuth 2.0** - Authentication provider

### **Development Tools**
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting
- **Docker** - Containerization support

## 📋 Prerequisites

- **Node.js** 20.0 or later
- **npm** 10.0 or later
- **PostgreSQL** 15.0 or later (or Supabase account)
- **AWS Account** with S3 and KMS access
- **Google Cloud Console** project for OAuth

## ⚡ Quick Start

### 1. **Clone the Repository**
```bash
git clone https://github.com/Kawal0508/Secure-Vault.git
cd Secure-Vault
```

### 2. **Install Dependencies**
```bash
npm install
```

### 3. **Environment Configuration**

Create `.env.local` file:
```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# AWS Configuration (Optional)
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="your-bucket-name"
```

### 4. **Database Setup**
```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push
```

### 5. **Start Development Server**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

## 🏗️ Project Architecture

```
Secure-Vault/
├── app/                          # Next.js App Router
│   ├── (dashboard)/             # Protected dashboard routes
│   │   ├── dashboard/           # Main dashboard
│   │   ├── settings/            # AWS configuration
│   │   └── upload/              # File upload interface
│   ├── api/                     # API routes
│   │   └── auth/                # NextAuth.js endpoints
│   └── globals.css              # Global styles
├── components/                   # Reusable UI components
│   ├── ui/                      # Base UI components
│   ├── file-upload.tsx          # File upload component
│   ├── files-tab.tsx            # File management interface
│   └── settings-tab.tsx         # Configuration interface
├── lib/                         # Utility libraries
│   ├── auth.ts                  # NextAuth.js configuration
│   ├── encrypt.ts               # Encryption utilities
│   └── utils.ts                 # Helper functions
├── prisma/                      # Database schema and migrations
│   └── schema.prisma            # Database schema definition
├── services/                    # Business logic services
│   └── service.ts               # Database service layer
└── types/                       # TypeScript type definitions
    └── types.ts                 # Application types
```

## 🔧 Core Functionality

### **File Management**
- **Secure Upload**: Files encrypted before S3 upload
- **Download & Decrypt**: Secure file retrieval with decryption
- **File Metadata**: Comprehensive file information tracking
- **Search & Filter**: Advanced file discovery capabilities

### **AWS Integration**
- **Credential Management**: Secure AWS credential storage
- **Bucket Configuration**: Dynamic S3 bucket management
- **Encryption Methods**: Multiple encryption strategy support
- **Connection Testing**: Real-time AWS connectivity validation

### **Authentication & Security**
- **OAuth 2.0**: Google-based authentication
- **Session Management**: Secure user session handling
- **Role-based Access**: User-specific data isolation
- **Environment Security**: Secure configuration management

## 🚀 Deployment

### **Vercel Deployment**
1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Configure Environment Variables**: Set all required environment variables
3. **Deploy**: Automatic deployment on git push

### **Environment Variables for Production**
```env
DATABASE_URL="postgresql://user:pass@host:port/db?sslmode=require"
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="your-production-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## 📊 Performance & Scalability

- **Serverless Architecture**: Auto-scaling with Vercel
- **Connection Pooling**: Optimized database connections
- **CDN Integration**: Global content delivery
- **Efficient Caching**: Optimized data retrieval
- **Type Safety**: Compile-time error prevention

## 🔒 Security Features

- **End-to-End Encryption**: Files encrypted before cloud storage
- **Secure Authentication**: OAuth 2.0 with Google
- **Environment Isolation**: Secure configuration management
- **Database Security**: Connection pooling with SSL
- **Input Validation**: Comprehensive data sanitization

## 🧪 Testing & Quality Assurance

- **TypeScript**: Compile-time type checking
- **ESLint**: Code quality enforcement
- **Error Handling**: Comprehensive error management
- **Logging**: Production-ready logging system

## 📈 Monitoring & Analytics

- **Vercel Analytics**: Performance monitoring
- **Database Monitoring**: Supabase dashboard integration
- **Error Tracking**: Comprehensive error logging
- **Usage Analytics**: File operation tracking

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Kawal Ostwal**
- GitHub: [@Kawal0508](https://github.com/Kawal0508)
- LinkedIn: [Kawal Ostwal](https://linkedin.com/in/kawal-ostwal)
    
**Siddharth Movaliya**
- GitHub: [@siddharth-movaliya]([https://github.com/Kawal0508](https://github.com/siddharth-movaliya))
- LinkedIn: [Siddharth Movaliya](https://www.linkedin.com/in/siddharth-movaliya/)
    
---

<div align="center">

**⭐ Star this repository if you found it helpful!**

[🔗 Live Demo](https://secure-vault-wine-gamma.vercel.app/) • [📖 Documentation](#) • [🐛 Report Bug](#) • [💡 Request Feature](#)

</div>
