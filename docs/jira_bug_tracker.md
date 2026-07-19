# Jira Bug Tracker Simulation

This document serves as a template and simulation of how to organize your Jira board for the SQA lab course. It lists the bugs we've discovered (and explicitly injected for the purpose of the lab) through our test cases.

## Jira Board Organization

### Columns (Statuses)
- **To Do**: Bugs that have been logged but not yet picked up.
- **In Progress**: Bugs currently being investigated or fixed.
- **In Review**: Fixes that are undergoing code review or QA testing.
- **Done**: Verified fixes that are merged into the main branch.

### Issue Types
- 🐞 **Bug**: A defect in the system.
- 🧪 **Test**: A task for writing specific test cases.
- 📝 **Task**: General tasks (e.g., set up CI pipeline).

---

## Logged Bugs (To add to your actual Jira)

### SQA-1: Off-by-one Error in Leave Day Calculation (Backend)
- **Status**: To Do
- **Type**: 🐞 Bug
- **Severity**: High
- **Description**: The `calculateWeekdays` function in `leaveUtils.js` fails to count the final day of a leave period if it is a weekday. This results in employees being charged one less day of leave quota than they actually took.
- **Steps to Reproduce**: 
  1. Apply for leave from Monday to Wednesday.
  2. The system calculates the duration as 2 days instead of 3.
- **Failing Test**: `leaveUtils › calculateWeekdays counts only weekdays when no holidays exist`

### SQA-2: HR Authorization Bypass in Role Assignment (Backend)
- **Status**: To Do
- **Type**: 🐞 Bug
- **Severity**: Critical
- **Description**: The `updateUserRole` function in `roleController.js` lacks an authorization check to ensure the requester is an HR. As a result, any authenticated user can theoretically assign the HoD role.
- **Steps to Reproduce**:
  1. Authenticate as a normal Employee.
  2. Send a `PATCH /api/users/:userId/role` request to assign HoD role.
  3. The request succeeds with status 200 instead of 403 Forbidden.
- **Failing Test**: `roleController › updateUserRole › should NOT allow non-HR users to update roles`

### SQA-3: Leave Form Date Validation Bypass (Frontend)
- **Status**: To Do
- **Type**: 🐞 Bug
- **Severity**: Medium
- **Description**: The frontend form in `LeaveApplication.jsx` allows users to select an end date that is before the start date. The validation logic is missing.
- **Steps to Reproduce**:
  1. Go to Leave Application page.
  2. Select Start Date: `2026-07-20`.
  3. Select End Date: `2026-07-15`.
  4. Submit the form. No client-side error is shown.
- **Failing Test**: `LeaveApplication component › should show error if end date is before start date`

### SQA-4: HR Reset Leave Quota Accessible by Employees (Backend)
- **Status**: To Do
- **Type**: 🐞 Bug
- **Severity**: Critical
- **Description**: Employees can trigger the `resetUsedLeaveQuota` and `updateLeaveQuotaForAll` endpoints, bypassing HR roles.
- **Failing Test**: `bug regression tests › resetUsedLeaveQuota should reject non-HR users`

### SQA-5: Forgot Password Case-Sensitivity Regression (Backend)
- **Status**: To Do
- **Type**: 🐞 Bug
- **Severity**: Low
- **Description**: The forgot password functionality fails to find a user if the email is provided in a different case than how it was registered.
- **Failing Test**: `authController forgot password case-sensitivity regression › should find the registered account when forgot-password email is typed in lowercase`

---

## Suggested QA Workflow for Jira
1. **Discover & Log**: When a test fails, create a Bug ticket in the **To Do** column. Link the failing test to the ticket.
2. **Assign**: Assign the ticket to a teammate. Move to **In Progress**.
3. **Fix**: Write the code to fix the bug. Run the test suite to verify it passes.
4. **Review**: Move to **In Review**. Another teammate reviews the code and test coverage.
5. **Close**: Move to **Done**.
