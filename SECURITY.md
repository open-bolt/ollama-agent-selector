
# Security Policy

## Supported Versions

We take security seriously and provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

We appreciate your efforts to responsibly disclose security vulnerabilities. To report a security vulnerability, please follow these steps:

### How to Report

1. **Do NOT open a GitHub issue** for security vulnerabilities
2. Send an email to [SECURITY_EMAIL] with the following information:
   - Description of the vulnerability
   - Steps to reproduce the issue
   - Potential impact assessment
   - Any suggested fixes or mitigations

### What to Include

Please provide as much information as possible:

- **Vulnerability Type**: (e.g., XSS, CSRF, injection, etc.)
- **Location**: Specific file(s) and line numbers if possible
- **Impact**: What an attacker could achieve
- **Proof of Concept**: Steps to reproduce or exploit
- **Suggested Fix**: If you have ideas for remediation

### Response Timeline

- **Initial Response**: Within 48 hours of receiving your report
- **Status Update**: Within 7 days with assessment results
- **Resolution**: Security fixes will be prioritized and released as soon as possible

### Security Considerations

This project interfaces with local Ollama instances and handles:

- **Local Network Requests**: Communication with Ollama API
- **File Uploads**: Image files for vision models
- **User Input**: Chat messages and prompts
- **Client-Side Storage**: Chat history and preferences

### Best Practices for Users

When using this application:

1. **Keep Ollama Updated**: Always use the latest version of Ollama
2. **Network Security**: Be cautious when exposing Ollama to network access
3. **Input Validation**: Be mindful of the content you share with AI models
4. **Local Environment**: This app is designed for local use only

### Known Security Considerations

- This application is designed for local development and testing
- It communicates with local Ollama instances on `localhost:11434`
- No external network requests are made (except to local Ollama)
- All processing happens client-side or through your local Ollama instance

### Acknowledgments

We will acknowledge security researchers who responsibly disclose vulnerabilities:

- Your name (if you wish to be credited)
- Link to your website or GitHub profile
- Brief description of the vulnerability found

### Legal

- We will not pursue legal action against researchers who follow responsible disclosure
- We ask that you do not access, modify, or delete user data
- Please do not perform testing on production systems

## Security Updates

Security updates will be:

- Released as patch versions (e.g., 1.0.1, 1.0.2)
- Documented in the CHANGELOG.md
- Announced in release notes
- Tagged as security releases

## Contact

For security-related questions or concerns:
- Email: [SECURITY_EMAIL]
- Response time: Within 48 hours

Thank you for helping keep our project secure!
