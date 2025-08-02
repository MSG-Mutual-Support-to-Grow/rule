# 🚀 Rule Frontend - AI Resume Analysis Interface

A modern, responsive React application for AI-powered resume analysis and job matching. Built with TypeScript, Vite, and Tailwind CSS.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Integration](#api-integration)
- [Components](#components)
- [Development](#development)
- [Testing](#testing)
- [Contributing](#contributing)

## 🎯 Overview

The Rule Frontend is an intelligent web interface that enables users to:
- Upload and analyze resumes individually or in batch
- Manage job descriptions with real-time backend synchronization
- View detailed candidate analysis with AI-powered fit scoring
- Configure LLM providers for AI processing
- Visualize results with professional, responsive UI components

## ✨ Features

### 🔄 **Resume Processing**
- **Individual Upload**: Single PDF resume analysis with detailed insights
- **Batch Processing**: Multiple resume upload with ranking and comparison
- **Smart File Validation**: PDF-only uploads with comprehensive error handling
- **Real-time Progress**: Loading states and progress indicators

### 📝 **Job Description Management**
- **Rich Text Editor**: Create and edit job descriptions with live preview
- **Backend Synchronization**: Auto-save to backend with offline fallback
- **Version Control**: Load, save, edit, and clear operations
- **State Management**: Persistent editing states and lock mechanisms

### 📊 **Results Visualization**
- **Individual Analysis**: Detailed candidate breakdown with skills, experience, and fit analysis
- **Batch Results**: Ranked table with fit scores, candidate names, and filtering
- **Error Handling**: Comprehensive failed file reporting with detailed error messages
- **Export Ready**: Structured data display ready for further processing

### 🎨 **Modern UI/UX**
- **Responsive Design**: Mobile-first approach with perfect desktop experience
- **Glass Morphism**: Modern backdrop blur effects and transparency
- **Animation**: Smooth transitions and micro-interactions
- **Accessibility**: WCAG compliant with keyboard navigation

### ⚙️ **LLM Configuration**
- **Provider Management**: Support for multiple LLM providers (OpenRouter, Ollama)
- **Model Selection**: Dynamic model loading based on provider
- **API Key Management**: Secure credential handling
- **Real-time Testing**: Test LLM connections with live prompts

## 🛠 Tech Stack

### **Core Framework**
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool and dev server

### **Styling & UI**
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Shadcn/ui** - High-quality accessible components
- **Radix UI** - Primitive components for complex interactions
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful, customizable icons

### **Development Tools**
- **ESLint 9** - Code linting and formatting
- **TypeScript 5.7** - Type checking and IntelliSense
- **PostCSS** - CSS processing and optimization
- **Node.js 22+** - Runtime environment

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout-specific components
│   │   ├── BatchResultsViewer.tsx    # Batch upload results display
│   │   ├── JobDescriptionEditor.tsx  # Job description management
│   │   ├── OutputViewer.tsx         # Individual result display
│   │   ├── Sidebar.tsx              # Navigation sidebar
│   │   ├── UploadCard.tsx           # File upload interface
│   │   └── settings/               # Settings components
│   │       ├── SettingCard.tsx     # Settings card wrapper
│   │       ├── SettingsModal.tsx   # Settings modal dialog
│   │       └── views/              # Settings views
│   │           ├── LLMProviderSettings.tsx  # LLM configuration
│   │           └── ThemeSettings.tsx        # Theme preferences
│   └── ui/                         # Base UI components
│       ├── button.tsx              # Button component
│       ├── card.tsx                # Card component
│       ├── switch.tsx              # Toggle switch
│       └── table.tsx               # Table component
├── pages/                          # Page components
│   └── LandingPage.tsx            # Main application page
├── lib/                           # Utility libraries
│   ├── api.ts                     # API client and types
│   └── utils.ts                   # Helper functions
├── blocks/                        # Custom UI blocks
│   └── BlurText.tsx              # Animated text component
├── const/                         # Constants and mock data
│   └── mockdata.ts               # Development mock data
├── assets/                        # Static assets
│   └── react.svg                 # React logo
├── App.tsx                        # Root application component
├── main.tsx                       # Application entry point
├── index.css                      # Global styles
├── App.css                        # Component-specific styles
└── vite-env.d.ts                 # Vite type definitions
```

## 🚀 Installation

### Prerequisites
- **Node.js 18+** (recommended: 20+)
- **npm** or **yarn** or **pnpm**
- **Backend API** running on `http://localhost:8000`

### Setup Steps

1. **Clone and Navigate**
   ```bash
   git clone <repository-url>
   cd rule/frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Configuration**
   - Ensure backend is running on `http://localhost:8000`
   - Update `API_BASE_URL` in `src/lib/api.ts` if needed

4. **Start Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open Application**
   - Navigate to `http://localhost:5173` (or shown port)
   - Application should load with upload interface

## 🎮 Usage

### **1. Job Description Setup**
1. Scroll to "Job Description" section
2. Enter or paste job requirements
3. Click "Save" to store in backend
4. Use "Edit", "Reload", or "Clear" as needed

### **2. Individual Resume Analysis**
1. Click "Upload Single Resume" card
2. Select a PDF resume file
3. Wait for AI processing
4. Review detailed analysis results

### **3. Batch Resume Processing**
1. Click "Upload Multiple Resumes" card
2. Select multiple PDF files (Ctrl+Click)
3. View ranked results with fit scores
4. Check failed files for errors

### **4. LLM Configuration**
1. Access settings (if available)
2. Select LLM provider (OpenRouter/Ollama)
3. Configure model and API credentials
4. Test connection with sample prompt

## 🔌 API Integration

### **Base Configuration**
```typescript
const API_BASE_URL = 'http://localhost:8000';
```

### **Core Endpoints**
- `POST /api/upload-resume/` - Individual resume processing
- `POST /api/upload-resume-batch/` - Batch resume processing
- `POST /api/save-job-description/` - Save job description
- `GET /api/get-job-description/` - Retrieve job description
- `GET /api/get-analysis/{resume_id}` - Get detailed analysis

### **LLM Endpoints**
- `GET /api/llm/config` - Get current LLM configuration
- `POST /api/llm/config` - Update LLM settings
- `POST /api/llm/prompt` - Test LLM with prompt
- `GET /api/llm/models/{provider}` - Get available models

### **Response Types**
```typescript
interface ResumeAnalysisResult {
  full_name: string;
  email: string;
  phone_number: string;
  total_experience_years: number;
  skills: Record<string, any>;
  // ... more fields
}

interface ResumeBatchResponse {
  success: boolean;
  total_processed: number;
  successful_analyses: number;
  failed_analyses: number;
  ranked_resumes: ResumeBatchItem[];
  failed_files: FailedFile[];
}
```

## 🧩 Components

### **Layout Components**

#### `UploadCard`
- File upload interface with drag-and-drop
- Supports single and multiple file selection
- PDF validation and error handling

#### `JobDescriptionEditor`
- Rich text editor for job descriptions
- Real-time backend synchronization
- Edit/lock state management

#### `OutputViewer`
- Individual resume analysis display
- Structured data presentation
- Professional formatting

#### `BatchResultsViewer`
- Batch processing results
- Ranked table with fit scores
- Failed files section with error details

### **UI Components**

#### Base Components (Shadcn/ui)
- `Button` - Customizable button with variants
- `Card` - Content container with header/footer
- `Switch` - Toggle switch component
- `Table` - Data table with sorting

#### Custom Blocks
- `BlurText` - Animated text with blur effects
- `SettingsModal` - Configuration dialog
- `Sidebar` - Navigation and settings access

## 🔧 Development

### **Available Scripts**

```bash
# Development server with hot reload
npm run dev

# Type checking and build
npm run build

# Linting
npm run lint

# Preview production build
npm run preview
```

### **Development Guidelines**

1. **Type Safety**: Use TypeScript for all components
2. **Component Structure**: Follow the established folder structure
3. **Styling**: Use Tailwind CSS classes, avoid inline styles
4. **API Calls**: Use the centralized `api.ts` for all backend communication
5. **Error Handling**: Implement comprehensive error boundaries
6. **Accessibility**: Ensure keyboard navigation and screen reader support

### **Code Style**
- Use functional components with hooks
- Implement proper error boundaries
- Follow ESLint configuration
- Use TypeScript interfaces for all data structures

### **ShadCN UI Components**
To add new UI components:
```bash
npx shadcn-ui@latest add <component>
```

## 🧪 Testing

### **Manual Testing Workflow**

1. **Job Description Flow**
   - Save → Reload page → Edit → Clear
   - Verify backend synchronization

2. **Individual Upload**
   - Valid PDF → Success analysis
   - Invalid file → Proper error

3. **Batch Upload**
   - Multiple PDFs → Ranked results
   - Mixed files → Error handling

4. **Error Scenarios**
   - Network disconnection
   - Backend downtime
   - Large file uploads

### **Testing Checklist**
- [ ] All upload scenarios work
- [ ] Job description CRUD operations
- [ ] Responsive design on all devices
- [ ] Error handling and recovery
- [ ] Loading states and feedback
- [ ] API integration stability

## 🚀 Production Deployment

### **Build Process**
```bash
# Create production build
npm run build

# Preview build locally
npm run preview
```

### **Environment Configuration**
- Update `API_BASE_URL` for production backend
- Configure proper CORS settings
- Optimize bundle size and performance
- Enable error tracking and analytics

### **Performance Optimization**
- Lazy loading for large components
- Image optimization for assets
- Bundle splitting for better caching
- CDN configuration for static assets

## 🤝 Contributing

1. **Fork the Repository**
2. **Create Feature Branch**: `git checkout -b feature/amazing-feature`
3. **Commit Changes**: `git commit -m 'Add amazing feature'`
4. **Push to Branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### **Development Standards**
- Follow TypeScript best practices
- Maintain component reusability
- Write comprehensive error handling
- Ensure responsive design
- Add proper documentation

## 🔗 Related Documentation

- [Backend API Documentation](../ENHANCED_BACKEND_API.md)
- [Frontend Testing Workflow](../FRONTEND_TESTING_WORKFLOW.md)
- [Project Main README](../README.md)

## 📄 License

This project is part of the Rule application suite. See the main repository for licensing information.

## 🆘 Support

For issues and questions:
1. Check the main repository documentation
2. Review the testing workflow guide
3. Check browser console for errors
4. Verify backend API connectivity

---

**Built with ❤️ using React, TypeScript, and modern web technologies**