# Intervu.video: AI-Powered Video Interview & Survey Platform

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Frontend Stack](https://img.shields.io/badge/frontend-React%20%7C%20TailwindCSS%20%7C%20FramerMotion-blueviolet)
![Backend Stack](https://img.shields.io/badge/backend-Supabase%20%7C%20PostgreSQL-green)
![Version](https://img.shields.io/badge/version-26.1.11_2.41-orange)

## 1. Platform Introduction

Intervu.video is an AI-powered video interview and survey platform that enables organizations to conduct asynchronous video interviews, collect video feedback, and manage candidate assessments at scale.

**Key Features:**
*   **Asynchronous Video Interviews:** Candidates record video responses to pre-set questions at their convenience.
*   **AI-Generated Interview Questions:** Leverage AI to generate relevant and insightful interview questions.
*   **Video Surveys:** Create dynamic video surveys for market research, customer feedback, and more.
*   **Candidate Management:** Track and manage candidate progress through the hiring pipeline.
*   **Team Collaboration:** Facilitate collaboration among hiring teams for reviewing submissions.
*   **Real-time Submission Tracking:** Monitor survey and interview submissions in real-time.
*   **Video Generation with Luma and Fall.ai:** Integrate advanced AI for generating video content, including persona-based video responses.
*   **Persona-Based Video Responses:** Customize and generate video responses with specific personas.

**Target Users:**
HR teams, recruiters, hiring managers, organizations conducting remote hiring, market research teams, customer feedback collection.

**Value Proposition:**
"Streamline hiring with AI-powered video interviews, reduce time-to-hire, improve candidate experience, and make data-driven hiring decisions with comprehensive video analytics."

---

## 2. Architecture Overview

Intervu.video is built as a modern web application, leveraging a robust and scalable architecture.

**Frontend Stack:**
*   **React 18.2.0:** A declarative, component-based JavaScript library for building user interfaces.
*   **React Router 6.16.0:** Declarative routing for React applications.
*   **TailwindCSS 3.3.2:** A utility-first CSS framework for rapid UI development.
*   **shadcn/ui components:** Beautifully designed, accessible, and customizable UI components built with Radix UI and Tailwind CSS.
*   **Framer Motion 10.16.4:** A production-ready motion library for React, enabling fluid animations and transitions.
*   **Lucide React 0.292.0:** A collection of beautiful and customizable open-source icons.
*   **React Helmet for SEO:** Manages document head tags for SEO.

**Backend/Database:**
*   **Supabase (PostgreSQL):** An open-source Firebase alternative providing a powerful PostgreSQL database, authentication, and real-time capabilities.
*   **Supabase Edge Functions (Deno):** Server-side logic deployed globally at the edge, written in TypeScript/JavaScript.
*   **Real-time subscriptions via Supabase Realtime:** Instant updates for data changes.

**Video Generation:**
*   **Luma AI API:** For AI-powered video generation.
*   **Fall.ai API:** An alternative solution for video generation.

**Authentication:**
*   **Supabase Auth:** Secure user authentication system.
*   **Google OAuth:** Seamless social login integration.
*   **Email/Password Authentication:** Standard user login.
*   **Device Fingerprinting:** Enhanced security for user sessions.

**Key Integrations:**
*   **Resend:** For reliable email delivery of invitations and notifications.
*   **Supabase Storage:** Scalable object storage for all video uploads (interview responses, survey videos, generated content).

**High-level Flow:**
Users authenticate → Create interviews/surveys → Generate questions with AI → Candidates submit video responses → Review and analyze submissions.

---

## 3. Installation Instructions

### Prerequisites

* Node.js (v16 or higher)
* npm (v8 or higher)
* Git
* A code editor (VS Code recommended)
* Modern web browser


### Step-by-Step Setup


* Clone the Repository

git clone https://github.com/your-username/intervu.video.git
   cd intervu.video
   

### Install Dependencies

   npm install
   

### Create Environment Variables

Create a .env file in the root directory

Add all required API keys and configuration

### Configure Supabase

* Set up Supabase project

* Add connection details to .env

* Run database migrations



### Set Up API Keys

* Google OAuth credentials

* Luma API key

* Fall.ai API key


### Start Development Server

  npm run dev
   

### Access Application

Open http://localhost:5173 in your browser


### Environment Variables Needed


* VITE_SUPABASE_URL
* VITE_SUPABASE_ANON_KEY
* VITE_GOOGLE_CLIENT_ID
* VITE_LUMA_API_KEY
* VITE_FALL_AI_API_KEY


### Prerequisites:
*   **Node.js:** 18.x or higher (LTS recommended)
*   **npm:** 9.x or higher (comes with Node.js)
*   **Git:** For cloning the repository
*   **Supabase Account:** Free tier is sufficient for development
*   **Google OAuth Credentials:** For social login (optional, but recommended for full functionality)



Virtual Interview & Survey AI Platform (Condensed Specs)

# Technical Specification Document: Intervu.video Platform

## 1. Business Requirements and Overview

### 1.1 Overview
Intervu.video is a secure, AI-powered web platform designed to streamline the recruitment process through asynchronous video interviews and advanced surveys. The platform serves two primary user groups: "Hiring Managers" (organizations) who create and manage assessments, and "Candidates/Respondents" who complete them. The system aims to reduce time-to-hire, minimize bias through standardized questioning, and provide deeper insights via AI analysis.

### 1.2 Key Business Goals
- **Efficiency:** Automate scheduling, screening, and initial data collection.
- **Fairness:** Standardize interview processes using templates and consistent evaluation criteria.
- **Insights:** Leverage AI to analyze candidate responses (transcription, sentiment, behavioral indicators).
- **Flexibility:** Enable asynchronous participation for global candidate pools.
- **Compliance:** Ensure data security and role-based access control (RBAC) within organizations.

## 2. Implemented Features

### 2.1 Authentication & Onboarding
- **Multi-method Login:** Email/Password, Google OAuth, and Phone (SMS) authentication.
- **Role-Based Onboarding:** Distinct flows for "Hiring" (Organization creation) and "Candidate" (Profile setup) users.
- **Email Verification:** Automated verification links sent via Resend integration.
- **Organization Setup:** Automatic creation of organization tenants for new hiring users.

### 2.2 Dashboard & Navigation
- **Role-Aware Dashboards:** Customized views for Candidates vs. Hiring Managers.
- **Quick Actions:** Shortcuts for creating interviews, surveys, and inviting team members.
- **Persistent Layout:** Sidebar navigation with organization switcher and user profile management.

### 2.3 Interview Module
- **Template Management:** Create, edit, and reuse interview templates with specific questions.
- **Video Question Builder:** Record or upload video prompts for candidates; utilize AI personas for question generation.
- **Asynchronous Interviewing:** Candidates record video responses to pre-set questions.
- **Device Diagnostics:** Pre-interview check for camera, microphone, and speaker functionality.
- **Submission Management:** Track candidate status (invited, started, completed) and review submissions.

### 2.4 Survey Module
- **Survey Types:** Support for text-based and video-based surveys.
- **Question Types:** Multiple choice, Text, Rating, Likert Scale, Yes/No.
- **Distribution:** Share surveys via public links or direct email invitations.
- **Results Analysis:** Visual dashboards (Bar/Pie charts) for aggregate data and detailed text response views.

### 2.5 Team Management
- **Member Directory:** View and manage team members within an organization.
- **Role Assignment:** Assign roles (Admin, Manager, Interviewer, Coordinator) to control access.
- **Invitation System:** Secure email invitations for adding new members.

### 2.6 AI & Video Capabilities
- **Video Recorder:** Custom browser-based recorder with device selection, visual effects (brightness/contrast), and upload handling.
- **AI Question Generation:** Integration with LLMs to generate interview questions based on job descriptions/personas.
- **Video Generation Queue:** Background processing system for generating AI avatar videos (infrastructure ready).

## 3. System Architecture

### 3.1 Tech Stack
- **Frontend:** React 18 (Vite), TailwindCSS, Framer Motion, shadcn/ui (Radix Primitives).
- **Backend (BaaS):** Supabase (PostgreSQL).
- **Authentication:** Supabase Auth (GoTrue).
- **Storage:** Supabase Storage (S3-compatible) for video/image assets.
- **Edge Computing:** Supabase Edge Functions (Deno) for server-side logic and email delivery.
- **Email Service:** Resend API.

### 3.2 Design Patterns
- **Single Page Application (SPA):** Client-side routing via React Router.
- **Context API:** Global state management for Authentication (`SupabaseAuthContext`), Theme (`ThemeContext`), and Demo Mode (`DemoContext`).
- **Row Level Security (RLS):** Database-level security policies ensuring strict data isolation between organizations and users.
- **Remote Procedure Calls (RPC):** Encapsulated complex database transactions (e.g., inviting users, scheduling interviews) within PostgreSQL functions for atomicity and security.
- **Component-Based UI:** Atomic design principles using reusable UI components (Buttons, Cards, Dialogs).

## 4. Components and Functions

### 4.1 Key Context Providers
- **`SupabaseAuthContext`**: Manages user sessions, profile fetching, organization switching, and auth state listeners.
- **`ThemeContext`**: Handles light/dark mode toggling.
- **`DemoContext`**: Manages demo mode state to allow unauthenticated exploration.

### 4.2 Core Components
- **`VideoRecorder`**: Complex component handling `MediaRecorder` API, stream management, audio visualization, and blob uploading.
- **`SurveyQuestionBuilder`**: Interactive UI for defining survey questions and options.
- **`VideoGenerationQueue`**: Polling component to display status of background AI video generation tasks.
- **`DeviceCheck`**: Diagnostic tool for validating user hardware permissions.

### 4.3 Key Pages
- **`DashboardPage`**: Central hub aggregating stats and quick links.
- **`InterviewSetupPage` / `EditTemplatePage`**: Interfaces for constructing interview logic.
- **`CandidateInterviewPage`**: The candidate-facing experience for taking an interview.
- **`SurveyResultsPage`**: Analytics dashboard using Recharts to visualize survey data.
- **`TeamManagementPage`**: Admin interface for user and role management.

## 5. Database Schema and Data Models

### 5.1 Core Identity
- **`users`**: Extends Supabase `auth.users`. Stores profile data (name, avatar, preferences).
- **`organizations`**: Tenants. Contains name, owner, and branding settings.
- **`team_members`**: Link table between `users` and `organizations` with `role_id`.
- **`roles`**: Definitions of permissions (Admin, Manager, Interviewer, Coordinator).

### 5.2 Interviews
- **`interview_templates`**: Blueprints for interviews (name, description, intro).
- **`template_questions`**: Individual questions linked to templates.
- **`interviews`**: Instances of a template assigned to a context (e.g., specific job opening).
- **`interview_submissions`**: Tracks a candidate's progress through an interview.
- **`submission_answers`** (implied/linked): Stores video urls and text responses per question.

### 5.3 Surveys
- **`surveys`**: Survey metadata (title, type, status).
- **`survey_questions`**: Questions for surveys including type and options JSON.
- **`survey_submissions`**: Records of a completed survey by a respondent.
- **`survey_answers`**: Individual answers linked to submissions.
- **`survey_invitations`**: Tracks email invites sent and their status (sent, opened, clicked).

### 5.4 AI & System
- **`video_generation_queue`**: Job queue for async AI video processing.
- **`personas`**: AI characters used for asking questions.
- **`ai_model_configs`**: Organization-specific AI settings.

## 6. API Endpoints and Edge Functions

### 6.1 Database Functions (RPCs)
- `handle_new_user_onboarding`: Transactional creation of user profile and organization.
- `invite_user_to_team`: Handles logic for checking existing users vs new users and creating invitations.
- `accept_team_invitation`: Verifies token and adds user to `team_members`.
- `schedule_interview_and_generate_submission`: Creates interview record and submission token atomically.
- `get_user_profile`: Fetches complex nested profile data including team memberships.

### 6.2 Edge Functions
- **`send-welcome-email`**: Triggered on signup. Uses Resend to email new users.
- **`send-verification-email`**: Custom logic to send Supabase verification links via Resend for better deliverability.
- **`send-invitation-email`**: Sends formatted team invite links.
- **`send-survey-invite`**: Bulk sending of survey invitations.
- **`generate-interview-questions`**: Interfaces with OpenAI to generate questions based on prompts.

## 7. User Workflows

### 7.1 Hiring Manager Workflow
1.  **Signup:** Register -> Create Organization -> Dashboard.
2.  **Team Setup:** Invite colleagues via email -> Colleagues accept -> Assign Roles.
3.  **Template Creation:** Create Interview Template -> Add Questions (Record video or use AI) -> Save.
4.  **Scheduling:** Select Template -> Enter Candidate Details -> Send Invite.
5.  **Review:** Receive notification of completion -> View Submission -> Watch Videos -> Score.

### 7.2 Candidate Workflow
1.  **Invitation:** Receive email with unique token link.
2.  **Landing:** View Interview Welcome Page -> Consent to privacy policy.
3.  **Diagnostics:** Complete Camera/Mic check.
4.  **Interview:** Watch intro -> Watch Question 1 -> Record Answer -> Review/Retake -> Submit -> Repeat for all questions.
5.  **Completion:** See success message.

## 8. Interface Specifications

### 8.1 Candidate Recorder Interface
- **Preview Area:** Large central video feed (mirrored).
- **Controls:** Prominent "Record", "Stop", "Play" buttons.
- **Feedback:** Audio visualizer bar, countdown timer, recording status indicator (Red dot).
- **Accessibility:** Keyboard navigable, ARIA labels on all controls.

### 8.2 Survey Builder Interface
- **Drag-and-Drop:** (Planned) Reordering of questions.
- **Dynamic Forms:** Question type selector changes input fields (e.g., adding options for Multiple Choice).
- **Preview:** Live rendering of how the question looks.

## 9. Integration Points

### 9.1 Supabase
- **Auth:** Manages JWTs, sessions, and row-level security.
- **Database:** Primary relational data store.
- **Realtime:** Subscriptions used in `InterviewManagementPage` for live status updates.
- **Storage:** Buckets (`template-videos`, `user-profile-videos`) for hosting binary media.

### 9.2 Resend
- **Transactional Email:** Used exclusively for reliable delivery of system emails (Welcome, Verify, Invite). configured via Edge Functions.

## 10. Acceptance Criteria (for Testing)

### 10.1 Feature: User Registration
- **AC1:** User can sign up with valid email/password.
- **AC2:** System prevents duplicate email registration.
- **AC3:** User is redirected to dashboard upon successful creation.
- **AC4:** Welcome email is received within 2 minutes.
- **AC5:** User profile is created in `public.users` table.

### 10.2 Feature: Create Interview Template
- **AC1:** Admin/Manager can access "New Template" page.
- **AC2:** Template requires a Title.
- **AC3:** User can add multiple questions.
- **AC4:** Each question must have text content.
- **AC5:** Saving as "Active" validates that all required fields are present.
- **AC6:** Template persists to database with correct `organization_id`.

### 10.3 Feature: Candidate Video Submission
- **AC1:** Candidate cannot proceed without consent.
- **AC2:** Candidate cannot record without camera permission.
- **AC3:** Recorded video plays back successfully in review step.
- **AC4:** "Submit" uploads video to Supabase Storage.
- **AC5:** Submission status updates to "completed" only after all questions answered.

### 10.4 Feature: Invite Team Member
- **AC1:** Admin can input email and select role.
- **AC2:** System checks if user is already in team.
- **AC3:** Unique token is generated in `team_invitations` table.
- **AC4:** Invitee receives email with link containing token.
- **AC5:** Clicking link adds user to `team_members` if authenticated.

Risks: proctoring accuracy, BYOM security, analytics scalability, fairness complexity.

Mitigation: Phased deployments, secure AI execution, scalable infra, fairness testing.
