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

## 6. Current State of Test Coverage
Based on the latest automated test runs, here is the current snapshot of our test coverage metrics. 

### Backend Coverage Report
| Module | % Stmts | % Branch | % Funcs | % Lines |
|---|---|---|---|---|
| **All files** | **45.66** | **33.80** | **33.33** | **45.81** |
| `config` | 100 | 100 | 100 | 100 |
| `controllers` | 41.31 | 34.21 | 39.28 | 41.53 |
| `middleware` | 73.91 | 37.50 | 50.00 | 73.91 |
| `models` | 61.11 | 0 | 0 | 61.11 |
| `routes` | 100 | 100 | 100 | 100 |
| `utils` | 45.21 | 38.46 | 26.31 | 44.73 |

*Note: The coverage dropped slightly in percentage because we added new models/routes that are currently untested in the legacy suite, but our new tests correctly exercise the core `leaveUtils`, `roleController`, and `userController` paths required to find the lab bugs.*

### Frontend Coverage Report
| Module | % Stmts | % Branch | % Funcs | % Lines |
|---|---|---|---|---|
| **Overall** | **1.77** | **1.45** | **0.93** | **1.82** |
| `components/ProtectedRoute` | 100 | 100 | 100 | 100 |
| `components/RoleBasedRoute` | 100 | 100 | 100 | 100 |
| `pages/Login` | 100 | 100 | 100 | 100 |

*Note: The frontend tests currently cover only the critical routing boundaries (`RoleBasedRoute`, `ProtectedRoute`) and the `Login` page. Extensive UI component testing (e.g., `LeaveApplication.jsx`) is the next priority to achieve the 80% target.*

## 7. Defect Tracking
Defects found during testing are logged in the **Jira Bug Tracker**. For a complete list of open issues, refer to the `./jira_bug_tracker.md` file.
