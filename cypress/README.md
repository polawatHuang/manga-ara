# Cypress Test Suite Setup Guide

## Installation

1. Install Cypress and dependencies:
```bash
npm install --save-dev cypress cypress-file-upload
```

2. Verify installation:
```bash
npx cypress verify
```

## Running Tests

### All Tests
```bash
# Run all tests headless
npm test

# Run all tests with browser UI
npm run test:open

# Run all tests with visible browser
npm run test:headed
```

### Individual Test Suites
```bash
# Home page tests
npm run test:home

# Login page tests
npm run test:login

# Admin page tests
npm run test:admin

# Manga detail page tests
npm run test:manga

# Episode reader tests
npm run test:episode

# Tags page tests
npm run test:tags

# API endpoint tests
npm run test:api
```

## Test Files Structure
```
cypress/
├── e2e/
│   ├── home.cy.js           # Home page tests (23 tests)
│   ├── login.cy.js          # Login page tests (25 tests)
│   ├── admin.cy.js          # Admin page tests (45 tests)
│   ├── manga-detail.cy.js   # Manga detail tests (35 tests)
│   ├── episode-reader.cy.js # Episode reader tests (38 tests)
│   ├── tags.cy.js           # Tags page tests (34 tests)
│   └── api.cy.js            # API tests (37 tests)
├── fixtures/
│   └── test-image.jpg       # Test image for upload
├── support/
│   ├── commands.js          # Custom commands
│   └── e2e.js              # Support file
└── TEST_DOCUMENTATION.md    # Detailed test documentation

Total: 237 test cases
```

## Test Coverage

### Pages Tested
- ✅ Home Page (/)
- ✅ Login Page (/login)
- ✅ Admin Page (/admin)
- ✅ Manga Detail Page (/[slug])
- ✅ Episode Reader Page (/[slug]/[ep])
- ✅ Tags Page (/tags)
- ✅ Tag Detail Page (/tags/[tag])

### API Endpoints Tested
- ✅ POST /api/auth/register
- ✅ POST /api/auth/login
- ✅ POST /api/auth/logout
- ✅ POST /api/auth/verify
- ✅ GET /api/mangas
- ✅ POST /api/mangas
- ✅ PUT /api/mangas
- ✅ DELETE /api/mangas
- ✅ GET /api/tags
- ✅ POST /api/tags
- ✅ DELETE /api/tags
- ✅ GET /api/menubar
- ✅ POST /api/menubar
- ✅ DELETE /api/menubar
- ✅ GET /api/recommend
- ✅ POST /api/recommend
- ✅ PUT /api/recommend
- ✅ DELETE /api/recommend
- ✅ POST /api/upload

## Custom Cypress Commands

### cy.login(email, password)
Login helper command
```javascript
cy.login('admin@test.com', 'password123')
```

### cy.logout()
Logout helper command
```javascript
cy.logout()
```

### cy.isLoggedIn()
Check authentication status
```javascript
cy.isLoggedIn()
```

### cy.mockApiResponse(endpoint, data, statusCode)
Mock API responses for testing
```javascript
cy.mockApiResponse('/api/mangas', [{ id: 1, name: 'Test' }], 200)
```

## Test Categories

### OK Cases (139 tests)
Tests that verify expected behavior:
- Page loads successfully
- Data displays correctly
- User interactions work as expected
- Navigation functions properly
- API calls return correct data

### NG Cases (98 tests)
Tests that verify error handling:
- API errors (500, 404, 401, 403)
- Network failures
- Invalid input data
- Missing required fields
- Authentication failures
- Malformed data
- Security issues (XSS, SQL injection)
- Edge cases (empty data, null values)
- Timeout scenarios

## Configuration

### cypress.config.js
```javascript
{
  baseUrl: 'http://localhost:3000',
  viewportWidth: 1280,
  viewportHeight: 720,
  video: false,
  screenshotOnRunFailure: true
}
```

### Environment Variables
Create `cypress.env.json` for sensitive data:
```json
{
  "adminEmail": "admin@test.com",
  "adminPassword": "password123",
  "apiUrl": "https://manga.cipacmeeting.com"
}
```

## CI/CD Integration

### GitHub Actions
```yaml
name: Cypress Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: cypress-io/github-action@v5
        with:
          build: npm run build
          start: npm start
          wait-on: 'http://localhost:3000'
```

### GitLab CI
```yaml
cypress-tests:
  image: cypress/base:latest
  script:
    - npm install
    - npm run build
    - npm start &
    - npx cypress run
```

## Best Practices

1. **Isolation**: Each test is independent and doesn't rely on other tests
2. **Cleanup**: Tests clean up after themselves
3. **Mocking**: Use API interception for consistent results
4. **Assertions**: Multiple assertions to verify complete behavior
5. **Error Handling**: Both success and failure paths are tested
6. **Responsive**: Tests include mobile and tablet viewports
7. **Security**: XSS and SQL injection attempts are tested

## Troubleshooting

### Tests fail locally
```bash
# Clear Cypress cache
npx cypress cache clear

# Reinstall Cypress
npm uninstall cypress
npm install --save-dev cypress
```

### Browser issues
```bash
# Run with specific browser
npx cypress run --browser chrome
npx cypress run --browser firefox
npx cypress run --browser edge
```

### Debugging
```bash
# Run with debug mode
DEBUG=cypress:* npx cypress run

# Run single test file
npx cypress run --spec "cypress/e2e/home.cy.js"
```

## Reporting

### Generate HTML Report
```bash
npm install --save-dev mochawesome mochawesome-merge mochawesome-report-generator

# Update cypress.config.js
reporter: 'mochawesome',
reporterOptions: {
  reportDir: 'cypress/results',
  overwrite: false,
  html: false,
  json: true
}
```

### View Test Results
```bash
# Merge reports
npx mochawesome-merge cypress/results/*.json > merged-report.json

# Generate HTML
npx marge merged-report.json
```

## Next Steps

1. Install Cypress: `npm install`
2. Run tests: `npm run test:open`
3. Review test results
4. Integrate into CI/CD pipeline
5. Monitor test coverage
6. Add more tests as needed

## Support

For issues or questions:
- Check Cypress documentation: https://docs.cypress.io
- Review TEST_DOCUMENTATION.md
- Check test files for examples
