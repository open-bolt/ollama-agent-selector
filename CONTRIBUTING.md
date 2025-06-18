
# Contributing to Ollama AI Chat Interface

Thank you for your interest in contributing to this project! This document provides guidelines and information for contributors.

## 🤝 Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct:

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git
- Basic knowledge of React, TypeScript, and Tailwind CSS

### Setting Up Your Development Environment

1. **Fork the repository**
   Click the "Fork" button at the top right of the repository page.

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/ollama-chat-interface.git
   cd ollama-chat-interface
   ```

3. **Add the original repository as upstream**
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/ollama-chat-interface.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 🔄 Development Workflow

### Making Changes

1. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make your changes**
   - Write clean, readable code
   - Follow the existing code style
   - Add comments where necessary
   - Update documentation if needed

3. **Test your changes**
   ```bash
   npm test
   npm run test:coverage
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature" # or "fix: resolve bug"
   ```

   Follow [Conventional Commits](https://www.conventionalcommits.org/) format:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation changes
   - `style:` for formatting changes
   - `refactor:` for code refactoring
   - `test:` for adding tests
   - `chore:` for maintenance tasks

### Pull Request Process

1. **Push your branch**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill out the PR template

3. **PR Requirements**
   - [ ] Clear description of changes
   - [ ] Tests pass (`npm test`)
   - [ ] Code follows style guidelines
   - [ ] Documentation updated (if needed)
   - [ ] No breaking changes (or clearly documented)

## 🧪 Testing Guidelines

### Writing Tests

- Write tests for new features and bug fixes
- Use descriptive test names
- Follow the existing test patterns
- Aim for good test coverage

### Test Types

- **Unit Tests**: Test individual components and functions
- **Integration Tests**: Test component interactions
- **E2E Tests**: Test complete user workflows (future)

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

## 📝 Code Style Guidelines

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` type unless absolutely necessary
- Use meaningful variable and function names

### React

- Use functional components with hooks
- Follow React best practices
- Use proper prop types
- Handle loading and error states

### CSS/Styling

- Use Tailwind CSS classes
- Follow mobile-first responsive design
- Use shadcn/ui components when possible
- Keep custom CSS minimal

### File Organization

- Keep components small and focused
- Use clear, descriptive file names
- Group related files in appropriate directories
- Export components properly

## 🐛 Reporting Issues

### Bug Reports

When reporting bugs, please include:

- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, browser, Node version)
- Screenshots (if applicable)
- Error messages or console logs

### Feature Requests

For feature requests, please provide:

- Clear description of the feature
- Use case and motivation
- Possible implementation approach
- Any relevant examples or mockups

## 📚 Documentation

### Code Documentation

- Add JSDoc comments for complex functions
- Update README.md for new features
- Keep inline comments concise and helpful
- Document any breaking changes

### Commit Messages

Use clear, descriptive commit messages:

```bash
# Good
git commit -m "feat: add image upload for vision models"
git commit -m "fix: resolve model loading race condition"

# Bad
git commit -m "update stuff"
git commit -m "fix bug"
```

## 🎯 Areas for Contribution

We welcome contributions in these areas:

### High Priority
- Bug fixes and performance improvements
- Test coverage improvements
- Accessibility enhancements
- Mobile responsiveness fixes

### Medium Priority
- New Ollama model support
- UI/UX improvements
- Documentation improvements
- Code refactoring

### Low Priority
- New features (discuss first)
- Experimental functionality
- Developer tooling improvements

## 💬 Getting Help

If you need help or have questions:

1. Check existing [Issues](../../issues) and [Discussions](../../discussions)
2. Create a new issue with the "question" label
3. Join our community chat (if available)
4. Review the codebase and documentation

## 🏆 Recognition

Contributors will be recognized in:

- README.md contributors section
- Release notes for significant contributions
- Project documentation

Thank you for contributing to making local AI more accessible! 🚀
