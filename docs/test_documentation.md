# Test Documentation (SQA Lab)

## 1. Introduction
This document outlines the testing strategy, environments, and test cases designed for the LeaveTracker application. The objective is to achieve 80-90% test coverage across both frontend (React) and backend (Express) components, ensuring system stability and uncovering regressions.

## 2. Testing Scope
- **In Scope**:
  - Backend Unit Testing (Controllers, Models, Middleware, Utilities)
  - Backend API Integration Testing (Endpoints)
  - Frontend Component Testing (Forms, Navigation, State Management)
- **Out of Scope**:
  - End-to-End (E2E) Browser Testing (e.g., Cypress)
  - Performance/Load Testing

## 3. Test Environment Setup
- **Testing Frameworks**: Jest (Backend/Frontend), React Testing Library (Frontend), Supertest (API Integration)
- **Database**: Mocked MongoDB (using `jest.mock`) for Unit Tests; In-memory MongoDB for Integration Tests.
- **Execution Command**: 
  - Backend: `npm test -- --coverage`
  - Frontend: `npm test -- --coverage`

## 4. Test Strategy
The project follows a **Behavior-Driven Development (BDD)** and **Test-Driven Development (TDD)** hybrid approach:
1. **Unit Tests**: Isolate functions/components and test logic (e.g., calculateWeekdays).
2. **Integration Tests**: Verify components interact correctly (e.g., API routes).
3. **Regression Tests**: Specific tests written to catch previously discovered bugs (e.g., `bugRegression.test.js`).

## 5. Test Suites and Cases

### 5.1 Backend: Authentication (`authController.test.js`)
| Test ID | Description | Pre-conditions | Expected Result | Status |
|---|---|---|---|---|
| TC-B-01 | User registration with valid data | None | 201 Created | Pass |
| TC-B-02 | User registration with invalid email domain | None | 400 Bad Request | Pass |
| TC-B-03 | Login with correct credentials | User exists | 200 OK + JWT Token | Pass |
| TC-B-04 | Login with incorrect password | User exists | 401 Unauthorized | Pass |
| TC-B-05 | Forgot password case-insensitivity | User `Test@iut-dhaka.edu` exists | 200 OK | **Fail** (Regression) |

### 5.2 Backend: Leave Management (`leaveController.test.js`)
| Test ID | Description | Pre-conditions | Expected Result | Status |
|---|---|---|---|---|
| TC-B-06 | Apply for Casual Leave <= 2 days | Logged in | 201 Created | Pass |
| TC-B-07 | Apply for Casual Leave > 2 days | Logged in | 400 Bad Request | Pass |
| TC-B-08 | Apply with end date before start date | Logged in | 400 Bad Request | Pass |
| TC-B-09 | Apply Annual leave without purpose | Logged in | 400 Bad Request | Pass |

### 5.3 Backend: Utilities (`leaveUtils.test.js`)
| Test ID | Description | Pre-conditions | Expected Result | Status |
|---|---|---|---|---|
| TC-B-10 | Calculate weekdays excluding weekends | Mon to Fri selected | Returns 5 | Pass |
| TC-B-11 | Calculate weekdays counting last day correctly | Mon to Wed selected | Returns 3 | **Fail** (Bug SQA-1) |
| TC-B-12 | Calculate weekdays with holiday | Mon to Fri, Tue is holiday | Returns 4 | Pass |

### 5.4 Backend: Role Assignment (`roleController.test.js`)
| Test ID | Description | Pre-conditions | Expected Result | Status |
|---|---|---|---|---|
| TC-B-13 | Assign HoD role by HR | HR Logged in | 200 OK | Pass |
| TC-B-14 | Assign HoD role by Employee | Employee Logged in | 403 Forbidden | **Fail** (Bug SQA-2) |

### 5.5 Frontend: Leave Application (`LeaveApplication.test.jsx`)
| Test ID | Description | Pre-conditions | Expected Result | Status |
|---|---|---|---|---|
| TC-F-01 | Submit leave with valid dates | Component rendered | API called, success msg | Pass |
| TC-F-02 | Submit leave with invalid dates | Component rendered | Shows UI error | **Fail** (Bug SQA-3) |

## 6. Test Coverage Metrics
*Coverage metrics will be continually updated as tests are executed.*
- **Backend Current Coverage**: ~52% (Target: >80%)
- **Frontend Current Coverage**: ~10% (Target: >80%)

## 7. Defect Tracking
Defects found during testing are logged in the **Jira Bug Tracker**. For a complete list of open issues, refer to the Jira board simulation artifact.
