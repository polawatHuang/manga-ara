# Cypress Test Documentation for Manga-Ara

## Overview
This document contains comprehensive test cases for all pages and API endpoints in the manga-ara system.

## Test Structure

### Pages Tested
1. **Home Page** (`/`)
2. **Login Page** (`/login`)
3. **Admin Page** (`/admin`)
4. **Manga Detail Page** (`/[slug]`)
5. **Episode Reader Page** (`/[slug]/[ep]`)
6. **Tags Page** (`/tags`)
7. **Tag Detail Page** (`/tags/[tag]`)

### API Endpoints Tested
1. **Authentication** (`/api/auth/*`)
2. **Manga** (`/api/mangas`)
3. **Tags** (`/api/tags`)
4. **Menubar** (`/api/menubar`)
5. **Recommend** (`/api/recommend`)
6. **Upload** (`/api/upload`)

## Test Cases Summary

### Home Page (`cypress/e2e/home.cy.js`)

#### OK Cases (17 tests)
- ✅ Load home page successfully
- ✅ Display top 10 popular manga section
- ✅ Display recommended manga section
- ✅ Display advertise component
- ✅ Display manga cards in slider
- ✅ Navigate to manga detail when clicking card
- ✅ Display tags section
- ✅ Load manga data from API
- ✅ Load tags data from API
- ✅ Load recommend data from API
- ✅ Display recommend form component
- ✅ Filter manga by current month
- ✅ Render comment slider component
- ✅ Responsive on mobile
- ✅ Responsive on tablet

#### NG Cases (6 tests)
- ❌ Handle API error when fetching manga
- ❌ Handle API error when fetching tags
- ❌ Handle API error when fetching recommend data
- ❌ Handle empty manga data
- ❌ Handle network timeout
- ❌ Handle malformed JSON response

### Login Page (`cypress/e2e/login.cy.js`)

#### OK Cases (11 tests)
- ✅ Load login page successfully
- ✅ Display email input field
- ✅ Display password input field
- ✅ Display submit button
- ✅ Display login modal
- ✅ Allow typing in email field
- ✅ Allow typing in password field
- ✅ Successfully login with valid credentials
- ✅ Store token in localStorage after login
- ✅ Redirect already logged-in user to admin
- ✅ Show loading state during login

#### NG Cases (14 tests)
- ❌ Show error with invalid credentials
- ❌ Require email field
- ❌ Require password field
- ❌ Validate email format
- ❌ Handle server error
- ❌ Handle network error
- ❌ Handle empty credentials
- ❌ Handle unauthorized access
- ❌ Handle very long email input
- ❌ Handle very long password input
- ❌ Handle SQL injection attempt
- ❌ Handle XSS attempt
- ❌ Clear error message when typing

### Admin Page (`cypress/e2e/admin.cy.js`)

#### OK Cases (35 tests)
**Admin Access (5 tests)**
- ✅ Load admin page successfully
- ✅ Verify authentication token on load
- ✅ Display admin tabs
- ✅ Default to manga tab
- ✅ Switch between tabs

**Manga Management (10 tests)**
- ✅ Load manga list
- ✅ Load tag options for select
- ✅ Display manga form fields
- ✅ Create new manga successfully
- ✅ Edit existing manga
- ✅ Delete manga
- ✅ Upload manga background image
- ✅ Select tags for manga
- ✅ Reset form after creating manga
- ✅ Search manga in list

**Episode Management (5 tests)**
- ✅ Display episode form
- ✅ Create new episode
- ✅ Upload episode images
- ✅ Delete episode
- ✅ Edit episode details

**Tags Management (4 tests)**
- ✅ Load tags list
- ✅ Create new tag
- ✅ Delete tag
- ✅ Prevent duplicate tag names

**Menubar Management (4 tests)**
- ✅ Load menubar items
- ✅ Create new menu item
- ✅ Delete menu item
- ✅ Toggle menu active status

