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

Follow these steps to get Intervu.video up and running on your local machine.

### Prerequisites:
*   **Node.js:** 18.x or higher (LTS recommended)
*   **npm:** 9.x or higher (comes with Node.js)
*   **Git:** For cloning the repository
*   **Supabase Account:** Free tier is sufficient for development
*   **Google OAuth Credentials:** For social login (optional, but recommended for full functionality)

### Step-by-step Setup:

1.  **Clone the repository:**
