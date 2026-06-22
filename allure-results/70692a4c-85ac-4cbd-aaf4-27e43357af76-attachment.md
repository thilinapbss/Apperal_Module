# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 12. TC-BPO-002: Verify Buyer PO Upload page loaded
- Location: e2e\apparel_regression_testing.spec.ts:74:7

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected substring: "buyerpoupload"
Received string:    "http://kgntest.ddns.net:4005/login.html"
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e4]:
    - img "SAP" [ref=e5]
    - heading "Apperal Module" [level=1] [ref=e6]
    - paragraph [ref=e7]: Sign in to your account
  - generic [ref=e8]:
    - generic [ref=e9]:
      - generic [ref=e10]: Username
      - textbox "Username" [ref=e11]:
        - /placeholder: Enter username
    - generic [ref=e12]:
      - generic [ref=e13]: Password
      - textbox "Password" [ref=e14]:
        - /placeholder: Enter password
    - button "Sign In" [ref=e15] [cursor=pointer]
```