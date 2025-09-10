# 🔒 Security Policy

## 📋 Supported Versions

We actively support the following versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 2.0.x   | :white_check_mark: |
| 1.5.x   | :white_check_mark: |
| < 1.5   | :x:                |

## 🚨 Reporting a Vulnerability

We take security seriously and appreciate your help in keeping RULE and our users safe. If you discover a security vulnerability, please help us by reporting it responsibly.

### 📞 How to Report

**Please DO NOT report security vulnerabilities through public GitHub issues.**

Instead, please report security vulnerabilities by emailing:
- **security@rule-project.org**

You can also report anonymously if you prefer.

### ⏱️ Response Timeline

We will acknowledge your report within **48 hours** and provide a more detailed response within **7 days** indicating our next steps.

We will keep you informed about our progress throughout the process of fixing the vulnerability.

### 📝 What to Include

When reporting a vulnerability, please include:

- **Description**: A clear description of the vulnerability
- **Steps to reproduce**: Detailed steps to reproduce the issue
- **Impact**: Potential impact and severity
- **Environment**: Your environment details (OS, browser, versions)
- **Proof of concept**: If available, include a proof of concept
- **Contact information**: How we can reach you for follow-up

### 🎯 Our Commitment

- We will investigate all legitimate reports
- We will keep you informed throughout the process
- We will credit you (if you wish) once the issue is resolved
- We will not pursue legal action against security researchers

## 🛡️ Security Measures

### Data Protection

RULE implements several security measures to protect user data:

#### File Handling
- **File validation**: Strict PDF file type validation
- **Size limits**: Configurable file size restrictions (default: 10MB)
- **Temporary storage**: Files are processed in memory and automatically cleaned up
- **No persistent storage**: Uploaded files are not stored on disk

#### API Security
- **Input validation**: Comprehensive validation using Pydantic models
- **Rate limiting**: Configurable API rate limits to prevent abuse
- **CORS configuration**: Restricted cross-origin resource sharing
- **Error handling**: Secure error messages without sensitive information

#### LLM Security
- **API key protection**: Secure credential management
- **Provider validation**: Verified LLM provider configurations
- **Prompt sanitization**: Input cleaning and validation
- **Response filtering**: Safe output processing

### 🔐 Authentication & Authorization

For production deployments, we recommend implementing:

```python
# Authentication middleware example
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Depends, HTTPException

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    # Implement your authentication logic
    # Verify JWT token, API key, etc.
    pass
```

### 🚀 Production Security Checklist

- [ ] **HTTPS enabled** in production
- [ ] **API keys stored securely** (environment variables, secret management)
- [ ] **File upload restrictions** configured
- [ ] **Rate limiting** implemented
- [ ] **Security headers** added (CSP, HSTS, etc.)
- [ ] **Regular security updates** for dependencies
- [ ] **Container security scanning** for Docker images
- [ ] **Access logging** and monitoring enabled

## 🔧 Security Best Practices

### For Contributors

When contributing to RULE, please follow these security best practices:

#### Code Review
- Always review code for security implications
- Check for common vulnerabilities (OWASP Top 10)
- Validate input handling and output encoding
- Ensure proper error handling without information leakage

#### Dependencies
- Keep dependencies updated
- Use tools like `safety` or `pip-audit` to check for vulnerabilities
- Review dependency licenses and security posture

#### Secrets Management
- Never commit API keys, passwords, or sensitive data
- Use environment variables for configuration
- Implement proper secret rotation

### For Users

When deploying RULE, consider these security measures:

#### Network Security
```nginx
# Example Nginx configuration with security headers
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL configuration
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### Environment Variables
```bash
# Secure environment configuration
export RULE_SECRET_KEY="your-secure-random-key"
export RULE_DATABASE_URL="postgresql://user:password@localhost/rule"
export RULE_REDIS_URL="redis://localhost:6379"
export RULE_RATE_LIMIT="100/minute"
```

## 🚨 Known Security Considerations

### Current Limitations

1. **File Processing**: Large PDF files may consume significant memory
2. **API Rate Limiting**: Basic rate limiting (consider implementing more robust solutions)
3. **Session Management**: Stateless design (implement proper session handling for production)
4. **Audit Logging**: Basic logging (consider implementing comprehensive audit trails)

### Mitigation Strategies

#### Memory Management
```python
# Example: File size validation
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

@app.post("/api/upload-resume/")
async def upload_resume(file: UploadFile = File(...)):
    # Check file size before processing
    file_content = await file.read()
    if len(file_content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File too large")

    # Process file...
```

#### Rate Limiting
```python
# Example: API rate limiting
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)

@app.post("/api/upload-resume/")
@limiter.limit("10/minute")
async def upload_resume(request: Request, file: UploadFile = File(...)):
    # Process upload...
```

## 📞 Contact

For security-related questions or concerns:

- **Security Issues**: security@rule-project.org
- **General Support**: support@rule-project.org
- **GitHub Issues**: For non-sensitive security discussions

## 🙏 Acknowledgments

We appreciate the security research community for helping keep open-source projects secure. Your contributions help protect users worldwide.

---

**Last updated**: January 2025
**Version**: 2.0.0
