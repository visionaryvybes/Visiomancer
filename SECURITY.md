# Security Policy

## Supported Versions

We actively support the following versions of Visiomancer with security updates:

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security issue, please follow these steps:

### How to Report

1. **DO NOT** create a public GitHub issue for security vulnerabilities
2. Send an email to the repository maintainers with:
   - A detailed description of the vulnerability
   - Steps to reproduce the issue
   - Potential impact assessment
   - Any suggested fixes (if available)

### What to Expect

- **Response Time**: We aim to respond within 48 hours
- **Investigation**: We will investigate and assess the reported vulnerability
- **Updates**: You will receive regular updates on the status of your report
- **Resolution**: We will work to address confirmed vulnerabilities promptly

### Security Best Practices

When using Visiomancer components:

1. **Environment Variables**: Never commit `.env` files or expose API keys
2. **Dependencies**: Regularly update dependencies to receive security patches
3. **Input Validation**: Always validate user inputs in your implementations
4. **HTTPS**: Use HTTPS in production environments
5. **Authentication**: Implement proper authentication and authorization

## Security Features

- **Dependency Scanning**: Regular dependency vulnerability checks
- **Input Sanitization**: Built-in protection against XSS attacks
- **Secure Defaults**: Components use secure coding practices by default

## Recent Security Updates

- **2025-01-29**: Updated Next.js to v15.4.4 to address SSRF and DoS vulnerabilities
- **2025-01-29**: Fixed form-data and brace-expansion security issues

## Acknowledgments

We appreciate security researchers and users who help us maintain the security of Visiomancer. Responsible disclosure helps protect all users.