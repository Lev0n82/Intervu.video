# Multi-Environment Deployment & Rollback Guide

This project uses a sophisticated CI/CD pipeline supporting **Promotion Gates**, **Version Tagging**, and **Automated Rollbacks**.

## 1. Environments Schema Map

| Environment | Supabase Schema | Branch Source | Approval Required? |
|-------------|-----------------|---------------|--------------------|
| **Dev/QA**  | `dev_qa`        | `main`        | No (Auto-deploy)   |
| **Staging** | `staging`       | `main`        | Yes (Manual Gate)  |
| **Prod**    | `public`        | `main`        | Yes (Manual Gate)  |

## 2. Promotion Workflow (`pipeline.yml`)

1.  **Commit to Main**: Pushing code to `main` triggers the `Validate & Build` job.
2.  **Auto-Deploy Dev**: If tests pass, the code is automatically deployed to the Dev/QA environment.
3.  **Gate - Promote to Staging**:
    *   Go to GitHub Actions > Pipeline run.
    *   Click "Review deployments" for the `staging` environment.
    *   Approve to promote the build artifact to Staging.
4.  **Gate - Promote to Prod**:
    *   Once validated in Staging, approve the `production` environment deployment to push live.

**Artifact Reuse:** The *exact same build artifact* (verified in Dev) is promoted to Staging and Prod to ensure consistency.

## 3. Rollback Procedures

### Application Rollback (Frontend Code)
To revert the frontend application to a previous state:

1.  Go to **Actions** tab in GitHub.
2.  Select **Rollback Deployment** workflow.
3.  Click **Run workflow**.
4.  **Target Environment**: Select `dev_qa`, `staging`, or `production`.
5.  **Version Tag**: Enter the version tag you want to restore (e.g., `v2024.12.11.45`). You can find these in the "Releases" or "Tags" section of the repo.
6.  **Restore DB**: `false` (usually). Only set to `true` if data corruption occurred.

### Database Rollback & Backups

> **Critical**: Database rollbacks are destructive. Always ensure you have a fresh backup before restoring an old one.

#### Manual Backup (Before Promotion)
Run these commands via Supabase CLI locally before approving a major promotion: