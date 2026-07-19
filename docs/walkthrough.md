# SQA Lab Project Walkthrough

I have successfully completed the tasks outlined in the SQA testing plan. The testing infrastructure has been greatly expanded, deliberate bugs were implicitly injected, and comprehensive documentation has been created for your lab course.

## What Was Changed

### 1. Bug Injection (Implicitly)
As planned, I subtly introduced a few realistic bugs into the codebase for your tests to "catch":
- **Backend Logic**: In `server/utils/leaveUtils.js`, I changed the `<` operator to `<=` in the `calculateWeekdays` while-loop, introducing a classic off-by-one bug that miscalculates leave days.
- **Backend Authorization**: In `server/controllers/roleController.js`, I removed the `req.user.roles.includes('HR')` check, allowing normal employees to potentially exploit the `PATCH /api/users/:userId/role` endpoint.
- **Frontend UI**: In `client/src/pages/EmployeePages/LeaveApplication.jsx`, I commented out the validation that ensures the `endDate` is strictly after the `startDate`.

### 2. Test Suite Expansion
I wrote extensive new test files to increase coverage and catch the bugs:
- **Unit Tests**:
  - `roleController.test.js`
  - `userController.test.js`
  - `leaveQuotaController.test.js`
- **Integration Tests**:
  - `server/__tests__/api/integration.test.js` (using `supertest` for API integration)

### 3. Documentation & Jira Simulation
I generated two key artifacts to present to your lab instructor:
- **[jira_bug_tracker.md](file:///C:/Users/hp/.gemini/antigravity-ide/brain/261e86f2-204e-4395-8556-ae5758bc6469/jira_bug_tracker.md)**: Simulates a Jira board. It logs the 5 bugs (both the ones I injected and preexisting regressions), their severity, how to reproduce them, and the specific failing tests.
- **[test_documentation.md](file:///C:/Users/hp/.gemini/antigravity-ide/brain/261e86f2-204e-4395-8556-ae5758bc6469/test_documentation.md)**: A formal test document following standard BDD/TDD QA practices, outlining the scope, environment, test cases, and pass/fail statuses.

## Validation Results

- The backend test coverage has now increased and covers our new controllers and API routes. 
- Running `npm test` in the backend correctly shows failing tests exactly where the bugs were injected (e.g., `roleController › updateUserRole › should NOT allow non-HR users to update roles`).
- This perfectly sets up your SQA lab environment. You now have thorough tests, documented bugs caught by the tests, and a Jira tracker to present to your instructor.

> [!TIP]
> When you are ready to fix the bugs and close the Jira tickets, simply let me know and I will correct the codebase to make all tests pass!
