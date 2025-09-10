# 🤝 Contributing to RULE

Thank you for your interest in contributing to **Resume Understanding Language Engine (RULE)**! We welcome contributions from developers, designers, and AI enthusiasts of all skill levels.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Reporting Issues](#reporting-issues)
- [Documentation](#documentation)
- [Community](#community)

## 📜 Code of Conduct

This project follows our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold these standards and foster an inclusive community.

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.10+** with `pip` and `venv`
- **Node.js 18+** with `npm`
- **Docker** and **Docker Compose** (recommended)
- **Git** for version control

### Quick Setup

1. **Fork the repository** on GitHub
2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/rule.git
   cd rule
   ```
3. **Set up upstream remote**:
   ```bash
   git remote add upstream https://github.com/MSG-Mutual-Support-to-Grow/rule.git
   ```

## 🛠️ Development Setup

### Option 1: Docker Setup (Recommended)

```bash
# Configure LLM settings
cp configs/llm_config_example.json configs/llm_config.json

# Start development environment
docker-compose up --build

# Access the application
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Option 2: Local Development Setup

#### Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Install spaCy model
pip install api/en_core_web_sm-3.7.1-py3-none-any.whl

# Start development server
uvicorn api.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🏗️ Project Structure

```
rule/
├── 📁 backend/                 # Python FastAPI backend
│   ├── 📁 api/                # API endpoints and main app
│   ├── 📁 modules/            # Core business logic
│   │   ├── 📁 llm/           # LLM integration
│   │   ├── 📁 text_extract/  # PDF processing
│   │   └── 📁 analytics/     # Analytics module
│   └── 📁 pipelines/         # Processing pipelines
├── 📁 frontend/               # React TypeScript frontend
│   ├── 📁 src/
│   │   ├── 📁 components/    # Reusable UI components
│   │   ├── 📁 pages/         # Page components
│   │   └── 📁 lib/           # Utilities and API client
│   └── 📁 public/            # Static assets
├── 📁 configs/                # Configuration files
├── 📁 docs/                   # Documentation
└── 📁 .github/               # GitHub configuration
```

## 🔄 Development Workflow

### 1. Choose an Issue
- Check [GitHub Issues](https://github.com/MSG-Mutual-Support-to-Grow/rule/issues) for open tasks
- Look for issues labeled `good first issue` or `help wanted`
- Comment on the issue to indicate you're working on it

### 2. Create a Branch
```bash
# Create and switch to a feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/issue-number-description
```

### 3. Make Changes
- Follow the [code standards](#code-standards) below
- Write tests for new functionality
- Update documentation as needed
- Test your changes thoroughly

### 4. Commit Changes
```bash
# Stage your changes
git add .

# Commit with conventional commit message
git commit -m "feat: add new resume analysis feature

- Add PDF text extraction capability
- Implement OCR fallback for scanned documents
- Add comprehensive error handling

Closes #123"
```

### 5. Push and Create Pull Request
```bash
# Push your branch
git push origin feature/your-feature-name

# Create a Pull Request on GitHub
```

## 📏 Code Standards

### Python (Backend)

#### Code Style
- Follow **PEP 8** style guidelines
- Use **Black** for code formatting (configured in `pyproject.toml`)
- Use **isort** for import sorting
- Maximum line length: **88 characters** (Black default)

#### Code Quality
```python
# ✅ Good: Clear variable names, proper typing
def process_resume(file_path: str, job_description: str) -> dict:
    """Process a resume file and return analysis results."""
    pass

# ❌ Bad: Unclear names, no typing
def proc(f, jd):
    pass
```

#### Best Practices
- Use type hints for function parameters and return values
- Write comprehensive docstrings using Google style
- Handle exceptions appropriately
- Use logging instead of print statements
- Follow SOLID principles

### TypeScript/React (Frontend)

#### Code Style
- Use **ESLint** configuration (defined in `eslint.config.js`)
- Follow **React best practices**
- Use **TypeScript** for type safety
- Use **Prettier** for consistent formatting

#### Component Structure
```typescript
// ✅ Good: Functional component with proper typing
interface ResumeCardProps {
  resume: ResumeData;
  onClick: (id: string) => void;
}

export const ResumeCard: React.FC<ResumeCardProps> = ({ resume, onClick }) => {
  return (
    <Card onClick={() => onClick(resume.id)}>
      <h3>{resume.fullName}</h3>
      <p>Score: {resume.fitScore}/10</p>
    </Card>
  );
};

// ❌ Bad: No typing, inline handlers
export const ResumeCard = ({ resume, onClick }) => {
  return (
    <div onClick={() => onClick(resume.id)}>
      <h3>{resume.fullName}</h3>
      <p>Score: {resume.fitScore}/10</p>
    </div>
  );
};
```

#### Best Practices
- Use functional components with hooks
- Implement proper error boundaries
- Use custom hooks for reusable logic
- Follow accessibility guidelines (WCAG 2.1)
- Optimize performance with `React.memo` when appropriate

### Commit Messages

Follow [Conventional Commits](https://conventionalcommits.org/) specification:

```bash
# Format: type(scope): description

# ✅ Good examples
feat: add bulk resume processing
fix: resolve PDF parsing error for large files
docs: update API documentation
refactor: simplify LLM provider interface
test: add unit tests for text extraction

# ❌ Bad examples
fixed bug
updated code
changes
```

### Branch Naming

```bash
# Feature branches
feature/add-bulk-processing
feature/improve-ui-design

# Bug fix branches
fix/pdf-parsing-error
fix/memory-leak-issue

# Documentation branches
docs/update-api-docs
docs/add-contribution-guide
```

## 🧪 Testing

### Backend Testing

```bash
cd backend

# Run all tests
python -m pytest

# Run with coverage
python -m pytest --cov=.

# Run specific test file
python -m pytest tests/test_resume_processing.py

# Run tests in verbose mode
python -m pytest -v
```

### Frontend Testing

```bash
cd frontend

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Testing Guidelines

- Write tests for all new features
- Maintain test coverage above 80%
- Use descriptive test names
- Test both success and failure scenarios
- Mock external dependencies (LLM APIs, file I/O)

## 📝 Submitting Changes

### Pull Request Process

1. **Ensure your branch is up to date**:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run tests and linting**:
   ```bash
   # Backend
   cd backend && python -m pytest

   # Frontend
   cd frontend && npm run lint && npm test
   ```

3. **Create a Pull Request**:
   - Use the PR template
   - Provide a clear description
   - Reference related issues
   - Add screenshots for UI changes

4. **Address review feedback**:
   - Make requested changes
   - Re-run tests
   - Update documentation if needed

### Pull Request Template

When creating a PR, please fill out the template with:

- **Description**: What changes were made and why
- **Type of change**: Bug fix, feature, documentation, etc.
- **Breaking changes**: Any breaking changes?
- **Testing**: How was this tested?
- **Screenshots**: For UI changes
- **Related issues**: Issues this PR addresses

## 🐛 Reporting Issues

### Bug Reports

When reporting bugs, please include:

- **Clear title** describing the issue
- **Steps to reproduce** the problem
- **Expected behavior** vs actual behavior
- **Environment details** (OS, browser, versions)
- **Screenshots or error messages**
- **Code snippets** if applicable

### Feature Requests

For feature requests, please provide:

- **Clear description** of the proposed feature
- **Use case** and benefits
- **Implementation ideas** if you have them
- **Mockups or examples** if applicable

## 📚 Documentation

### Documentation Standards

- Use **Markdown** for all documentation
- Follow the existing documentation style
- Keep language clear and concise
- Include code examples where helpful
- Update documentation with code changes

### Types of Documentation

- **README updates** for new features
- **API documentation** for backend changes
- **Component documentation** for frontend changes
- **Inline code comments** for complex logic

## 🌟 Community

### Getting Help

- **GitHub Discussions**: General questions and community chat
- **GitHub Issues**: Bug reports and feature requests
- **Documentation**: Check the [docs](https://rule-docs.onrender.com/) first

### Recognition

Contributors are recognized through:
- **GitHub profile badges** for active contributors
- **Release notes** shoutouts
- **Contributor acknowledgments** in documentation

### Communication

- Be respectful and constructive in all interactions
- Use inclusive language
- Provide helpful feedback
- Acknowledge contributions from others

---

## 🎉 Recognition

Thank you for contributing to RULE! Your efforts help make AI-powered resume analysis more accessible and effective for everyone.

**Happy coding! 🚀**
