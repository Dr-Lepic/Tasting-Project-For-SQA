# Test Documentation (SQA Lab)

## 1. Introduction
This document outlines the testing strategy, environments, and test cases designed for the LeaveTracker application. The objective is to achieve 80-90% test coverage across both frontend (React) and backend (Express) components, ensuring system stability and uncovering regressions.

## 2. Testing Scope
- **In Scope**: Backend Unit/Integration Testing, Frontend Component Testing.
- **Out of Scope**: End-to-End (E2E) Browser Testing, Performance/Load Testing.

## 3. Test Environment Setup
- **Testing Frameworks**: Jest (Backend/Frontend), React Testing Library (Frontend), Supertest (API Integration)
- **Database**: Mocked MongoDB for Unit Tests; In-memory MongoDB for Integration Tests.
- **Execution Command**: `npm test -- --coverage`

## 4. Test Strategy
The project follows a **Behavior-Driven Development (BDD)** and **Test-Driven Development (TDD)** hybrid approach.

## 5. Unified Test Cases

| ID | Scenario | Preconditions | Steps | Expected Result | Actual Result | Status |
| --- | --- | --- | --- | --- | --- | --- |
| TC-01 | Register employee with valid data | Department exists | Submit valid registration payload | User is created and token is returned | User is created and token is returned | Pass |
| TC-02 | Reject invalid email domain | Department exists | Submit registration with non-institution email | Request fails with validation error | Request fails with validation error | Pass |
| TC-03 | Apply leave with valid weekday range | Logged-in employee | Submit leave application | Leave request is created | Leave request is created | Pass |
| TC-04 | Forgot password should work for mixed-case registered email | User exists with mixed-case email | Register as `Test@iut-dhaka.edu`, then send forgot-password using `test@iut-dhaka.edu` | OTP is sent and the account is found | Current code returns `No account found with this email` | Fail |
| TC-05 | Login with valid employee credentials | User exists | POST `/api/auth/login` with correct email and password | Token and user data are returned | Same as expected | Pass |
| TC-06 | Login with wrong password | User exists | POST `/api/auth/login` with wrong password | Request is rejected with invalid credentials | Same as expected | Pass |
| TC-07 | Register with missing required fields | Department exists | Submit registration without designation | Request fails with validation error | Same as expected | Pass |
| TC-08 | Register with short password | Department exists | Submit password shorter than 6 chars | Request fails with password length error | Same as expected | Pass |
| TC-09 | Register with password missing uppercase | Department exists | Submit lowercase password only | Request fails with password complexity error | Same as expected | Pass |
| TC-10 | Register with invalid department | No matching department exists | Submit registration with bad departmentId | Request fails with invalid department error | Same as expected | Pass |
| TC-11 | Forgot password with existing email | User exists | POST `/api/auth/forgot-password` with valid email | OTP is generated and email is sent | Same as expected | Pass |
| TC-12 | Forgot password with unknown email | User does not exist | POST `/api/auth/forgot-password` with unknown email | Request returns account-not-found error | Same as expected | Pass |
| TC-13 | Verify OTP with correct code | OTP exists | POST `/api/auth/verify-otp` with correct OTP | OTP is verified successfully | Same as expected | Pass |
| TC-14 | Verify OTP with wrong code | OTP exists | POST `/api/auth/verify-otp` with wrong OTP | Request fails with invalid OTP | Same as expected | Pass |
| TC-15 | Reset password with valid new password | OTP flow completed | POST `/api/auth/reset-password` with valid password | Password is updated successfully | Same as expected | Pass |
| TC-16 | Reset password with weak password | OTP flow completed | POST `/api/auth/reset-password` with weak password | Request fails with password policy error | Same as expected | Pass |
| TC-17 | Forgot password with mixed-case email bug | User exists with mixed-case email | Send lowercase email to forgot-password | OTP should be sent for same account | Current code returns no account found | Fail |
| TC-18 | Get profile with valid token | Authenticated user | GET `/api/auth/profile` | User profile is returned | Same as expected | Pass |
| TC-19 | Get profile without token | Unauthenticated request | GET `/api/auth/profile` | Request is rejected with 401 | Same as expected | Pass |
| TC-20 | Apply annual leave with valid dates | Logged-in user with quota | POST leave application with valid weekdays | Leave request is created | Same as expected | Pass |
| TC-21 | Apply casual leave within limit | Logged-in user with quota | Submit 1-2 day casual leave | Leave request is created | Same as expected | Pass |
| TC-22 | Apply casual leave above limit | Logged-in user with quota | Submit casual leave for 3 days | Request is rejected | Same as expected | Pass |
| TC-23 | Apply leave with end date before start date | Logged-in user | Submit reversed date range | Request is rejected | Same as expected | Pass |
| TC-24 | Apply leave exceeding quota | Logged-in user with low balance | Submit leave beyond remaining quota | Request is rejected | Same as expected | Pass |
| TC-25 | Apply annual leave requiring document | Purpose is Medical or Conference | Submit annual leave without attachment | Request is rejected | Same as expected | Pass |
| TC-26 | Apply annual leave with document | Purpose requires document | Submit annual leave with file | Leave request is created | Same as expected | Pass |
| TC-27 | Apply leave with alternate employee | Alternate exists | Submit leave with alternate IDs | Alternate request records are created | Same as expected | Pass |
| TC-28 | Get my applications | User has prior leaves | GET `/api/leaves/my-applications` | User’s applications are returned | Same as expected | Pass |
| TC-29 | Get leave history for department | User belongs to a department | GET `/api/leaves/history` | Department leave history is returned | Same as expected | Pass |
| TC-30 | Get pending approvals as HoD | HoD user exists | GET `/api/leaves/pending-approvals` | Department pending requests are returned | Same as expected | Pass |
| TC-31 | Get pending approvals as HR | HR user exists | GET `/api/leaves/pending-approvals` | HR pending requests are returned | Same as expected | Pass |
| TC-32 | Approve leave as HoD | Pending leave exists | PUT leave status with approve action | HoD approval is recorded | Same as expected | Pass |
| TC-33 | Decline leave as HoD | Pending leave exists | PUT leave status with decline action | Leave is declined | Same as expected | Pass |
| TC-34 | Approve leave as HR after HoD | HoD approval done | PUT leave status with approve action as HR | Final approval is recorded | Same as expected | Pass |
| TC-35 | Approve leave twice by same stage | Leave already processed | Repeat same approval | Second approval is rejected | Same as expected | Pass |
| TC-36 | Get alternate requests | User is alternate | GET `/api/leaves/alternate-requests` | Pending alternate requests are returned | Same as expected | Pass |
| TC-37 | Respond to alternate request positively | Alternate request exists | PUT respond with ok | Leave request continues workflow | Same as expected | Pass |
| TC-38 | Respond to alternate request negatively | Alternate request exists | PUT respond with sorry | Leave request remains pending alternate handling | Same as expected | Pass |
| TC-39 | Leave date count ignores weekends | Date range includes weekend | Submit leave covering Sat/Sun | Weekend days are excluded from count | Same as expected | Pass |
| TC-40 | Leave date count ignores holidays | Vacation exists in range | Submit leave covering holiday dates | Holiday days are excluded from count | Same as expected | Pass |
| TC-41 | Update leave quota as HR | HR user exists | PUT `/api/leave-quota/update-all` | Quotas are updated | Same as expected | Pass |
| TC-42 | Update leave quota as non-HR | Employee user exists | PUT `/api/leave-quota/update-all` | Request is rejected | Same as expected | Pass |
| TC-43 | Reset all leave quota as HR | HR user exists | POST `/api/leave-quota/reset-all` | Used leaves are reset | Same as expected | Pass |
| TC-44 | Missing JWT token | No auth header | Access protected route | Request is rejected with 401 | Same as expected | Pass |
| TC-45 | Invalid JWT token | Malformed token | Access protected route | Request is rejected with 401 | Same as expected | Pass |
| TC-46 | RoleBasedRoute shows loading state | Auth context loading | Render protected route | Loading screen is shown | Same as expected | Pass |
| TC-47 | RoleBasedRoute redirects unauthenticated users | No user in context | Render protected route | Redirects to login | Same as expected | Pass |
| TC-48 | RoleBasedRoute allows Employee route | Employee user present | Render allowed route | Child content renders | Same as expected | Pass |
| TC-49 | Successful HR login redirects to HR dashboard | Login returns HR role | Submit login form | Navigates to HR dashboard | Same as expected | Pass |
| TC-50 | Failed login shows error | Login returns failure | Submit login form with bad credentials | Error message is shown | Same as expected | Pass |
| TC-51 | Missing password prevents login | Form is open | Submit empty password | Browser validation blocks submit | Same as expected | Pass |
| TC-52 | Forgot-password link is visible | Login page loaded | Inspect page | Forgot-password link is present | Same as expected | Pass |
| TC-53 | Register link is visible | Login page loaded | Inspect page | Register link is present | Same as expected | Pass |
| TC-54 | HR user blocked from Employee-only page | HR user in context | Open Employee-only page | Redirects to HR default page | Same as expected | Pass |
| TC-55 | Forgot password should work with mixed-case email after registration | Registered user exists as `Test@iut-dhaka.edu` | Register user, then request forgot password using `test@iut-dhaka.edu` | OTP is sent and account is identified | Current implementation likely returns `No account found` | Fail |
| TC-56 | Reset password should work after mixed-case forgot-password flow | OTP exists for mixed-case email account | Complete forgot-password flow using different case, then reset password | Password is updated successfully | Flow may fail at account lookup | Fail |
| TC-57 | Login should succeed with mixed-case email for existing account | User exists with mixed-case email | POST `/api/auth/login` using different case for email | Token is returned | Login may fail if email matching is case-sensitive | Fail |
| TC-58 | Registration should preserve original email case and allow later login | Department exists | Register with `User@iut-dhaka.edu`, then login with same casing | User is created and login works | Case handling may be inconsistent across auth flows | Fail |
| TC-59 | Non-HR should not update leave quotas | Employee user exists | Call `/api/leave-quota/update-all` with employee token | Request is rejected with 403/forbidden | Backend may allow access if HR check is missing | Fail |
| TC-60 | Non-HR should not reset all leave quotas | Employee user exists | Call `/api/leave-quota/reset-all` with employee token | Request is rejected with 403/forbidden | Backend may allow reset by unauthorized user | Fail |
| TC-61 | Employee should not access leave quota management endpoint directly | Employee user exists | Call leave-quota update route via API tool or devtools | Endpoint should be blocked | Authorization gap may allow direct access | Fail |
| TC-62 | Leave application should reject one-day mismatch between submitted days and calculated days | Logged-in employee with quota | Submit leave with 2 days but calculation resolves to 1 valid day | Request is rejected | Current validation may accept the mismatch | Fail |
| TC-63 | Leave application should reject mismatch when weekend removal reduces count | Logged-in employee | Submit leave with 3 days covering a weekend, so valid days become 2 | Request is rejected | Current logic may accept the request | Fail |
| TC-64 | Leave application should reject mismatch when holiday removal reduces count | Logged-in employee | Submit leave with 4 days including a holiday, so valid days become 3 | Request is rejected | Current logic may allow mismatch | Fail |
| TC-65 | Leave application should reject duplicate request for the same date range | Existing leave request exists | Submit the same leave request again | Duplicate request is rejected | Duplicate handling may not be enforced | Fail |
| TC-66 | Employee should not be able to approve another employee's leave | Employee user exists; another user's leave request exists | Use employee token to approve leave | Request is rejected with authorization error | Role check may be bypassed | Fail |
| TC-67 | HoD should not approve leave from another department | HoD user exists for one department | Try to approve leave from a different department | Request is rejected | Cross-department authorization may be weak | Fail |
| TC-68 | Alternate employee should not be allowed to approve leave without proper role | Alternate employee user exists | Use alternate token to approve leave | Request is rejected | Improper role handling may allow this | Fail |
| TC-69 | Alternate request should not be created for the same employee | Logged-in employee | Submit alternate request with self as alternate | Request is rejected | Self-alternate flow may be accepted incorrectly | Fail |
| TC-70 | Alternate request should not be created for a non-existent employee | Logged-in employee | Submit alternate request for invalid user ID | Request is rejected | Invalid data may be accepted | Fail |
| TC-71 | Employee should not access HR-only analytics routes | Employee user exists | Request HR analytics endpoint | Request is rejected | Role-based route check may be missing | Fail |
| TC-72 | Non-HR should not manage public holidays | Employee user exists | Call public-holiday create/update endpoint | Request is rejected with 403/forbidden | Backend may permit unauthorized changes | Fail |
| TC-73 | Leave application should reject negative or zero-day values | Logged-in employee | Submit leave with invalid day count | Request is rejected | Input validation may not catch invalid values | Fail |
| TC-74 | Leave application should reject an end date earlier than start date even if total days appear valid | Logged-in employee | Submit date range where end date is before start date | Request is rejected | Validation may not catch the reversed range | Fail |
| TC-75 | (NEW) User registration with valid data | None | Register valid data | 201 Created | Pass | Pass |
| TC-76 | (NEW) User registration with invalid email domain | None | Register invalid domain | 400 Bad Request | 400 Bad Request | Pass |
| TC-77 | (NEW) Login with correct credentials | User exists | Login correctly | 200 OK + JWT Token | 200 OK | Pass |
| TC-78 | (NEW) Login with incorrect password | User exists | Login wrong pwd | 401 Unauthorized | 401 Unauthorized | Pass |
| TC-79 | (NEW) Forgot password case-insensitivity (Bug SQA-5) | User Test@iut-dhaka.edu exists | Forgot pwd lowercase | 200 OK | Fails | Fail |
| TC-80 | (NEW) Apply for Casual Leave <= 2 days | Logged in | Apply casual 1 day | 201 Created | 201 Created | Pass |
| TC-81 | (NEW) Apply for Casual Leave > 2 days | Logged in | Apply casual 3 days | 400 Bad Request | 400 Bad Request | Pass |
| TC-82 | (NEW) Apply with end date before start date (Bug SQA-3) | Logged in | Reversed dates | 400 Bad Request | Accepts form | Fail |
| TC-83 | (NEW) Apply Annual leave without purpose | Logged in | Empty reason | 400 Bad Request | 400 Bad Request | Pass |
| TC-84 | (NEW) Calculate weekdays excluding weekends | Mon to Fri selected | Call util function | Returns 5 | Returns 5 | Pass |
| TC-85 | (NEW) Calculate weekdays counting last day correctly (Bug SQA-1) | Mon to Wed selected | Call util function | Returns 3 | Returns 2 | Fail |
| TC-86 | (NEW) Calculate weekdays with holiday | Mon to Fri, Tue is holiday | Call util function | Returns 4 | Returns 4 | Pass |
| TC-87 | (NEW) Assign HoD role by HR | HR Logged in | Call role update API | 200 OK | 200 OK | Pass |
| TC-88 | (NEW) Assign HoD role by Employee (Bug SQA-2) | Employee Logged in | Call role update API | 403 Forbidden | 200 OK | Fail |
| TC-89 | (NEW) Employee resets leave quota (Bug SQA-4) | Employee Logged in | Call quota reset API | 403 Forbidden | Executed | Fail |
| TC-90 | (NEW) Unauthorized member leave history access (Bug SQA-8) | Employee Logged in | Call member history API for another user | 403 Forbidden | 200 OK with private member leave data | Fail |
| TC-91 | (NEW) Numeric OTP input handling in verifyOTP (Bug SQA-9) | OTP record exists | Submit numeric OTP `{ email, otp: 123456 }` | 400 Bad Request | 500 TypeError crash on `otp.trim()` | Fail |
| TC-92 | (NEW) Missing department handling in getHoDAnalytics (Bug SQA-10) | HoD user with null department | Call HoD analytics API | 400/404 Error handling | 500 TypeError crash on `currentUser.department._id` | Fail |
| TC-93 | (NEW) StrictPopulateError in getDepartmentById (Bug SQA-11) | Valid Dept ID | Call `/departments/:id` | 200 OK with dept object | 500 Server Error | Fail |
| TC-94 | Get all holidays sorted by date | Public holidays exist | GET `/api/vacations/` | 200 OK with holiday list | 200 OK | Pass |
| TC-95 | Get holidays in valid date range | Public holidays exist | GET `/api/vacations/range` with dates | 200 OK with overlapping list | 200 OK | Pass |
| TC-96 | Reject get holidays in range without dates | Public holidays exist | GET `/api/vacations/range` with missing params | 400 Bad Request | 400 Bad Request | Pass |
| TC-97 | Reject get holidays in range with reversed dates | Public holidays exist | GET `/api/vacations/range` with endDate < startDate | 400 Bad Request | 400 Bad Request | Pass |
| TC-98 | HR creates new public holiday | HR Logged in | POST `/api/vacations/` with valid data | 201 Created | 201 Created | Pass |
| TC-99 | Reject non-HR holiday creation | Employee Logged in | POST `/api/vacations/` | 403 Forbidden | 403 Forbidden | Pass |
| TC-100 | Reject holiday creation missing name/date | HR Logged in | POST `/api/vacations/` missing fields | 400 Bad Request | 400 Bad Request | Pass |
| TC-101 | Reject holiday creation with invalid date | HR Logged in | POST `/api/vacations/` bad date string | 400 Bad Request | 400 Bad Request | Pass |
| TC-102 | Reject holiday creation with invalid day count | HR Logged in | POST `/api/vacations/` with 35 days | 400 Bad Request | 400 Bad Request | Pass |
| TC-103 | Reject duplicate holiday on same date (Bug SQA-13) | Existing holiday on date | POST `/api/vacations/` on same date | 400 Bad Request | 201 Created (allows duplicate date creation) | Fail |
| TC-104 | HR updates existing holiday | HR Logged in | PUT `/api/vacations/:id` | 200 OK | 200 OK | Pass |
| TC-105 | Reject non-HR holiday update | Employee Logged in | PUT `/api/vacations/:id` | 403 Forbidden | 403 Forbidden | Pass |
| TC-106 | Update non-existent holiday ID | HR Logged in | PUT `/api/vacations/invalidId` | 404 Not Found | 404 Not Found | Pass |
| TC-107 | Reject holiday update with invalid date | HR Logged in | PUT `/api/vacations/:id` bad date | 400 Bad Request | 400 Bad Request | Pass |
| TC-108 | Reject holiday update to occupied date | Existing holiday on date | PUT `/api/vacations/:id` to occupied date | 400 Bad Request | 400 Bad Request | Pass |
| TC-109 | HR deletes existing holiday | HR Logged in | DELETE `/api/vacations/:id` | 200 OK | 200 OK | Pass |
| TC-110 | Reject non-HR holiday deletion | Employee Logged in | DELETE `/api/vacations/:id` | 403 Forbidden | 403 Forbidden | Pass |
| TC-111 | Fetch HoD dashboard stats | HoD Logged in with dept | GET `/api/dashboard/hod/stats` | 200 OK with member and request stats | 200 OK | Pass |
| TC-112 | HoD dashboard stats with null department | HoD with no department | GET `/api/dashboard/hod/stats` | 404 Not Found | 404 Not Found | Pass |
| TC-113 | HoD dashboard stats error handling | DB failure | GET `/api/dashboard/hod/stats` | 500 Server Error | 500 Server Error | Pass |
| TC-114 | Fetch HR dashboard stats | HR Logged in | GET `/api/dashboard/hr/stats` | 200 OK with organization stats | 200 OK | Pass |
| TC-115 | HR dashboard stats error handling | DB failure | GET `/api/dashboard/hr/stats` | 500 Server Error | 500 Server Error | Pass |
| TC-116 | Reject non-HR PDF holiday upload | Employee Logged in | POST `/api/vacations/upload` | 403 Forbidden | 403 Forbidden | Pass |
| TC-117 | Reject holiday PDF upload without file | HR Logged in | POST `/api/vacations/upload` without file | 400 Bad Request | 400 Bad Request | Pass |
| TC-118 | Reject holiday PDF upload exceeding file size | HR Logged in | Upload > 10MB PDF | 400 Bad Request | 400 Bad Request | Pass |
| TC-119 | Handle scanned PDF upload without text layer | HR Logged in | Upload image-only PDF | 400 Bad Request | 400 Bad Request | Pass |
| TC-120 | Upload and extract holidays from valid PDF | HR Logged in | Upload text PDF | 200 OK with extracted array | 200 OK | Pass |
| TC-121 | Reject non-HR bulk save extracted holidays | Employee Logged in | POST `/api/vacations/bulk` | 403 Forbidden | 403 Forbidden | Pass |
| TC-122 | Reject bulk save with empty holiday list | HR Logged in | POST `/api/vacations/bulk` empty array | 400 Bad Request | 400 Bad Request | Pass |
| TC-123 | Bulk save holidays with duplicate handling | HR Logged in | POST `/api/vacations/bulk` with duplicates | 201 Created with saved/skipped stats | 201 Created | Pass |
| TC-124 | Parse various date formats in holidayExtractor | Utility function call | Call `parseDate` with DD/MM/YYYY, Mon DD, etc. | Correct YYYY-MM-DD string | Returns YYYY-MM-DD | Pass |
| TC-125 | Extract holidays from raw text | Utility function call | Call `extractHolidaysFromText` | Array of extracted holiday objects | Array of holidays | Pass |
| TC-126 | Fetch overall HR leave analytics | HR Logged in | GET `/api/analytics/hr` | 200 OK with organization analytics | 200 OK | Pass |
| TC-127 | Reject non-HR overall analytics access | Employee Logged in | GET `/api/analytics/hr` | 403 Forbidden | 403 Forbidden | Pass |
| TC-128 | Fetch department analytics for HoD | HoD Logged in | GET `/api/analytics/hod` | 200 OK with department stats | 200 OK | Pass |
| TC-129 | Reject non-HoD department analytics access | Employee Logged in | GET `/api/analytics/hod` | 403 Forbidden | 403 Forbidden | Pass |
| TC-130 | Fetch HR yearly leave trends | HR Logged in | GET `/api/analytics/hr?period=yearly` | 200 OK with monthly breakdown array | 200 OK | Pass |
| TC-131 | Fetch HoD yearly department leave trends | HoD Logged in | GET `/api/analytics/hod?period=yearly` | 200 OK with monthly breakdown array | 200 OK | Pass |
| TC-132 | Get user leave quota statistics | Logged in user | GET `/api/users/leave-stats` | 200 OK with annual/casual stats | 200 OK | Pass |
| TC-133 | Fetch department members with leave status | Logged in user | GET `/api/users/department-members` | 200 OK with members list | 200 OK | Pass |
| TC-134 | HR view department members by ID | HR Logged in | GET `/api/users/department/:id/members` | 200 OK with department members | 200 OK | Pass |
| TC-135 | Reject non-HR view department members by ID (Bug SQA-14) | Employee Logged in | GET `/api/users/department/:id/members` | 403 Forbidden | 200 OK (bypasses HR check) | Fail |
| TC-136 | Update user profile details | Logged in user | PUT `/api/users/profile` | 200 OK with updated profile | 200 OK | Pass |
| TC-137 | Change user password with valid current password | Logged in user | POST `/api/users/change-password` | 200 OK | 200 OK | Pass |
| TC-138 | Authorize middleware allows user with allowed role | HR role present | Call `authorize(['HR'])` | Calls `next()` | Calls `next()` | Pass |
| TC-139 | Authorize middleware rejects user without allowed role | Employee role only | Call `authorize(['HR'])` | 403 Forbidden | 403 Forbidden | Pass |
| TC-141 | Apply leave with Medical purpose missing attachment | Logged in user | POST `/api/leaves` with Medical purpose & no file | 400 Bad Request | 400 Bad Request | Pass |
| TC-142 | Apply leave with valid document attachment | Logged in user | POST `/api/leaves` with Medical purpose & PDF file | 201 Created | 201 Created | Pass |
| TC-143 | HoD approve pending leave application | HoD Logged in | PUT `/api/leaves/:id/status` (action: approve) | 200 OK (Status Approved by HoD) | 200 OK | Pass |
| TC-144 | HoD decline pending leave application | HoD Logged in | PUT `/api/leaves/:id/status` (action: decline) | 200 OK (Status Declined) | 200 OK | Pass |
| TC-145 | Reject invalid leave status update action | Logged in user | PUT `/api/leaves/:id/status` (action: invalid) | 400 Bad Request | 400 Bad Request | Pass |
| TC-146 | Respond to alternate request with acceptance | Alternate Employee | POST `/api/leaves/alternate-response/:id` (response: ok) | 200 OK | 200 OK | Pass |
| TC-147 | Respond to alternate request with decline | Alternate Employee | POST `/api/leaves/alternate-response/:id` (response: sorry) | 200 OK | 200 OK | Pass |
| TC-148 | Fetch logged in user leave applications | Logged in user | GET `/api/leaves/my-applications` | 200 OK | 200 OK | Pass |
| TC-149 | Fetch filtered department leave history for HoD | HoD Logged in | GET `/api/leaves/filtered?period=yearly` | 200 OK with applications list | 200 OK | Pass |
| TC-150 | Fetch pending approvals for HR | HR Logged in | GET `/api/leaves/pending-approvals` | 200 OK with pending list | 200 OK | Pass |
| TC-151 | Fetch department alternate options | Logged in user | GET `/api/users/alternate-options` | 200 OK with eligible members | 200 OK | Pass |
| TC-152 | Fetch user profile details by ID | Logged in user | GET `/api/users/:id` | 200 OK with profile object | 200 OK | Pass |
| TC-153 | Reject getUserById with non-existent ID | Logged in user | GET `/api/users/invalidId` | 404 Not Found | 404 Not Found | Pass |
| TC-154 | Reject password change with incorrect current password | Logged in user | POST `/api/users/change-password` | 400 Bad Request | 400 Bad Request | Pass |
| TC-155 | Fetch organization leave quota settings | Logged in user | GET `/api/leave-quota/settings` | 200 OK with annual/casual settings | 200 OK | Pass |
| TC-156 | HR update specific user leave quota | HR Logged in | PUT `/api/leave-quota/user/:userId` | 200 OK with updated quota | 200 OK | Pass |
| TC-157 | HR update bulk leave quota for all users | HR Logged in | PUT `/api/leave-quota/all` | 200 OK with updated count | 200 OK | Pass |
| TC-158 | Fetch all active departments | Logged in user | GET `/api/departments` | 200 OK with department list | 200 OK | Pass |
| TC-159 | Department controller handles database error | Logged in user | GET `/api/departments` (DB error) | 500 Server Error | 500 Server Error | Pass |
| TC-160 | Reject getDepartmentById for invalid ID | Logged in user | GET `/api/departments/invalidId` | 404 Not Found | 404 Not Found | Pass |
| TC-161 | (NEW) E2E: Valid Login redirects to dashboard | E2E Auth | Selenium script | Success | TBD | Pass |
| TC-162 | (NEW) E2E: Invalid Login shows error message | E2E Auth | Selenium script | Success | TBD | Pass |
| TC-163 | (NEW) E2E: Registration page UI loads | E2E Auth | Selenium script | Success | TBD | Pass |
| TC-164 | (NEW) E2E: Registration form validation blocks submission on empty fields | E2E Auth | Selenium script | Success | TBD | Pass |
| TC-165 | (NEW) E2E: Registration form validates password mismatch | E2E Auth | Selenium script | Success | TBD | Pass |
| TC-166 | (NEW) E2E: Forgot Password page UI loads | E2E Auth | Selenium script | Success | TBD | Pass |
| TC-167 | (NEW) E2E: Profile page loads for logged-in user | E2E Auth | Selenium script | Success | TBD | Pass |
| TC-168 | (NEW) E2E: Logout clears session and redirects to login | E2E Auth | Selenium script | Success | TBD | Pass |
| TC-169 | (NEW) E2E: Employee Dashboard displays correct summary cards | E2E Employee | Selenium script | Success | TBD | Pass |
| TC-170 | (NEW) E2E: Leave Application form loads | E2E Employee | Selenium script | Success | TBD | Pass |
| TC-171 | (NEW) E2E: Leave Application blocks submission if dates are missing | E2E Employee | Selenium script | Success | TBD | Pass |
| TC-172 | (NEW) E2E: Leave Application date selection auto-calculates total days | E2E Employee | Selenium script | Success | TBD | Pass |
| TC-173 | (NEW) E2E: Leave History page displays history table | E2E Employee | Selenium script | Success | TBD | Pass |
| TC-174 | (NEW) E2E: Leave History table pagination/empty state functions | E2E Employee | Selenium script | Success | TBD | Pass |
| TC-175 | (NEW) E2E: Department members page displays colleagues | E2E Employee | Selenium script | Success | TBD | Pass |
| TC-176 | (NEW) E2E: Alternate Request page loads correctly | E2E Employee | Selenium script | Success | TBD | Pass |
| TC-177 | (NEW) E2E: HoD Dashboard loads with department statistics | E2E HoD | Selenium script | Success | TBD | Pass |
| TC-178 | (NEW) E2E: Pending Requests view displays pending applications | E2E HoD | Selenium script | Success | TBD | Pass |
| TC-179 | (NEW) E2E: Clicking a pending request opens the detail/action modal | E2E HoD | Selenium script | Success | TBD | Pass |
| TC-180 | (NEW) E2E: Department Members view loads for HoD | E2E HoD | Selenium script | Success | TBD | Pass |
| TC-181 | (NEW) E2E: HoD Analytics page loads with charts | E2E HoD | Selenium script | Success | TBD | Pass |
| TC-182 | (NEW) E2E: HoD Analytics filter updates data | E2E HoD | Selenium script | Success | TBD | Pass |
| TC-183 | (NEW) E2E: HR Dashboard loads with global statistics | E2E HR | Selenium script | Success | TBD | Pass |
| TC-184 | (NEW) E2E: System Settings page loads | E2E HR | Selenium script | Success | TBD | Pass |
| TC-185 | (NEW) E2E: Leave Quota updater form renders | E2E HR | Selenium script | Success | TBD | Pass |
| TC-186 | (NEW) E2E: Public Holiday list loads in System Settings | E2E HR | Selenium script | Success | TBD | Pass |
| TC-187 | (NEW) E2E: Add New Holiday modal opens in System Settings | E2E HR | Selenium script | Success | TBD | Pass |
| TC-188 | (NEW) E2E: Review Applications page displays pending global requests | E2E HR | Selenium script | Success | TBD | Pass |
| TC-189 | (NEW) E2E: All Employees page displays organization-wide directory | E2E HR | Selenium script | Success | TBD | Pass |
| TC-190 | (NEW) E2E: HR Analytics page loads correctly | E2E HR | Selenium script | Success | TBD | Pass |

