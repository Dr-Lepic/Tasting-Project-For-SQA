# Graph Report - .  (2026-07-20)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 560 nodes · 860 edges · 43 communities (39 shown, 4 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 23 edges (avg confidence: 0.54)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3ad74c72`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11
- Community 12
- Community 13
- Community 14
- Community 15
- Community 16
- Community 17
- Community 18
- Community 19
- Community 20
- Community 21
- Community 22
- Community 23
- Community 24
- Community 25
- Community 26
- Community 27
- Community 28
- Community 29
- Community 30
- Community 35

## God Nodes (most connected - your core abstractions)
1. `AuthContext` - 16 edges
2. `userAPI` - 11 edges
3. `leaveAPI` - 9 edges
4. `Layout()` - 7 edges
5. `uploadToCloudinary()` - 7 edges
6. `scripts` - 6 edges
7. `HRLayout()` - 6 edges
8. `exportSectionToPDF()` - 6 edges
9. `uploadAndExtractHolidays()` - 6 edges
10. `HoDLayout()` - 5 edges

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

## Communities (43 total, 4 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (50): App(), AlternateSelection(), AnnualLeave, CasualLeave, ChangePasswordModal(), CollegueInfo(), DashboardNotification(), EmployeeHoliday() (+42 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (26): AlternateRequest, applyLeave(), LeaveHistoryLog, LeaveRequest, respondToAlternateRequest(), {
  sendAlternateRequestEmail,
  sendApplicationStatusEmail,
  sendHoDReviewEmail,
  sendHRReviewEmail
}, updateLeaveStatus(), { uploadToCloudinary } (+18 more)

### Community 2 - "Community 2"
Cohesion: 0.06
Nodes (35): babel-jest, babel-plugin-react-compiler, @babel/preset-env, @babel/preset-react, devDependencies, babel-jest, babel-plugin-react-compiler, @babel/preset-env (+27 more)

### Community 3 - "Community 3"
Cohesion: 0.09
Nodes (28): { extractHolidaysFromText, extractFromTableFormat }, extractTextFromPDF(), multer, { PDFParse }, saveExtractedHolidays(), storage, upload, uploadAndExtractHolidays() (+20 more)

### Community 4 - "Community 4"
Cohesion: 0.06
Nodes (31): axios, chart.js, dependencies, axios, chart.js, html2canvas, jspdf, prop-types (+23 more)

### Community 5 - "Community 5"
Cohesion: 0.07
Nodes (22): getHoDDashboardStats(), LeaveRequest, User, getHRDashboardStats(), LeaveRequest, User, Department, LeaveRequest (+14 more)

### Community 6 - "Community 6"
Cohesion: 0.07
Nodes (29): bcryptjs, cloudinary, cors, dotenv, express, jsonwebtoken, mongoose, multer (+21 more)

### Community 7 - "Community 7"
Cohesion: 0.09
Nodes (22): **/__tests__/**/*.test.js, author, description, devDependencies, jest, supertest, jest, testEnvironment (+14 more)

### Community 8 - "Community 8"
Cohesion: 0.10
Nodes (11): register(), User, userController, LeaveRequest, updateProfile(), { uploadToCloudinary, deleteFromCloudinary }, User, cloudinary (+3 more)

### Community 9 - "Community 9"
Cohesion: 0.12
Nodes (18): { calculateOverlapDays }, Department, getHoDAnalytics(), getHRAnalytics(), LeaveRequest, User, mongoose, vacationSchema (+10 more)

### Community 10 - "Community 10"
Cohesion: 0.25
Nodes (11): AnalyticsHistoryModal(), BarChart(), CollapsibleSection(), StatsCard(), StatusGanttBar(), HoDAnalytics(), HRAnalytics(), analyticsAPI (+3 more)

### Community 11 - "Community 11"
Cohesion: 0.13
Nodes (14): analyticsRoutes, app, authRoutes, connectDB, cors, corsOptions, departmentRoutes, express (+6 more)

### Community 12 - "Community 12"
Cohesion: 0.19
Nodes (11): getLeaveQuotaSettings(), resetUsedLeaveQuota(), updateLeaveQuotaForAll(), updateUserLeaveQuota(), User, leaveQuotaController, User, authMiddleware (+3 more)

### Community 13 - "Community 13"
Cohesion: 0.17
Nodes (7): bcrypt, Department, jwt, OTP, { sendOTPEmail, generateOTP }, { uploadToCloudinary }, User

### Community 14 - "Community 14"
Cohesion: 0.31
Nodes (6): HoDSettings(), HolidayReviewModal(), LeaveQuotaSetter(), PublicHoliday(), SystemSettings(), leaveQuotaAPI

### Community 15 - "Community 15"
Cohesion: 0.25
Nodes (8): forgotPassword(), authController, Department, OTP, { sendOTPEmail, generateOTP }, User, generateOTP(), sendOTPEmail()

### Community 16 - "Community 16"
Cohesion: 0.22
Nodes (5): Department, authMiddleware, departmentController, express, router

### Community 17 - "Community 17"
Cohesion: 0.22
Nodes (6): authController, bcrypt, Department, jwt, OTP, User

### Community 18 - "Community 18"
Cohesion: 0.25
Nodes (6): authController, leaveController, leaveQuotaController, OTP, User, Vacation

### Community 19 - "Community 19"
Cohesion: 0.25
Nodes (5): departmentSchema, mongoose, Department, departments, mongoose

### Community 20 - "Community 20"
Cohesion: 0.29
Nodes (3): User, roleController, User

### Community 21 - "Community 21"
Cohesion: 0.29
Nodes (6): authMiddleware, express, roleController, router, upload, userController

### Community 22 - "Community 22"
Cohesion: 0.29
Nodes (6): app, authRoutes, express, mongoose, request, userRoutes

### Community 23 - "Community 23"
Cohesion: 0.33
Nodes (3): jwt, authMiddleware, jwt

### Community 24 - "Community 24"
Cohesion: 0.33
Nodes (4): multer, path, storage, upload

### Community 25 - "Community 25"
Cohesion: 0.33
Nodes (5): authController, authMiddleware, express, router, upload

### Community 26 - "Community 26"
Cohesion: 0.33
Nodes (5): authMiddleware, express, leaveController, router, upload

### Community 27 - "Community 27"
Cohesion: 0.50
Nodes (3): leaveQuotaSchema, mongoose, userSchema

## Knowledge Gaps
- **239 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+234 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `exportSectionToPDF()` connect `Community 10` to `Community 4`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Why does `jspdf` connect `Community 4` to `Community 10`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _239 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.050917336631622345 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06090808416389812 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.05714285714285714 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.0928030303030303 - nodes in this community are weakly interconnected._