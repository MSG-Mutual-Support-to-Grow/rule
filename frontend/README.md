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
- Upload and analyze resumes individually or in batch processing
- Manage job descriptions with real-time backend synchronization
- View detailed candidate analysis with AI-powered fit scoring (1-10 scale)
- Configure LLM providers for AI processing
- Visualize results with professional, responsive UI components
- Navigate seamlessly between batch results and detailed individual analysis

## ✨ Features

### 🔄 **Resume Processing**
- **Individual Upload**: Single PDF resume analysis with comprehensive insights
- **Batch Processing**: Multiple resume upload with intelligent ranking and comparison
- **Smart File Validation**: PDF-only uploads with comprehensive error handling
- **Real-time Progress**: Loading states and progress indicators
- **Fit Scoring**: AI-powered scoring system (1-10 scale) with detailed reasoning

### 📝 **Job Description Management**
- **Rich Text Editor**: Create and edit job descriptions with live preview
- **Backend Synchronization**: Auto-save to backend with offline fallback
- **Version Control**: Load, save, edit, reload, and clear operations
- **State Management**: Persistent editing states and lock mechanisms
- **Real-time Updates**: Seamless integration with resume analysis

### 📊 **Results Visualization**
- **Individual Analysis**: Comprehensive candidate breakdown with skills, experience, and fit analysis
- **Batch Results**: Card-based layout with clickable resumes for detailed view
- **Interactive Navigation**: Click any resume in batch results to view full analysis
- **Fit Score Display**: Color-coded scoring (Green: 8-10, Yellow: 6-7, Red: 0-5)
- **Full Reasoning**: Complete fit score explanations (no truncation)
- **Export Functionality**: JSON and CSV export options

### 🎨 **Modern UI/UX**
- **Responsive Design**: Mobile-first approach with perfect desktop experience
- **Glass Morphism**: Modern backdrop blur effects and transparency
- **Card-Based Layout**: Professional card design for better readability
- **Interactive Elements**: Hover effects and smooth transitions
- **Loading States**: Comprehensive feedback during all operations
- **Error Recovery**: Graceful error handling with clear messaging

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
│   │   ├── BatchResultsViewer.tsx    # Interactive batch results with click navigation
│   │   ├── JobDescriptionEditor.tsx  # Complete job description management
│   │   ├── OutputViewer.tsx         # Enhanced individual result display
│   │   ├── Sidebar.tsx              # Navigation sidebar
│   │   ├── UploadCard.tsx           # Multi-file upload interface
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
│   └── LandingPage.tsx            # Main application with upload modes
├── lib/                           # Utility libraries
│   ├── api.ts                     # Complete API client with all endpoints
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
3. Click "Save" to store in backend (`/api/save-job-description/`)
4. Use "Edit", "Reload", or "Clear" as needed
5. Job description syncs with backend automatically

### **2. Individual Resume Analysis**
1. Click "Upload Single Resume" card
2. Select a PDF resume file
3. Wait for AI processing
4. Review comprehensive analysis with:
   - Candidate information and source file details
   - Eligibility status with color-coded display
   - Leadership assessment and fit score (1-10)
   - Detailed work experience with timeline
   - Skills overview and notable projects
   - Export options (JSON/CSV)

### **3. Batch Resume Processing**
1. Click "Upload Multiple Resumes" card
2. Select multiple PDF files (Ctrl+Click or Shift+Click)
3. View batch results with:
   - Summary statistics (total, successful, failed)
   - Ranked resume cards sorted by fit score
   - Complete fit reasoning for each candidate
4. **Click any resume card** to view detailed individual analysis
5. Use "Back to Batch Results" to return to overview
6. Check failed files section for error details

### **4. LLM Configuration** (if available)
1. Access settings panel
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
- `GET /api/get-analysis/{resume_id}` - Get detailed individual analysis

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
  roles: Array<{
    title: string;
    company: string;
    duration: string;
    start_date: string;
    end_date: string;
  }>;
  work_experience_raw: string;
  skills: Record<string, { source: string; years: number }>;
  projects: Array<{
    name: string;
    tech_stack: string;
    description: string;
  }>;
  leadership_signals: boolean;
  leadership_justification: string;
  candidate_fit_summary: string;
  fit_score: number;
  fit_score_reason: string;
  eligibility_status: string;
  eligibility_reason: string;
  resume_id: string;
  filename: string;
  success: boolean;
}

