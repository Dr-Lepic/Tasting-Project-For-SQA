# Graph Report - Tasting-Project-For-SQA  (2026-08-08)

## Corpus Check
- 144 files · ~67,037 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 819 nodes · 1137 edges · 82 communities (77 shown, 5 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 23 edges (avg confidence: 0.54)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d89b3d34`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- App.jsx
- leaveController.js
- devDependencies
- vacationRoutes.js
- dependencies
- hodDashboardRoutes.js
- dependencies
- server/package.json
- userController.js
- analyticsController.js
- LeaveAnalytics.jsx
- index.js
- leaveQuotaRoutes.js
- authController.js
- SystemSettings.jsx
- authController.test.js
- departmentRoutes.js
- authController.behavior.test.js
- bugRegression.test.js
- Department.js
- User.js
- userRoutes.js
- integration.test.js
- authMiddleware.js
- upload.js
- authRoutes.js
- leaveRoutes.js
- LeaveTracker Quick Start
- db.js
- createHR.js
- Logged Bugs
- vercel.json
- AGENTS.md
- Leaves
- Users
- Test Documentation (SQA Lab)
- LeaveTracker
- LeaveTracker API Reference
- Backend API Reference
- Vacations and Holidays
- AuthContext.jsx
- Data Model
- Authentication
- Common Error Shapes
- What Was Changed
- Local Development Setup
- Troubleshooting
- Leave Quota
- Validation and Business Rules
- Core Features
- Frontend Route Map
- jest
- devDependencies
- scripts
- Conventions
- Business Workflow
- Deployment Notes
- Seed and Utility Scripts
- File Uploads and Cloudinary
- Profile.jsx
- Profile.jsx
- Tech Stack
- leaveQuotaRoutes.js
- cloudinary
- cors
- User.js
- LeaveRequest.js
- leaveRoutes.js
- hrDashboardController.test.js
- departmentRoutes.js
- db.js

## God Nodes (most connected - your core abstractions)
1. `LeaveTracker` - 21 edges
2. `AuthContext` - 17 edges
3. `Logged Bugs` - 15 edges
4. `LeaveTracker API Reference` - 13 edges
5. `Users` - 12 edges
6. `Leaves` - 12 edges
7. `userAPI` - 11 edges
8. `LeaveTracker Quick Start` - 11 edges
9. `leaveAPI` - 9 edges
10. `Backend API Reference` - 9 edges

## Surprising Connections (you probably didn't know these)
- `exportSectionToPDF()` --references--> `jspdf`  [EXTRACTED]
  client/src/utils/pdfExport.js → client/package.json
- `SystemSettings()` --indirect_call--> `HoDSettings()`  [INFERRED]
  client/src/pages/HRPages/SystemSettings.jsx → client/src/components/HoDSettings.jsx
- `SystemSettings()` --indirect_call--> `LeaveQuotaSetter()`  [INFERRED]
  client/src/pages/HRPages/SystemSettings.jsx → client/src/components/LeaveQuotaSetter.jsx
- `SystemSettings()` --indirect_call--> `PublicHoliday()`  [INFERRED]
  client/src/pages/HRPages/SystemSettings.jsx → client/src/components/PublicHoliday.jsx
- `register()` --calls--> `uploadToCloudinary()`  [EXTRACTED]
  server/controllers/authController.js → server/utils/cloudinaryUpload.js

## Import Cycles
- None detected.

## Communities (82 total, 5 thin omitted)

### Community 0 - "App.jsx"
Cohesion: 0.18
Nodes (10): App(), CollegueInfo(), Layout(), Navbar(), AuthProvider(), AlternateRequests(), ApplicationStatus(), LeaveHistory() (+2 more)

### Community 1 - "leaveController.js"
Cohesion: 0.06
Nodes (26): AlternateRequest, applyLeave(), LeaveHistoryLog, LeaveRequest, respondToAlternateRequest(), {
  sendAlternateRequestEmail,
  sendApplicationStatusEmail,
  sendHoDReviewEmail,
  sendHRReviewEmail
}, updateLeaveStatus(), { uploadToCloudinary } (+18 more)

### Community 2 - "devDependencies"
Cohesion: 0.06
Nodes (35): babel-jest, babel-plugin-react-compiler, @babel/preset-env, @babel/preset-react, devDependencies, babel-jest, babel-plugin-react-compiler, @babel/preset-env (+27 more)

### Community 3 - "vacationRoutes.js"
Cohesion: 0.06
Nodes (42): { extractHolidaysFromText, extractFromTableFormat }, extractTextFromPDF(), multer, { PDFParse }, saveExtractedHolidays(), storage, upload, uploadAndExtractHolidays() (+34 more)

### Community 4 - "dependencies"
Cohesion: 0.06
Nodes (31): axios, chart.js, dependencies, axios, chart.js, html2canvas, jspdf, prop-types (+23 more)

### Community 5 - "hodDashboardRoutes.js"
Cohesion: 0.22
Nodes (8): getHoDDashboardStats(), LeaveRequest, User, authMiddleware, authorize, express, { getHoDDashboardStats }, router

### Community 6 - "dependencies"
Cohesion: 0.07
Nodes (29): bcryptjs, cloudinary, cors, dotenv, express, jsonwebtoken, mongoose, multer (+21 more)

### Community 7 - "server/package.json"
Cohesion: 0.09
Nodes (22): **/__tests__/**/*.test.js, author, description, devDependencies, jest, supertest, jest, testEnvironment (+14 more)

### Community 8 - "userController.js"
Cohesion: 0.12
Nodes (9): register(), LeaveRequest, updateProfile(), { uploadToCloudinary, deleteFromCloudinary }, User, cloudinary, deleteFromCloudinary(), streamifier (+1 more)

### Community 9 - "analyticsController.js"
Cohesion: 0.07
Nodes (22): { calculateOverlapDays }, Department, getHoDAnalytics(), getHRAnalytics(), LeaveRequest, User, Department, Department (+14 more)

### Community 10 - "LeaveAnalytics.jsx"
Cohesion: 0.25
Nodes (11): AnalyticsHistoryModal(), BarChart(), CollapsibleSection(), StatsCard(), StatusGanttBar(), HoDAnalytics(), HRAnalytics(), analyticsAPI (+3 more)

### Community 11 - "index.js"
Cohesion: 0.13
Nodes (14): analyticsRoutes, app, authRoutes, connectDB, cors, corsOptions, departmentRoutes, express (+6 more)

### Community 12 - "leaveQuotaRoutes.js"
Cohesion: 0.22
Nodes (8): getHRDashboardStats(), LeaveRequest, User, authMiddleware, authorize, express, { getHRDashboardStats }, router

### Community 13 - "authController.js"
Cohesion: 0.15
Nodes (10): bcrypt, Department, forgotPassword(), jwt, OTP, { sendOTPEmail, generateOTP }, { uploadToCloudinary }, User (+2 more)

### Community 14 - "SystemSettings.jsx"
Cohesion: 0.31
Nodes (6): HoDSettings(), HolidayReviewModal(), LeaveQuotaSetter(), PublicHoliday(), SystemSettings(), leaveQuotaAPI

### Community 15 - "authController.test.js"
Cohesion: 0.22
Nodes (7): authController, Department, OTP, { sendOTPEmail, generateOTP }, User, mongoose, otpSchema

### Community 16 - "departmentRoutes.js"
Cohesion: 0.33
Nodes (4): Department, LeaveRequest, mongoose, User

### Community 17 - "authController.behavior.test.js"
Cohesion: 0.22
Nodes (6): authController, bcrypt, Department, jwt, OTP, User

### Community 18 - "bugRegression.test.js"
Cohesion: 0.25
Nodes (6): authController, leaveController, leaveQuotaController, OTP, User, Vacation

### Community 19 - "Department.js"
Cohesion: 0.22
Nodes (6): ProtectedRoute(), RoleBasedRoute(), AuthContext, Login(), Register(), mockNavigate

### Community 20 - "User.js"
Cohesion: 0.29
Nodes (5): hodDashboardController, LeaveRequest, User, leaveRequestSchema, mongoose

### Community 21 - "userRoutes.js"
Cohesion: 0.29
Nodes (6): authMiddleware, express, roleController, router, upload, userController

### Community 22 - "integration.test.js"
Cohesion: 0.29
Nodes (6): app, authRoutes, express, mongoose, request, userRoutes

### Community 23 - "authMiddleware.js"
Cohesion: 0.33
Nodes (3): jwt, authMiddleware, jwt

### Community 24 - "upload.js"
Cohesion: 0.33
Nodes (4): multer, path, storage, upload

### Community 25 - "authRoutes.js"
Cohesion: 0.33
Nodes (5): authController, authMiddleware, express, router, upload

### Community 26 - "leaveRoutes.js"
Cohesion: 0.50
Nodes (3): /graphify, Usage, What graphify is for

### Community 27 - "LeaveTracker Quick Start"
Cohesion: 0.07
Nodes (26): 1. Install Dependencies, 2. Configure Environment Files, 3. Start the App, 4. Initial Data Setup, 5. First Usage Flow (Recommended), Backend not connecting, Before You Start, Client env file (+18 more)

### Community 28 - "db.js"
Cohesion: 0.29
Nodes (6): LeaveApplicationForm(), HoDPendingRequests(), ReviewApplication(), api, authAPI, leaveAPI

### Community 30 - "Logged Bugs"
Cohesion: 0.11
Nodes (18): Columns (Statuses), Jira Board Organization, Jira Bug Tracker, Logged Bugs, SQA-10: HoD Analytics Crashes on Null Department Dereference (Backend) ✅, SQA-11: StrictPopulateError in Department Details (Backend), SQA-12: TypeError in extractFromTableFormat on String Date (Backend), SQA-13: Duplicate Public Holiday Check Bypass in createHoliday (Backend) (+10 more)

### Community 43 - "AGENTS.md"
Cohesion: 0.17
Nodes (9): After Code Changes, Default Workflow, Practical Rule, Purpose, Scope And Safety, SQA Testing & Documentation Guidelines, When To Use The Graph, graphify (+1 more)

### Community 44 - "Leaves"
Cohesion: 0.17
Nodes (12): `GET /leaves/alternate-requests`, `GET /leaves/filtered-applications`, `GET /leaves/history`, `GET /leaves/:leaveId/logs`, `GET /leaves/member-history/:userId`, `GET /leaves/my-applications`, `GET /leaves/my-history`, `GET /leaves/pending-approvals` (+4 more)

### Community 45 - "Users"
Cohesion: 0.17
Nodes (12): `GET /users/all-grouped`, `GET /users/all-users`, `GET /users/alternate-options`, `GET /users/department/:departmentId/members`, `GET /users/department-members`, `GET /users/:id`, `GET /users/leave-statistics`, `GET /users/:userId/active-leave` (+4 more)

### Community 46 - "Test Documentation (SQA Lab)"
Cohesion: 0.18
Nodes (10): 1. Introduction, 2. Testing Scope, 3. Test Environment Setup, 4. Test Strategy, 5. Unified Test Cases, 6. Current State of Test Coverage, 7. Defect Tracking, Backend Coverage Report (+2 more)

### Community 47 - "LeaveTracker"
Cohesion: 0.18
Nodes (10): Analytics Logic, Architecture Overview, Backend Modules, High-Level Flow, LeaveTracker, Notifications and Emails, Project Goals, Repository Structure (+2 more)

### Community 48 - "LeaveTracker API Reference"
Cohesion: 0.15
Nodes (12): Analytics, Dashboards, Departments, `GET /analytics/hod`, `GET /analytics/hr`, `GET /departments`, `GET /departments/:id`, `GET /hod-dashboard/stats` (+4 more)

### Community 49 - "Backend API Reference"
Cohesion: 0.22
Nodes (9): Analytics, Auth (`/api/auth`), Backend API Reference, Dashboards, Departments (`/api/departments`), Leave Quota (`/api/leave-quota`), Leaves (`/api/leaves`), Users (`/api/users`) (+1 more)

### Community 50 - "Vacations and Holidays"
Cohesion: 0.25
Nodes (8): `DELETE /vacations/:holidayId`, `GET /vacations`, `GET /vacations/range`, `POST /vacations`, `POST /vacations/bulk`, `POST /vacations/upload`, `PUT /vacations/:holidayId`, Vacations and Holidays

### Community 52 - "Data Model"
Cohesion: 0.25
Nodes (8): `AlternateRequest`, Data Model, `Department`, `LeaveHistoryLog`, `LeaveRequest`, `OTP`, `User`, `Vacation`

### Community 53 - "Authentication"
Cohesion: 0.29
Nodes (7): Authentication, `GET /auth/profile`, `POST /auth/forgot-password`, `POST /auth/login`, `POST /auth/register`, `POST /auth/reset-password`, `POST /auth/verify-otp`

### Community 54 - "Common Error Shapes"
Cohesion: 0.29
Nodes (7): Common Error Shapes, Forbidden role, Invalid token, Not found, Server error, Unauthorized (no token), Validation failure

### Community 55 - "What Was Changed"
Cohesion: 0.29
Nodes (6): 1. Bug Injection (Implicitly), 2. Test Suite Expansion, 3. Documentation & Jira Simulation, SQA Lab Project Walkthrough, Validation Results, What Was Changed

### Community 56 - "Local Development Setup"
Cohesion: 0.33
Nodes (6): 1. Install dependencies, 2. Configure environment files, 3. Start backend, 4. Start frontend, Local Development Setup, Prerequisites

### Community 57 - "Troubleshooting"
Cohesion: 0.33
Nodes (6): Backend cannot connect to MongoDB, CORS errors from frontend, File upload failing, OTP email not sending, Role access issues, Troubleshooting

### Community 58 - "Leave Quota"
Cohesion: 0.40
Nodes (5): `GET /leave-quota/settings`, Leave Quota, `POST /leave-quota/reset-all`, `PUT /leave-quota/update-all`, `PUT /leave-quota/update-user/:userId`

### Community 59 - "Validation and Business Rules"
Cohesion: 0.40
Nodes (5): Approval Rules, Email Rules, Leave Rules, Password Rules, Validation and Business Rules

### Community 60 - "Core Features"
Cohesion: 0.40
Nodes (5): Authentication and Account, Core Features, Employee Features, HoD Features, HR Features

### Community 61 - "Frontend Route Map"
Cohesion: 0.40
Nodes (5): Employee/HoD Shared, Frontend Route Map, HoD Routes, HR Routes, Public Routes

### Community 62 - "jest"
Cohesion: 0.21
Nodes (8): DashboardNotification(), HRLayout(), departmentConfig, HRNavbar(), HoDDashboard(), HRDashboard(), hodDashboardAPI, hrDashboardAPI

### Community 63 - "devDependencies"
Cohesion: 0.27
Nodes (6): HoDLayout(), HoDNavbar(), LeaveDetailsModal(), Status(), HoDDepartmentMembers(), Employees()

### Community 64 - "scripts"
Cohesion: 0.31
Nodes (5): AlternateSelection(), LeaveDocument(), WarningTooltip(), LeaveApplication(), userAPI

### Community 65 - "Conventions"
Cohesion: 0.50
Nodes (4): Conventions, Error Response Pattern, Role Model, Success Response Pattern

### Community 66 - "Business Workflow"
Cohesion: 0.50
Nodes (4): Alternate Workflow, Business Workflow, Holiday Workflow, Leave Application (Employee)

### Community 67 - "Deployment Notes"
Cohesion: 0.50
Nodes (4): Backend, Deployment Notes, Frontend, Production Recommendations

### Community 68 - "Seed and Utility Scripts"
Cohesion: 0.50
Nodes (4): Create HR account, Create test leaves (legacy), Seed and Utility Scripts, Seed departments

### Community 69 - "File Uploads and Cloudinary"
Cohesion: 0.50
Nodes (4): File Uploads and Cloudinary, Limits and Types, Storage, Upload Entry Points

### Community 70 - "Profile.jsx"
Cohesion: 0.31
Nodes (5): AnnualLeave, CasualLeave, EmployeeHoliday(), LeaveData(), vacationAPI

### Community 71 - "Profile.jsx"
Cohesion: 0.36
Nodes (4): ChangePasswordModal(), PersonalInfo(), RoleToggle(), Profile()

### Community 72 - "Tech Stack"
Cohesion: 0.67
Nodes (3): Backend, Frontend, Tech Stack

### Community 73 - "leaveQuotaRoutes.js"
Cohesion: 0.25
Nodes (9): getLeaveQuotaSettings(), resetUsedLeaveQuota(), updateLeaveQuotaForAll(), updateUserLeaveQuota(), User, authMiddleware, express, { 
  getLeaveQuotaSettings, 
  updateLeaveQuotaForAll,
  updateUserLeaveQuota,
  resetUsedLeaveQuota
} (+1 more)

### Community 74 - "cloudinary"
Cohesion: 0.67
Nodes (3): Client (`client/.env`), Environment Variables, Server (`server/.env`)

### Community 80 - "User.js"
Cohesion: 0.20
Nodes (6): User, roleController, User, leaveQuotaSchema, mongoose, userSchema

### Community 84 - "LeaveRequest.js"
Cohesion: 0.40
Nodes (4): bcrypt, LeaveRequest, User, userController

### Community 86 - "leaveRoutes.js"
Cohesion: 0.33
Nodes (5): authMiddleware, express, leaveController, router, upload

### Community 87 - "hrDashboardController.test.js"
Cohesion: 0.40
Nodes (4): Department, hrDashboardController, LeaveRequest, User

### Community 88 - "departmentRoutes.js"
Cohesion: 0.40
Nodes (4): authMiddleware, departmentController, express, router

## Knowledge Gaps
- **435 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+430 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `exportSectionToPDF()` connect `LeaveAnalytics.jsx` to `dependencies`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Why does `jspdf` connect `dependencies` to `LeaveAnalytics.jsx`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _435 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `leaveController.js` be split into smaller, more focused modules?**
  _Cohesion score 0.06090808416389812 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05714285714285714 - nodes in this community are weakly interconnected._
- **Should `vacationRoutes.js` be split into smaller, more focused modules?**
  _Cohesion score 0.05878084179970972 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.0625 - nodes in this community are weakly interconnected._