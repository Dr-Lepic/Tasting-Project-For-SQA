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

### SQA-1: Off-by-one Error in Leave Day Calculation (Backend) ✅
- **Status**: To Do
- **Severity**: High
- **Description**: The `calculateWeekdays` function in `leaveUtils.js` fails to count the final day of a leave period if it is a weekday.
- **Steps to Reproduce**: 1. Log in. 2. Submit a leave application from Monday to Wednesday. 3. Check the calculated leave days.
- **Expected Result**: Should calculate as 3 days.
- **Observed Result**: Calculates as 2 days because it drops the final day.
- **Failing Test ID**: TC-85

### SQA-2: HR Authorization Bypass in Role Assignment (Backend) ✅
- **Status**: To Do
- **Severity**: Critical
- **Description**: The `updateUserRole` function in `roleController.js` lacks an authorization check to ensure the requester is an HR.
- **Steps to Reproduce**: 1. Log in as a regular Employee. 2. Send a PATCH request to `/api/users/:id/role` to add HoD role.
- **Expected Result**: The server should return 403 Forbidden.
- **Observed Result**: The server returns 200 OK and successfully assigns the HoD role.
- **Failing Test ID**: TC-88

### SQA-3: Leave Form Date Validation Bypass (Frontend) ✅
- **Status**: To Do
- **Severity**: Medium
- **Description**: The frontend form in `LeaveApplication.jsx` allows users to select an end date that is before the start date.
- **Steps to Reproduce**: 1. Open LeaveApplication form. 2. Select an end date that is earlier than the start date. 3. Submit the form.
- **Expected Result**: Form validation prevents submission.
- **Observed Result**: Form submits successfully to the backend without raising a UI error.
- **Failing Test ID**: TC-82, TC-196 (TC-B-35)

### SQA-4: HR Reset Leave Quota Accessible by Employees (Backend) ✅
- **Status**: To Do
- **Severity**: Critical
- **Description**: Employees can trigger the `resetUsedLeaveQuota` endpoints, bypassing HR roles.
- **Steps to Reproduce**: 1. Log in as a regular Employee. 2. Send a POST request to `/api/leave-quota/reset-all`.
- **Expected Result**: API returns 403 Forbidden.
- **Observed Result**: API executes successfully and resets all user quotas.
- **Failing Test ID**: TC-89 (Also relates to legacy test TC-60)

### SQA-5: Forgot Password Case-Sensitivity Regression (Backend) ✅
- **Status**: To Do
- **Severity**: Low
- **Description**: The forgot password functionality fails to find a user if the email is provided in a different case.
- **Steps to Reproduce**: 1. Register with email `Test@iut-dhaka.edu`. 2. Request forgot password using lowercase `test@iut-dhaka.edu`.
- **Expected Result**: System finds user ignoring case sensitivity and sends OTP.
- **Observed Result**: System returns "No account found with this email".
- **Failing Test ID**: TC-79 (Also relates to legacy test TC-17)

### SQA-6: Leave-day mismatch validation is too permissive (Backend) ✅
- **Status**: To Do
- **Severity**: Medium
- **Description**: Submit a leave request where the submitted day count does not match the actual valid weekdays after excluding weekends/holidays and observe acceptance.
- **Steps to Reproduce**: 1. Send leave request API call manually with an inflated `numberOfDays` compared to the dates.
- **Expected Result**: API returns 400 Bad Request due to validation mismatch.
- **Observed Result**: API accepts the request and saves the mismatched values.
- **Failing Test ID**: TC-62, TC-63, TC-64

### SQA-7: Role-based access control gaps around leave approvals and alternate handling (Backend) ✅
- **Status**: To Do
- **Severity**: High
- **Description**: Use employee/alternate tokens to access actions reserved for HoD/HR and observe whether the API blocks them. There is an authorization gap here.
- **Steps to Reproduce**: 1. Log in as an Alternate employee. 2. Attempt to approve a leave request via API.
- **Expected Result**: API blocks the request (403 Forbidden).
- **Observed Result**: API allows approval by alternate.
- **Failing Test ID**: TC-66, TC-67, TC-68

### SQA-8: Unauthorized Member Leave History Access by Regular Employees (Backend) ✅
- **Status**: To Do
- **Severity**: High
- **Description**: The `getMemberHistory` endpoint in `leaveController.js` is documented and intended for HoD and HR access only, but lacks role and department authorization checks on `req.user`.
- **Steps to Reproduce**: 1. Log in as a regular Employee. 2. Send GET request to `/api/leaves/member-history/<Another_User_ID>`.
- **Expected Result**: API returns 403 Forbidden.
- **Observed Result**: API returns 200 OK with the private leave history of the requested user.
- **Failing Test ID**: TC-90