interface ResumeBatchResponse {
  success: boolean;
  total_processed: number;
  successful_analyses: number;
  failed_analyses: number;
  ranked_resumes: Array<{
    resume_id: string;
    filename: string;
    fit_score: number;
    fit_score_reason: string;
    candidate_name: string;
  }>;
  failed_files: Array<{
    filename: string;
    error: string;
    resume_id: string | null;
  }>;
}
```

## 🧩 Components

### **Layout Components**

#### `UploadCard`
- Multi-mode file upload interface
- Supports both single and multiple file selection
- PDF validation and comprehensive error handling
- Visual feedback for drag-and-drop operations

#### `JobDescriptionEditor`
- Rich text editor with real-time backend sync
- Auto-save, edit, reload, and clear functionality
- Loading states and error recovery
- Lock/unlock mechanism for editing control

#### `OutputViewer`
- Enhanced individual resume analysis display
- Structured data with professional formatting
- Color-coded fit scoring and eligibility status
- Detailed work experience with timeline view
- Export functionality (JSON/CSV)

#### `BatchResultsViewer`
- **Interactive Card Layout**: Clickable resume cards instead of table
- **Full Fit Reasoning**: Complete explanations without truncation
- **Smart Navigation**: Click any card to view detailed analysis
- **Color-coded Scoring**: Visual fit score indicators
- **Summary Statistics**: Overview of batch processing results
- **Error Handling**: Failed files section with detailed errors

### **UI Components**

#### Base Components (Shadcn/ui)
- `Button` - Customizable button with variants and loading states
- `Card` - Content container with header/footer support
- `Switch` - Toggle switch component
- `Table` - Data table with sorting (legacy, replaced by cards)

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

# Linting and code quality
npm run lint

# Preview production build
npm run preview
```

### **Development Guidelines**

1. **Type Safety**: Use TypeScript for all components and API calls
2. **Component Structure**: Follow established folder hierarchy
3. **Styling**: Use Tailwind CSS classes, avoid inline styles
4. **API Integration**: Use centralized `api.ts` for all backend communication
5. **Error Handling**: Implement comprehensive error boundaries
6. **User Experience**: Ensure loading states and smooth navigation

### **Code Style**
- Functional components with React hooks
- Proper error boundaries and recovery
- ESLint configuration compliance
- TypeScript interfaces for all data structures

### **ShadCN UI Components**
Add new UI components:
```bash
npx shadcn-ui@latest add <component>
```

## 🧪 Testing

### **Manual Testing Workflow**

#### **Job Description Management**
- [ ] Save job description → Backend sync
- [ ] Reload page → Auto-load from backend
- [ ] Edit → Save → Verify changes
- [ ] Clear → Confirm removal from backend

#### **Individual Resume Upload**
- [ ] Upload valid PDF → Complete analysis display
- [ ] Upload invalid file → Proper error message
- [ ] Check all sections: info, eligibility, fit score, experience, skills, projects
- [ ] Test export functionality (JSON/CSV)

#### **Batch Resume Processing**
- [ ] Upload multiple PDFs → Ranked card display
- [ ] Click resume card → Detailed analysis view
- [ ] Use back button → Return to batch results
- [ ] Test with mixed file types → Error handling
- [ ] Verify fit score color coding and reasoning

#### **Navigation and UX**
- [ ] Responsive design on all screen sizes
- [ ] Loading states during all operations
- [ ] Error recovery and clear messaging
- [ ] Smooth transitions between views

### **Error Scenarios**
- [ ] Network disconnection during upload
- [ ] Backend server downtime
- [ ] Large file uploads
- [ ] Corrupted PDF files
- [ ] API endpoint failures

## 🚀 Production Deployment

### **Build Process**
```bash
# Create optimized production build
npm run build

# Preview build locally
npm run preview
```

### **Environment Configuration**
- Update `API_BASE_URL` for production backend
- Configure CORS settings properly
- Optimize bundle size and performance
- Set up error tracking and analytics

### **Performance Features**
- Lazy loading for large components
- Optimized bundle splitting
- Efficient state management
- Responsive image handling

## 🤝 Contributing

1. **Fork the Repository**
2. **Create Feature Branch**: `git checkout -b feature/enhancement-name`
3. **Follow Development Standards**: TypeScript, ESLint, component patterns
4. **Test Thoroughly**: All upload modes, navigation, and error scenarios
5. **Commit Changes**: `git commit -m 'Add enhancement description'`
6. **Push to Branch**: `git push origin feature/enhancement-name`
7. **Open Pull Request**: Detailed description of changes

### **Development Standards**
- Maintain TypeScript strict mode compliance
- Follow component reusability principles
- Implement comprehensive error handling
- Ensure responsive design across devices
- Add proper JSDoc documentation for complex functions

## 🔗 Related Documentation

- [Backend API Documentation](../backend/README.md)
- [Project Main README](../README.md)

## 📄 License

This project is part of the Rule application suite. See the main repository for licensing information.

## 🆘 Support

For issues and questions:
1. Check the comprehensive testing workflow guide
2. Review browser console for client-side errors
3. Verify backend API connectivity and responses
4. Check network requests in developer tools
5. Confirm file types and sizes meet requirements

## 🎉 Recent Updates

### **Version 2.0 - Enhanced Batch Processing**
- **Interactive Navigation**: Click-to-view detailed analysis from batch results
- **Improved UX**: Card-based layout replacing table view
- **Full Content Display**: Complete fit reasoning without truncation
- **Smart State Management**: Seamless navigation between batch and detail views
- **Enhanced API Integration**: Complete endpoint coverage with error handling

### **Key Improvements**
- Removed actions column from batch results (replaced with clickable cards)
- Full fit score reasoning display
- One-click navigation to detailed individual analysis
- Professional card-based design with visual feedback
- Comprehensive error handling and loading states

---

**Built with ❤️ using React, TypeScript, and modern web technologies**

*Experience intelligent resume analysis with professional-grade UI and seamless navigation between batch and individual views.*
