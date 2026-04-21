# Example Domain Expert Prompts

These examples show how a domain expert might interact with the
`write-spa-bff-oidc-spec` skill. Each includes the initial prompt and
likely answers to interview questions, illustrating different application
profiles.

---

## Example 1: TODO App (read-write, simple data, Redis)

### Initial prompt

> I want to build a TODO app. Users should be able to create, complete, and
> delete TODO items. I'd like changes to show up immediately if I have the app
> open in multiple browser tabs.

### Interview answers

| Topic | Answer |
|-------|--------|
| Users and workflows | Single-user TODO lists. No sharing or collaboration between users. |
| Domain model | A TODO has a title, a completed flag, and a creation timestamp. No categories, priorities, or due dates. |
| API capabilities | Create, list, toggle complete, delete. No search, filter, or sort API — the list is small enough to sort client-side. |
| Real-time needs | Yes — WebSocket notifications so open tabs refresh when data changes. |
| Auth | Yes, users must log in. Each user sees only their own TODOs. |
| Frontend | Vanilla JS, no framework. The domain is simple and I want to understand how SPAs work without abstraction. |
| Backend language | Go. |
| API data persistence | Redis. The data model is flat key-value, no relational queries needed. Data loss on restart is acceptable for a learning project. |

### Resulting spec profile

Read-write app, authenticated, WebSocket real-time, Redis for both session and
API data, single Go binary, vanilla JS frontend.

---

## Example 2: Operations Dashboard (read-only, external data, no API persistence)

### Initial prompt

> I have two internal services that expose JSON metrics endpoints. I want a
> dashboard that shows combined data from both services, refreshed every 30
> seconds. Only operations team members should access it.

### Interview answers

| Topic | Answer |
|-------|--------|
| Users and workflows | Ops team views a dashboard. No data entry, no editing. |
| Domain model | No domain entities owned by this app. Data comes from external service-x (deployment status) and service-y (health metrics). |
| API capabilities | Read-only. One endpoint that returns merged/transformed data from the two upstream services. |
| Real-time needs | Polling every 30 seconds is fine. No WebSocket needed. |
| Auth | Yes, restricted to ops team members. |
| Frontend | A lightweight framework is fine — recommend one. (Skill recommends vanilla JS or Alpine.js given the read-only, single-view nature.) |
| Backend language | Go. Good fit for concurrent upstream fetches with goroutines. |
| API data persistence | None. The backend fetches upstream data on demand (or caches briefly in-memory). No database needed. |

### Resulting spec profile

Read-only app, authenticated, polling-based refresh, no API persistence, backend
acts as aggregation proxy, single Go binary, minimal frontend.

---

## Example 3: Equipment Booking System (read-write, relational data, PostgreSQL)

### Initial prompt

> Our lab has shared equipment — microscopes, spectrometers, centrifuges. People
> currently book time slots via a shared spreadsheet and it's chaos. I want a
> booking app where users can see equipment availability and reserve time slots.

### Interview answers

| Topic | Answer |
|-------|--------|
| Users and workflows | Lab members browse equipment, view weekly availability, and book/cancel time slots. No approval workflow — first come, first served. |
| Domain model | Equipment (name, type, location), TimeSlot (equipment ref, user ref, start time, end time, status). Equipment has many time slots. Need to prevent overlapping bookings for the same equipment. |
| API capabilities | CRUD for bookings. List equipment. Query available slots by equipment and date range. Overlap validation on create. |
| Real-time needs | Not critical. A page refresh on navigation is acceptable. |
| Auth | Yes. All lab members can book. No admin role for now. |
| Frontend | Something with decent form handling and date picking. (Skill recommends a framework like Vue or React given the interactive booking UI.) |
| Backend language | Go or Python. (Skill recommends Go for consistency with the BFF pattern and strong concurrency support for overlap checks under load.) |
| API data persistence | PostgreSQL. The data model is relational (equipment → time slots), needs range queries for availability, and overlap prevention requires transactions. Data must survive restarts. |

### Resulting spec profile

Read-write app, authenticated, no real-time, PostgreSQL for API data,
relational domain model with constraint enforcement, single Go binary,
framework-based frontend.

---

## Example 4: Task Management App (read-write, hierarchical data, continuous metrics, SSE)

### Initial prompt

> I want to build a task management app where work is tracked through continuous
> progress metrics rather than discrete states. Users periodically update
> progress (0-100%) and completion likelihood (0-100%) on tasks. These metrics
> aggregate upward through a hierarchy, giving visibility at every level.

### Interview answers

| Topic | Answer |
|-------|--------|
| Users and workflows | All logged-in users are equal — no roles or permissions beyond authentication. Any user can create, edit, and delete any entity. |
| Domain model | Four-level hierarchy: Project → Sprint → Epic → Task. Sprint has startDate and endDate (endDate must be after startDate). Task has title, progress (0–100%), completionLikelihood (0–100%), and position (manual order within an epic). Metrics aggregate upward: epic averages from tasks, sprint from epics, project from sprints. Deleting a parent cascades to all children. |
| API capabilities | Full CRUD at every level. Tasks within an epic can be manually reordered (persisted position). No search or filter API. |
| Real-time needs | Yes — changes should appear immediately across open browser tabs. SSE preferred (notifications are thin; clients re-fetch on event). |
| Auth | Yes, login required. No user-scoped ownership — all users share all data. |
| Frontend | React with TypeScript. The hierarchical UI and inline editing benefit from a component model. |
| Backend language | Go. |
| API data persistence | In-memory. This is a learning and reference project; durability is not required. |

### Resulting spec profile

Read-write app, authenticated but no per-user ownership (shared data model),
SSE real-time change notifications, in-memory API data store, four-level
hierarchical domain with upward metric aggregation, single Go binary,
React/TypeScript frontend.
