# Contributing to Carbon Meter

Thank you for your interest in contributing to Carbon Meter! This document provides guidelines for contributing to this project.

## 🤝 How to Contribute

### 1. Fork the Repository

1. Go to [https://github.com/CarbonMeter/Final-Project](https://github.com/CarbonMeter/Final-Project)
2. Click the "Fork" button in the top right corner
3. Clone your forked repository locally

### 2. Set Up Development Environment

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/Final-Project.git
cd Final-Project

# Install dependencies
npm install

# Copy environment template
cp env.example .env.local

# Edit .env.local with your configuration
```

### 3. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 4. Make Your Changes

- Write clean, readable code
- Follow the existing code style
- Add comments for complex logic
- Update documentation if needed
- Test your changes thoroughly

### 5. Commit Your Changes

```bash
git add .
git commit -m "feat: add your feature description"
```

### 6. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## 📋 Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow ESLint rules
- Use Prettier for formatting
- Write meaningful commit messages

### Commit Message Format

```
type(scope): description

Examples:
feat(auth): add Google OAuth login
fix(calculator): resolve calculation bug
docs(readme): update installation instructions
```

### Testing

- Test your changes locally
- Ensure all existing tests pass
- Add tests for new features when possible

## 🐛 Reporting Bugs

When reporting bugs, please include:

1. **Description**: Clear description of the bug
2. **Steps to Reproduce**: Step-by-step instructions
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Environment**: OS, browser, Node.js version
6. **Screenshots**: If applicable

## 💡 Suggesting Features

When suggesting features:

1. **Clear Description**: Explain the feature
2. **Use Case**: Why is this feature needed?
3. **Implementation Ideas**: How could it be implemented?
4. **Mockups**: If possible, include design mockups

## 📝 Documentation

- Update README.md for significant changes
- Add JSDoc comments for new functions
- Update API documentation if needed

## 🔧 Local Development

### Prerequisites

- Node.js 18+
- MongoDB (local or cloud)
- npm or pnpm

### Running the Project

```bash
# Install dependencies
npm install

# Set up environment variables
cp env.example .env.local
# Edit .env.local with your configuration

# Run development server
npm run dev
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🎯 Areas for Contribution

- **Frontend Components**: UI improvements, new components
- **Backend API**: New endpoints, optimizations
- **Database**: Schema improvements, queries
- **Testing**: Unit tests, integration tests
- **Documentation**: README, API docs, guides
- **Performance**: Optimizations, caching
- **Security**: Security improvements, audits

## 📞 Getting Help

- Check existing issues and discussions
- Join our community chat (if available)
- Contact maintainers for urgent issues

## 🙏 Thank You

Thank you for contributing to Carbon Meter! Your contributions help make the world a more sustainable place.

---

**Together, we can make a difference for our planet! 🌍** 