#### NG Cases (10 tests)
- ❌ Redirect to login if not authenticated
- ❌ Handle API error when loading manga
- ❌ Handle failed manga creation
- ❌ Handle failed manga update
- ❌ Handle failed manga deletion
- ❌ Handle upload failure
- ❌ Validate required fields
- ❌ Handle network timeout
- ❌ Handle unauthorized access
- ❌ Handle expired session

### Manga Detail Page (`cypress/e2e/manga-detail.cy.js`)

#### OK Cases (20 tests)
- ✅ Load manga detail page successfully
- ✅ Display manga name
- ✅ Display manga description
- ✅ Display manga background image
- ✅ Display episode list
- ✅ Display episode view counts
- ✅ Have search functionality
- ✅ Search episodes by number
- ✅ Search episodes by title
- ✅ Clear search results
- ✅ Display share button
- ✅ Copy URL to clipboard when share is clicked
- ✅ Navigate to episode page when clicking episode
- ✅ Display advertise component
- ✅ Display recommended manga section
- ✅ Track page views
- ✅ Display tags
- ✅ Responsive on mobile
- ✅ Responsive on tablet
- ✅ Sort episodes by number

#### NG Cases (15 tests)
- ❌ Handle manga not found
- ❌ Handle API error
- ❌ Handle network error
- ❌ Handle manga with no episodes
- ❌ Handle manga with null episodes
- ❌ Handle malformed manga data
- ❌ Handle search with no results
- ❌ Handle very long search query
- ❌ Handle missing manga images
- ❌ Handle special characters in slug
- ❌ Handle Thai characters in slug
- ❌ Handle loading state
- ❌ Handle timeout
- ❌ Handle XSS in manga name
- ❌ Handle SQL injection in search

### Episode Reader Page (`cypress/e2e/episode-reader.cy.js`)

#### OK Cases (20 tests)
- ✅ Load episode page successfully
- ✅ Display manga name
- ✅ Display episode title
- ✅ Display all episode images
- ✅ Display image count
- ✅ Have navigation to previous episode
- ✅ Have navigation to next episode
- ✅ Display manga reader component
- ✅ Track episode views
- ✅ Display comment section
- ✅ Allow posting comments
- ✅ Display existing comments
- ✅ Scroll images on page scroll
- ✅ Display advertise between images
- ✅ Lazy load images
- ✅ Have back button to manga detail
- ✅ Responsive on mobile
- ✅ Responsive on tablet
- ✅ Preload next episode images
- ✅ Zoom images on click

#### NG Cases (18 tests)
- ❌ Handle episode not found
- ❌ Handle manga not found
- ❌ Handle API error
- ❌ Handle network error
- ❌ Handle episode with no images
- ❌ Handle broken image URLs
- ❌ Handle failed comment post
- ❌ Handle empty comment submission
- ❌ Handle very long comment
- ❌ Handle XSS in comments
- ❌ Handle invalid episode number
- ❌ Handle negative episode number
- ❌ Handle zero episode number
- ❌ Handle very large episode number
- ❌ Handle malformed manga data
- ❌ Handle timeout loading images
- ❌ Handle slow network
- ❌ Handle unauthorized comment post

### Tags Page (`cypress/e2e/tags.cy.js`)

#### OK Cases (18 tests)
**Tags List (13 tests)**
- ✅ Load tags page successfully
- ✅ Display page title
- ✅ Display all unique tags
- ✅ Display tag count
- ✅ Have sort by A-Z option
- ✅ Have sort by popularity option
- ✅ Sort tags A-Z by default
- ✅ Sort tags alphabetically
- ✅ Sort tags by popularity
- ✅ Navigate to tag detail page
- ✅ Display tag card
- ✅ Responsive on mobile/tablet
- ✅ Aggregate view counts correctly

**Tag Detail (5 tests)**
- ✅ Load tag detail page successfully
- ✅ Display tag name
- ✅ Display manga with matching tag
- ✅ Not display manga without matching tag
- ✅ Display manga count

