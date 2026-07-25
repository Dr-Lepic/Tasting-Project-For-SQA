# Jira Bug Tracker

This document organizes the Jira board for the SQA lab course. It lists the bugs we've discovered through our test cases.

## Jira Board Organization

### Columns (Statuses)
- **To Do**: Bugs that have been logged but not yet picked up.
- **In Progress**: Bugs currently being investigated or fixed.
- **In Review**: Fixes that are undergoing code review or QA testing.
- **Done**: Verified fixes that are merged into the main branch.

---

## Logged Bugs

### SQA-1: Off-by-one Error in Leave Day Calculation (Backend)
- **Status**: To Do
- **Severity**: High
- **Description**: The `calculateWeekdays` function in `leaveUtils.js` fails to count the final day of a leave period if it is a weekday.
- **Failing Test ID**: TC-85

### SQA-2: HR Authorization Bypass in Role Assignment (Backend)
- **Status**: To Do
- **Severity**: Critical
- **Description**: The `updateUserRole` function in `roleController.js` lacks an authorization check to ensure the requester is an HR.
- **Failing Test ID**: TC-88

### SQA-3: Leave Form Date Validation Bypass (Frontend)
- **Status**: To Do
- **Severity**: Medium
- **Description**: The frontend form in `LeaveApplication.jsx` allows users to select an end date that is before the start date.
- **Failing Test ID**: TC-82

### SQA-4: HR Reset Leave Quota Accessible by Employees (Backend)
- **Status**: To Do
- **Severity**: Critical
- **Description**: Employees can trigger the `resetUsedLeaveQuota` endpoints, bypassing HR roles.
- **Failing Test ID**: TC-89 (Also relates to legacy test TC-60)

### SQA-5: Forgot Password Case-Sensitivity Regression (Backend)
- **Status**: To Do
- **Severity**: Low
- **Description**: The forgot password functionality fails to find a user if the email is provided in a different case.
- **Failing Test ID**: TC-79 (Also relates to legacy test TC-17)

### SQA-6: Leave-day mismatch validation is too permissive (Backend)
- **Status**: To Do
- **Severity**: Medium
- **Description**: Submit a leave request where the submitted day count does not match the actual valid weekdays after excluding weekends/holidays and observe acceptance.
- **Failing Test ID**: TC-62, TC-63, TC-64

### SQA-7: Role-based access control gaps around leave approvals and alternate handling (Backend)
- **Status**: To Do
- **Severity**: High
- **Description**: Use employee/alternate tokens to access actions reserved for HoD/HR and observe whether the API blocks them. There is an authorization gap here.
- **Failing Test ID**: TC-66, TC-67, TC-68

### SQA-8: Unauthorized Member Leave History Access by Regular Employees (Backend)
- **Status**: To Do
- **Severity**: High
- **Description**: The `getMemberHistory` endpoint in `leaveController.js` is documented and intended for HoD and HR access only, but lacks role and department authorization checks on `req.user`. A regular employee can view any other employee's private leave history by passing their `userId`.
- **Failing Test ID**: TC-90

### SQA-9: Numeric OTP Input Crashes verifyOTP with 500 TypeError (Backend)
- **Status**: To Do
- **Severity**: Medium
- **Description**: The `verifyOTP` endpoint in `authController.js` attempts `otp.trim()` on `req.body.otp`. If a client passes a number instead of a string (e.g. `{ otp: 123456 }`), Node/Express crashes with an unhandled `TypeError: otp.trim is not a function`, returning 500 Server Error instead of 400 Bad Request.
- **Failing Test ID**: TC-91

### SQA-10: HoD Analytics Crashes on Null Department Dereference (Backend)
- **Status**: To Do
- **Severity**: High
- **Description**: The `getHoDAnalytics` endpoint in `analyticsController.js` accesses `currentUser.department._id` directly after verifying the user has the `HoD` role. If `department` is null or unassigned, it throws an unhandled `TypeError: Cannot read properties of null (reading '_id')`, crashing with a 500 Server Error.
- **Failing Test ID**: TC-92


