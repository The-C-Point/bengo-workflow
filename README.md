# Bengo Workflow App

Internal workflow tool for **Bengo Media** (Dream Together Limited). Manages podcasts, episodes, and tasks for the production team. Replaced Monday.com and a failed Google AppSheet attempt.

**Hosted on GitHub Pages. Single HTML file. Supabase backend.**

---

## What's built

### Core features
- **Podcasts** — create and manage podcasts with type, team, season, frequency, and episode count
- **Episodes** — auto-generated from podcast setup; can add individually or in batches
- **Tasks** — auto-generated from templates per podcast type; assignable, status-trackable, with due dates counted back from launch
- **Task templates** — Interview, Solo, Panel, Scripted, Full Production (see below)
- **Episode rescheduling** — shift launch date and all task due dates cascade automatically
- **All Tasks view** — table and Kanban views, filterable by status / podcast / role; bulk status, assignee, and date-shift updates
- **My Tasks** — per-person view of open episode tasks and to-dos
- **To-Do** — freestanding tasks (not tied to an episode); table and Kanban views; CSV import
- **Gantt chart** — canvas-based, zoomable, grouped by podcast; shows episode bars and task dots
- **People** — add/edit team members; roles drive task assignment
- **Dashboard** — overdue count, overall completion %, team capacity, podcast progress, open task list
- **Email notifications** — via Resend; episode team notify and urgent (3-day) reminders

### Podcast types and task templates

| Type | Template tasks | Notes |
|---|---|---|
| Interview | 15 tasks | Standard interview workflow |
| Solo | 15 tasks | Single host, no guest booking |
| Panel | 15 tasks | Multi-guest variant |
| Scripted | 15 tasks | Adds script finalisation step |
| Full Production | 22 tasks across 8 phases | Series tasks on episode 1 only; per-episode tasks on all — **timings to be confirmed with Steve** |

**Full Production phases:**
1. Discovery & Development (series setup)
2. Pre-Production (series setup)
3. Production (per episode)
4. Post Production (per episode)
5. Marketing & PR Prep (series setup)
6. Sponsors (series setup)
7. Tech Set-Up (series setup)
8. Launch & Promotion (per episode)

Series-level tasks (phases 1, 2, 5, 6, 7) are added to episode 1 only and count back from the series launch date. Per-episode tasks (phases 3, 4, 8) appear on every episode.

---

## Tech stack

| Tool | Purpose |
|---|---|
| HTML / CSS / JS | Single-file app — no frameworks |
| Supabase | Postgres database, REST API |
| GitHub Pages | Hosting |
| Resend | Email notifications |

API keys are in the HTML file — acceptable for internal use. Will move to intranet eventually.

---

## Deployment

1. Edit `bengo-workflow.html`
2. Commit and push to GitHub
3. GitHub Pages serves it automatically
4. To force a cache refresh, append `?v=N` to the URL (increment N each release)

---

## Database tables

`people` · `podcasts` · `episodes` · `tasks` · `task_templates` · `todos` · `settings`

See CLAUDE.md for full schema.

---

## Team

| Name | Role | In app? |
|---|---|---|
| Steve Austins | Executive Producer | ✅ |
| Chloe Monaghan | Producer | ✅ |
| Adam Whalley | Editor | ✅ |
| Emma Campbell | Producer / Admin | ✅ |
| Naomi Cutler | Producer | ❌ Pending |
| Vicki Blight | Radio Team Lead | ❌ Pending (role TBC) |
| Daf Matheson | Asst Producer, Radio | ❌ Pending |
| Lynsey Summers | TBC | ❌ Pending |

---

## Pending / in progress

- **Full Production task timings** — template built, day counts are estimates. Steve to confirm before using in production.
- **Resend domain verification** — currently sending from `onboarding@resend.dev`. Switch to `workflow@bengomedia.com` once domain verified in Resend dashboard. One line change in the HTML (`FROM_EMAIL`).
- **Pending team members** — Naomi, Vicki, Daf, Lynsey not yet added. Add via People screen once roles confirmed.
- **Audiobook section** — new section to be scoped and built (up next).
- **Intranet migration** — eventual move from GitHub Pages to Bengo intranet. Resolves API key exposure concern.

---

## Session log

### 23–24 April 2026
- Added **Full Production** podcast type — template (22 tasks, 8 phases), series/episode task logic, dropdown
- Added **Marketer** role to Person modal, All Tasks filter, and Ad Hoc Task modal
- Implemented **Todo Kanban view** (`setTodoView`, `renderTodoKanban`) — was wired in HTML but functions were missing
- Fixed **Kanban complete-column toggle** — inline style was overriding CSS with wrong grid column counts
- Fixed **todo episode dropdown** — podcast select now has `onchange` to populate episodes on new to-do
- Removed dead `checkApColumn` function
- Fixed **CSV import** — now handles quoted fields with commas using a proper parser
- Fixed **Gantt chart crash** — podcast-type label rows accessed `r.task` which was undefined; added explicit `r.type==='podcast'` branch
- Fixed **Kanban blank screen** — card clicks now open a quick-edit popup (`openKpop`) instead of navigating to episode-tasks; supports inline status/date/assignee edit and 🔍 to open full task
- Added **login screen** — click your name card to log in; `localStorage` persistence; Admins (Steve, Emma) see everything; Users see only their own tasks and are locked to their own view
- Added **Company view** — top-level nav groups podcasts by company, active companies first
- Added **Sticky bulk update bar** — `position:sticky` bar on All Tasks and My Tasks views; bulk status/assignee/date-shift with confirm
- Added **Bulk update on My Tasks** — checkboxes, select-all, and bulk bar on episode tasks section
- Added **Per-view search** — filter-as-you-type on All Tasks, My Tasks, To-Dos, and Companies; searches name, podcast, company, notes, assignee
- Added **Undo (Oh Crap button)** — fixed bottom-left button; undoes last status cycle, bulk update, or Kanban quick-edit; auto-hides after 12 seconds
- Added **Google Drive folder link** — URL field on podcast modal; 📁 icon on podcast cards; auto-creates "Set up Google Drive production folder" to-do on new podcast (pre-completed if URL provided); auto-completes that to-do when URL is added on edit

### 29 April 2026
- Added **Kanban drag and drop** — drag cards between columns on both Tasks and To-Dos kanban boards; saves to Supabase on drop; undo supported; uses `addEventListener`-based approach for reliability
- Added **Kanban horizontal scroll** — columns have a 220px minimum width; boards scroll horizontally on smaller screens
- Added **Collapse Complete column** on To-Dos kanban — matches existing behaviour on Tasks kanban; starts collapsed, click strip to expand, ✕ to collapse
- Set up local preview server via `npx serve` (`.claude/launch.json`)
