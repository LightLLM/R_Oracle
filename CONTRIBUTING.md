# Contributing to R-Oracle

Thank you for your interest in contributing to R-Oracle! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different viewpoints and experiences

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/LightLLM/R_Oracle/issues)
2. If not, create a new issue using the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.md)
3. Provide as much detail as possible:
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details
   - Screenshots/logs if applicable

### Suggesting Features

1. Check if the feature has already been suggested
2. Create a new issue using the [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.md)
3. Clearly describe:
   - The problem it solves
   - Proposed solution
   - Alternatives considered

### Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/LightLLM/R_Oracle.git
   cd R_Oracle
   ```

2. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

3. **Make your changes**
   - Write clean, readable code
   - Follow existing code style
   - Add tests for new functionality
   - Update documentation as needed

4. **Test your changes**
   ```bash
   # Test pallet
   cargo test -p pallet-roracle
   
   # Test frontend
   cd frontend
   npm test
   ```

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   # Use conventional commits:
   # feat: new feature
   # fix: bug fix
   # docs: documentation
   # test: tests
   # refactor: code refactoring
   # chore: maintenance
   ```

6. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   Then create a Pull Request on GitHub using the PR template.

## Development Setup

### Prerequisites

- Rust (latest stable)
- Node.js 18+
- Git

### Setup Steps

1. Clone the repository
   ```bash
   git clone https://github.com/LightLLM/R_Oracle.git
   cd R_Oracle
   ```

2. Build the project
   ```bash
   cargo build --release
   ```

3. Set up frontend
   ```bash
   cd frontend
   npm install
   ```

4. Run tests
   ```bash
   # Pallet tests
   cargo test -p pallet-roracle
   
   # Frontend tests
   cd frontend
   npm test
   ```

## Coding Standards

### Rust

- Follow [Rust API Guidelines](https://rust-lang.github.io/api-guidelines/)
- Use `cargo fmt` to format code
- Use `cargo clippy` to check for issues
- Write tests for all new functionality
- Document public APIs

### TypeScript/React

- Follow [TypeScript best practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- Use functional components with hooks
- Follow React best practices
- Write tests for components and utilities
- Use meaningful variable and function names

### Git Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance

Examples:
```
feat(oracle): add Coinbase price source
fix(pallet): handle zero value validation
docs(readme): update installation instructions
```

## Testing

- Write tests for all new code
- Ensure all existing tests pass
- Aim for high test coverage
- Test edge cases and error conditions

### Running Tests

```bash
# All pallet tests
cargo test -p pallet-roracle

# Specific test
cargo test -p pallet-roracle test_submit_oracle_value_success

# Frontend tests
cd frontend
npm test

# With coverage
npm run test:coverage
```

## Documentation

- Update README.md for user-facing changes
- Add code comments for complex logic
- Update API documentation
- Add examples where helpful

## Review Process

1. All PRs require at least one review
2. CI must pass before merging
3. Address review comments promptly
4. Keep PRs focused and reasonably sized
5. Update CHANGELOG.md for user-facing changes

## Questions?

- Open an issue for questions
- Check existing documentation
- Ask in discussions

Thank you for contributing to R-Oracle! 🚀