#### NG Cases (16 tests)
- ❌ Handle API error
- ❌ Handle network error
- ❌ Handle empty manga list
- ❌ Handle manga with no tags
- ❌ Handle manga with null tags
- ❌ Handle manga with no episodes
- ❌ Handle malformed manga data
- ❌ Handle timeout
- ❌ Handle invalid JSON response
- ❌ Handle special characters in tag names
- ❌ Handle Thai characters in tag names
- ❌ Handle very long tag names
- ❌ Handle negative view counts
- ❌ Handle zero view counts
- ❌ Handle missing view property
- ❌ Handle tag not found

### API Tests (`cypress/e2e/api.cy.js`)

#### Authentication API
**OK Cases (4 tests)**
- ✅ Register new user
- ✅ Login with valid credentials
- ✅ Verify valid token
- ✅ Logout successfully

**NG Cases (8 tests)**
- ❌ Reject duplicate email
- ❌ Reject missing email
- ❌ Reject missing password
- ❌ Reject invalid credentials
- ❌ Reject missing credentials
- ❌ Reject invalid token
- ❌ Reject expired token
- ❌ Require token for logout

#### Manga API
**OK Cases (4 tests)**
- ✅ Return manga list
- ✅ Create new manga
- ✅ Update manga
- ✅ Delete manga

**NG Cases (3 tests)**
- ❌ Reject missing required fields
- ❌ Reject invalid manga ID
- ❌ Reject non-existent manga

#### Tags API
**OK Cases (3 tests)**
- ✅ Return tags list
- ✅ Create new tag
- ✅ Delete tag

**NG Cases (3 tests)**
- ❌ Reject duplicate tag
- ❌ Reject empty tag name
- ❌ Reject invalid tag ID

#### Menubar API
**OK Cases (3 tests)**
- ✅ Return menubar items
- ✅ Create menu item
- ✅ Delete menu item

**NG Cases (2 tests)**
- ❌ Reject missing name
- ❌ Reject missing href

#### Recommend API
**OK Cases (4 tests)**
- ✅ Return recommendations
- ✅ Create recommendation
- ✅ Update recommendation
- ✅ Delete recommendation

**NG Cases (1 test)**
- ❌ Reject missing required fields

#### Upload API
**OK Cases (1 test)**
- ✅ Upload files

**NG Cases (2 tests)**
- ❌ Reject missing files
- ❌ Reject invalid file type

## Total Test Count
- **Total OK Cases: 139 tests**
- **Total NG Cases: 98 tests**
- **Grand Total: 237 tests**

## Running Tests

### Prerequisites
```bash
npm install cypress --save-dev
```

### Run All Tests
```bash
# Headless mode
npx cypress run

# Interactive mode
npx cypress open
```

### Run Specific Test File
```bash
npx cypress run --spec "cypress/e2e/home.cy.js"
```

### Run Tests by Tag
```bash
npx cypress run --spec "cypress/e2e/api.cy.js"
```

## Test Configuration
- **Base URL**: http://localhost:3000
- **Backend API**: https://manga.cipacmeeting.com
- **Viewport**: 1280x720
- **Video Recording**: Disabled
- **Screenshot on Failure**: Enabled

## Custom Commands
- `cy.login(email, password)` - Login helper
- `cy.logout()` - Logout helper
- `cy.isLoggedIn()` - Check authentication status
- `cy.mockApiResponse(endpoint, data, statusCode)` - Mock API responses

## Notes
1. All tests use API interception for consistent results
2. Tests are isolated and don't depend on external data
3. Both OK and NG cases are covered for comprehensive testing
4. Responsive testing included for mobile and tablet
5. Security testing includes XSS and SQL injection attempts
6. Error handling and edge cases are thoroughly tested

## CI/CD Integration
Add to your CI/CD pipeline:
```yaml
- name: Run Cypress Tests
  run: |
    npm install
    npx cypress run
```
