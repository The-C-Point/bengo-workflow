# Bengo Workflow — Team Guide

Your quick reference for using the app day to day.

---

## Getting in

Open the app in your browser. Click your name on the login screen to get started — no password needed.

**Admins** (Steve and Emma) can see everything. **Everyone else** sees only their own tasks and to-dos.

To switch between people (Admins only), use the **Viewing as** dropdown in the bottom-left sidebar.

---

## Finding your tasks

**My Tasks** (sidebar) — your open episode tasks and to-dos in one place. Click any task row to open the episode it belongs to.

**All Tasks** — every open task across all podcasts. Filter by status, podcast, or role. Switch between Table and Kanban views using the toggle top-right.

Use the **search bar** at the top of My Tasks, All Tasks, or To-Dos to filter as you type — searches across task name, podcast, company, notes, and assignee.

---

## Updating a task

Click the coloured status pill on any task to cycle it forward:
`To Do → In Progress → In Review → Waiting / Blocked → Complete`

Or click the ✏️ icon to open the full edit panel — change assignee, due date, status, and add notes.

**On the Kanban board** — drag a card into a different column to change its status. Or click a card to open a quick-edit popup where you can change the status, due date, or assignee inline. Click 🔍 to open the full task detail.

---

## Oh Crap button

Made a mistake? Hit the **↩ Oh Crap** button in the bottom-left to undo your last action. It disappears after 12 seconds, so be quick!

Works for: status cycles, Kanban quick-edits, and bulk updates.

---

## Episodes

Click a podcast → click an episode to see all its tasks. From here you can:
- Update individual task statuses
- Edit a task (assignee, dates, notes)
- Add an ad hoc task (+ Ad Hoc Task button)
- Notify the team by email (📧 Notify Team button)
- Reschedule the episode (📅 icon on the episodes list) — all task dates shift automatically

---

## Podcasts

**New Podcast** creates the podcast, all episodes, and all tasks in one go. Choose the type carefully — it determines which task template is used.

You can paste a **Google Drive folder link** when creating a podcast (or add it later by editing). A 📁 icon will appear on the podcast card for quick access. A to-do is automatically created to remind the team to set up the folder — it ticks itself off once the link is added.

**+ (batch add)** on a podcast card adds more episodes continuing from where the last one left off.

**Edit (✏️)** on a podcast card lets you update team assignments. If you change who's the Producer or Editor, you'll be asked if you want to reassign all their open tasks across incomplete episodes.

---

## Companies

The **Companies** view (top of the sidebar) groups all podcasts by client company. Active clients appear first. Use the search bar to find a company or podcast quickly.

---

## Bulk updates

On **All Tasks** and **My Tasks**, tick the checkboxes next to tasks to select them. The bulk bar at the top lets you:
- Change status for all selected tasks at once
- Reassign to a different person (Admins only)
- Shift all due dates forward or back by a number of days

Hit **↩ Oh Crap** straight after if you need to undo it.

---

## To-Dos

Freestanding tasks that aren't tied to an episode (chasing a client, admin tasks, etc.). Add via **+ New To-Do**. You can link a to-do to a podcast and episode for context.

Import a batch of to-dos via **↑ Import** using the CSV template.

---

## Gantt

Visual timeline of all episodes and their tasks. Use the filter to focus on one podcast, and zoom in/out with the buttons. Click **Today** to jump to the current date.

---

## Emails

Two ways to send notifications:

- **📧 Notify Team** (on an episode) — emails each person their open tasks for that episode
- **⏰ Send Reminders** (on the dashboard) — emails everyone who has tasks due within 3 days

Emails come from `onboarding@resend.dev` for now — this will switch to `workflow@bengomedia.com` once domain verification is complete.

---

## Podcast types

| Type | When to use |
|---|---|
| Interview | Guest interview episodes |
| Solo | Single host, no guest |
| Panel | Multiple hosts or guests |
| Scripted | Scripted / narrative format |
| Full Production | End-to-end production — 8 phases from Discovery to Launch |

Full Production is the most complex type. Series-level tasks (discovery, pre-production, marketing, sponsors, tech setup) appear on episode 1 only. Per-episode tasks appear on every episode.

---

## Settings (Admins only)

The **Settings** section (bottom of the sidebar) is where admins manage the configuration behind the app.

### Users
Add, edit, or remove team members. Same as the old People screen.

### Roles
Add custom roles to reflect how your organisation is structured — for example, Marketing Assistant, Admin Assistant, Social Media Manager. Custom roles appear everywhere roles are used: the team member form, task template assignment, ad hoc task assignment, and the All Tasks filter.

Built-in roles (Executive Producer, Producer, Editor, Marketer, Accounts, Admin) are locked and can't be removed. Custom roles can be deleted as long as no team members currently have that role.

### Task Templates
Manage the tasks that get auto-generated when a new podcast or episode is created.

- Use the type buttons at the top to switch between podcast types
- **Add Task** — add a single task via the form
- **Export CSV** — download the current task list as a spreadsheet
- **Import CSV** — upload a CSV to replace the entire task list for that type (see format guide inside the tab)
- **Reset to defaults** — appears when you've customised a type; wipes your changes and restores the built-in list
- A **●** next to a type name means it has been customised and is saved to the database

**CSV format** (shown in the in-app guide):

| Column | Required | Notes |
|---|---|---|
| `id` | No | e.g. `TT-0010`. Auto-generated if blank. |
| `task_name` | Yes | Label shown to the team |
| `role` | Yes | Producer, Editor, Executive Producer, Marketer, Accounts |
| `task_order` | Yes | Sort order. Use 10, 20, 30… Lower = first. |
| `days_before_launch` | Yes | Days before launch date. 0 = launch day. |
| `series_level` | Full Production only | `series` (runs once) or `episode` (repeats). Leave blank for other types. |

Always export before importing — import replaces the entire list.

### Podcast Types
View all types, edit descriptions, and add custom types for workflows beyond the built-in five. Click **Edit tasks ▸** on any type to jump straight to its template.

---

## Tips

- The **Overdue** count on the dashboard updates live — aim to keep it at zero.
- Episode titles are editable inline on the episodes list — just click and type.
- The **↩ Oh Crap** button only remembers the *last* action — if you do two things, you can only undo the most recent one.