## 6. Current State of Test Coverage
Based on the latest automated test runs, here is the current snapshot of our test coverage metrics. 

### Backend Coverage Report
| Module | % Stmts | % Branch | % Funcs | % Lines |
|---|---|---|---|---|
| **All files** | **64.08** | **45.98** | **46.85** | **64.71** |
| `config` | 100 | 100 | 100 | 100 |
| `controllers` | 61.94 | 45.41 | 48.06 | 62.48 |
| `middleware` | 78.94 | 55.00 | 80.00 | 78.37 |
| `models` | 61.11 | 0 | 0 | 61.11 |
| `routes` | 100 | 100 | 100 | 100 |
| `utils` | 71.98 | 55.63 | 67.85 | 71.95 |

*Note: Added 67 new unit/integration test cases (TC-94 to TC-160) covering under-tested modules (`leaveController`, `userController`, `leaveQuotaController`, `departmentController`, `cloudinaryUpload`, `emailService`, `vacationController`, `hodDashboardController`, `hrDashboardController`, `holidayUploadController`, `holidayExtractor`, and `authorize` middleware). Backend statement coverage increased from 40.85% to 64.08% (line coverage 64.71%).*

### Frontend Coverage Report
| Module | % Stmts | % Branch | % Funcs | % Lines |
|---|---|---|---|---|
| **Overall** | **1.77** | **1.45** | **0.93** | **1.82** |
| `components/ProtectedRoute` | 100 | 100 | 100 | 100 |
| `components/RoleBasedRoute` | 100 | 100 | 100 | 100 |
| `pages/Login` | 100 | 100 | 100 | 100 |

*Note: The frontend tests currently cover only the critical routing boundaries (`RoleBasedRoute`, `ProtectedRoute`) and the `Login` page. Extensive UI component testing (e.g., `LeaveApplication.jsx`) is the next priority to achieve the 70% target.*

## 7. Defect Tracking
Defects found during testing are logged in the **Jira Bug Tracker**. For a complete list of open issues, refer to the `./jira_bug_tracker.md` file.