### SQA-9: Numeric OTP Input Crashes verifyOTP with 500 TypeError (Backend) ✅
- **Status**: To Do
- **Severity**: Medium
- **Description**: The `verifyOTP` endpoint in `authController.js` attempts `otp.trim()` on `req.body.otp`. If a client passes a number instead of a string, Node/Express crashes.
- **Steps to Reproduce**: 1. Trigger forgot password to generate OTP. 2. Submit verify OTP API request with a numeric OTP payload (e.g. `{ "email": "test@...", "otp": 123456 }`).
- **Expected Result**: API returns 400 Bad Request.
- **Observed Result**: API crashes with 500 TypeError because `otp.trim` is called on a number.
- **Failing Test ID**: TC-91

### SQA-10: HoD Analytics Crashes on Null Department Dereference (Backend) ✅
- **Status**: To Do
- **Severity**: High
- **Description**: The `getHoDAnalytics` endpoint accesses `currentUser.department._id` directly. If `department` is null, it throws a TypeError.
- **Steps to Reproduce**: 1. Create a user with HoD role but without assigning them a department. 2. Log in as this HoD. 3. Call `/api/analytics/hod`.
- **Expected Result**: API handles the null department gracefully (e.g., 400 Bad Request).
- **Observed Result**: API crashes with 500 Server Error due to null dereference on `currentUser.department._id`.
- **Failing Test ID**: TC-92

### SQA-11: StrictPopulateError in Department Details (Backend)
- **Status**: To Do
- **Severity**: High
- **Description**: The `getDepartmentById` endpoint attempts to call `.populate("hod")` on the Department model query. Since the `hod` field does not exist, it throws a `StrictPopulateError`.
- **Steps to Reproduce**: 1. Call GET `/api/departments/:id` with a valid department ID.
- **Expected Result**: Returns 200 OK with the populated department object.
- **Observed Result**: API crashes with 500 Server Error due to `StrictPopulateError` for the missing `hod` path.
- **Failing Test ID**: TC-93

### SQA-12: TypeError in extractFromTableFormat on String Date (Backend)
- **Status**: To Do
- **Severity**: Medium
- **Description**: The `extractFromTableFormat` function in `holidayExtractor.js` attempts to invoke `.toISOString()` on `foundDate`. However, `parseDate` returns a formatted string (`YYYY-MM-DD`) rather than a `Date` instance, causing an unhandled `TypeError: foundDate.toISOString is not a function`.
- **Steps to Reproduce**: 1. Process document text with table format using `extractFromTableFormat("Date | Holiday Name\n2026-05-01 | May Day")`.
- **Expected Result**: Successfully extracts holiday objects without runtime error.
- **Observed Result**: Function crashes with `TypeError: foundDate.toISOString is not a function`.
- **Failing Test ID**: TC-125

### SQA-13: Duplicate Public Holiday Check Bypass in createHoliday (Backend)
- **Status**: To Do
- **Severity**: Medium
- **Description**: The `createHoliday` function in `vacationController.js` fails to reject requests attempting to create a holiday on a date that already has an existing holiday entry.
- **Steps to Reproduce**: 1. Log in as HR. 2. Create a holiday on date `2026-05-01`. 3. Submit another holiday creation request on the exact same date `2026-05-01`.
- **Expected Result**: API returns 400 Bad Request with message `"A holiday already exists on this date"`.
- **Observed Result**: API bypasses validation and returns 201 Created, creating duplicate holiday entries on the same date.
- **Failing Test ID**: TC-103

### SQA-14: HR Authorization Bypass in getMembersByDepartmentId (Backend)
- **Status**: To Do
- **Severity**: Critical
- **Description**: The `getMembersByDepartmentId` endpoint in `userController.js` lacks an authorization check to verify that the requester has the HR role.
- **Steps to Reproduce**: 1. Log in as a regular Employee user. 2. Send GET request to `/api/users/department/:departmentId/members`.
- **Expected Result**: API returns 403 Forbidden with message `"Only HR can view department members"`.
- **Observed Result**: API bypasses role check and returns 200 OK with private department member information.
- **Failing Test ID**: TC-135



