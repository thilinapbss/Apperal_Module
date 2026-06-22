# Login Test Cases

## Test Case: TC-LGN-001
- **Title:** Login page loads correctly
- **Priority:** High
- **Type:** Smoke
- **Precondition:** App URL is accessible
- **Steps:**
  1. Open browser
  2. Navigate to http://kgntest.ddns.net:4005/login.html
- **Expected Result:** Login page loads with Username field, Password field, and Login button visible within 3 seconds
- **Status:** [ ] Not Started

---

## Test Case: TC-LGN-002
- **Title:** Empty username and password validation
- **Priority:** High
- **Type:** Functional
- **Precondition:** Login page is open
- **Steps:**
  1. Leave Username empty
  2. Leave Password empty
  3. Click Login button
- **Expected Result:** Validation error shown: 'Username is required' or similar. Form does not submit.
- **Status:** [ ] Not Started

---

## Test Case: TC-LGN-003
- **Title:** Invalid credentials error message
- **Priority:** High
- **Type:** Functional
- **Precondition:** Login page is open
- **Steps:**
  1. Enter invalid username
  2. Enter invalid password
  3. Click Login button
- **Expected Result:** Error message displayed: 'Invalid username or password'. Form does not submit.
- **Status:** [ ] Completed (exists as test 02)

---

## Test Case: TC-LGN-004
- **Title:** Successful login with valid credentials
- **Priority:** High
- **Type:** Smoke
- **Precondition:** Login page is open
- **Steps:**
  1. Enter valid username (admin)
  2. Enter valid password (Admin@1234)
  3. Click Login button
- **Expected Result:** User is authenticated and navigated to home page. Dashboard is visible.
- **Status:** [ ] Completed (exists as test 03)

