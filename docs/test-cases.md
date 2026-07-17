# Test Cases

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