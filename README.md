# TaskFlow — Team Task Management Platform

> A full-featured, professional MERN Stack task and project management platform built for resume showcase, portfolio presentation, and technical interview readiness.

---

## 🌟 Highlights

- **Complete MERN Architecture:** MongoDB, Express.js, React, Node.js.
- **Fresher-Friendly & Explainable:** Clean separation of concerns without unnecessary microservices, Redis, or complicated abstractions.
- **Stateless JWT Authentication:** Secure registration and login with `bcryptjs` password hashing and protected API middleware.
- **Relational Data Modeling:** Mongoose models with references (`ref: 'User'`, `ref: 'Project'`) and `.populate()` queries.
- **Dynamic Real-Time Dashboard:** Aggregated project statistics, completion percentages, and recent task lists calculated on the backend.
- **Full Task Lifecycle:** Create, edit, delete, assign to team members, filter by status/priority/project/assignee, search by title, and toggle statuses in one click.
- **One-Command Database Seeding:** Seed realistic sample users, projects, and tasks instantly with `npm run seed`.
- **Clean Full-Stack Architecture:** Demonstrates industry-standard separation of concerns, relational database modeling, and modern React patterns.

---

## 🛠️ Technology Stack

### Frontend
- **React.js (v18)** — Modern declarative UI library.
- **Vite** — High-performance build tool and dev server.
- **React Router (v6)** — Client-side routing with `ProtectedRoute` guards.
- **Axios** — HTTP client with request/response interceptors for automatic JWT attachment.
- **Lucide React** — Lightweight, clean UI icons.
- **Vanilla CSS (Design System)** — CSS custom properties, responsive layout, modal dialogs, badges, and cards without heavy CSS framework bloat.

### Backend
- **Node.js** — Asynchronous event-driven JavaScript runtime.
- **Express.js** — Fast, unopinionated REST API framework.
- **MongoDB & Mongoose** — Document database with schema enforcement, pre-save hooks, and population.
- **JSON Web Tokens (`jsonwebtoken`)** — Stateless authentication mechanism.
- **`bcryptjs`** — Salted password hashing algorithm.
- **CORS & Dotenv** — Cross-Origin Resource Sharing and environment configuration.

---

## 📂 Project Structure Explained

```text
TaskFlow/
│
├── client/                     # Frontend React (Vite) Application
│   ├── public/                 # Static public files (logos, favicons)
│   └── src/
│       ├── assets/             # Brand graphics and images
│       ├── components/         # Reusable UI widgets (Navbar, Sidebar, Modal, TaskCard, Badges, etc.)
│       ├── context/            # React Context (AuthContext for user state & session management)
│       ├── hooks/              # Custom hooks (useAuth for simple context consumption)
│       ├── layouts/            # Master layout wrapper (MainLayout with Sidebar + Navbar)
│       ├── pages/              # Routed pages (Dashboard, Projects, ProjectDetail, Tasks, Profile, Login, Register)
│       ├── services/           # HTTP API client and endpoints (api.js, authService, taskService, etc.)
│       ├── utils/              # Helper utilities (formatDate, constants, options)
│       ├── App.jsx             # Route definitions and route guards
│       ├── main.jsx            # React root DOM mount point
│       └── index.css           # Global stylesheet and CSS design tokens
│
├── server/                     # Backend Node.js & Express API
│   ├── config/                 # Configuration (MongoDB connection in db.js)
│   ├── controllers/            # HTTP request/response handlers
│   ├── middleware/             # Express middlewares (JWT auth guard, centralized error handling)
│   ├── models/                 # Mongoose schemas (User, Project, Task)
│   ├── routes/                 # REST API endpoints (/api/auth, /api/projects, /api/tasks, /api/users)
│   ├── services/               # Business logic helpers (clean controller-service separation)
│   ├── utils/                  # Token generator (generateToken.js)
│   ├── app.js                  # Express application setup & middleware pipeline
│   ├── server.js               # HTTP listener and database bootloader
│   └── seed.js                 # Realistic database sample data seeder
│
├── .env.example                # Sample environment variables
├── .gitignore                  # Git exclusions for dependencies and sensitive files
├── package.json                # Root orchestration scripts (runs client & server concurrently)
└── README.md                   # Project documentation
```

### Why Every Directory Exists:
- **`config/`**: Separates database connectivity from server startup for easier configuration.
- **`controllers/`**: Extracts HTTP logic away from routes, keeping route files clean and readable.
- **`services/`**: Houses business queries and data transformations so controllers remain thin and focused.
- **`middleware/`**: Provides reusable request interceptors for security (`authMiddleware`) and error formatting (`errorMiddleware`).
- **`models/`**: Defines data structures, schema validations, and password hashing hooks in one central place.
- **`client/src/services/`**: Encapsulates all backend HTTP calls outside React components, preventing code duplication.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **MongoDB** running locally on port `27017` (or a free MongoDB Atlas connection string)

### 1. Clone & Install Dependencies

You can install all dependencies for both the client and server in one command:

```bash
cd TaskFlow
npm run install:all
```

Or install them manually:
```bash
# In server directory
cd server
npm install

# In client directory
cd ../client
npm install
```

### 2. Configure Environment Variables

The server includes a ready-to-use `.env` file. If needed, customize `server/.env`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=super_secret_taskflow_jwt_key_fresher_friendly_2025
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

### 3. Seed Sample Data (Optional, Recommended for Demos!)

Populate the database with demo users, projects, and tasks with 1 command:

```bash
npm run seed
```

This generates 3 sample team members with password `password123`:
- **Alex Morgan (Admin):** `alex@example.com`
- **Sarah Chen (Member):** `sarah@example.com`
- **Rohan Sharma (Member):** `rohan@example.com`

### 4. Run the Application

Start both the backend server and frontend client concurrently from the root directory:

```bash
npm run dev
```

- **Frontend Client:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5000](http://localhost:5000)

*(You can also run them independently via `npm run server` and `npm run client`).*

---

## 📡 API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new user and receive JWT token |
| `POST` | `/api/auth/login` | Public | Login with email & password and receive JWT token |
| `GET` | `/api/auth/me` | Private | Retrieve authenticated user profile |

### Projects (`/api/projects`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/projects` | Private | List all projects the user is creator or member of |
| `POST` | `/api/projects` | Private | Create a new project with team members |
| `GET` | `/api/projects/:id` | Private | Get project details along with task statistics |
| `PUT` | `/api/projects/:id` | Private | Update project name, description, or members |
| `DELETE` | `/api/projects/:id` | Private | Delete project and cascade-delete all its tasks |

### Tasks (`/api/tasks`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tasks/dashboard/stats` | Private | Aggregated stats for dashboard & recent 5 tasks |
| `GET` | `/api/tasks` | Private | Filter/search tasks (`?status=&priority=&project=&assignedTo=&search=`) |
| `POST` | `/api/tasks` | Private | Create a new task |
| `GET` | `/api/tasks/:id` | Private | Get single task details |
| `PUT` | `/api/tasks/:id` | Private | Update full task details |
| `PATCH` | `/api/tasks/:id/status` | Private | Fast status update (`Todo`, `In Progress`, `Completed`) |
| `DELETE` | `/api/tasks/:id` | Private | Delete a task |

### Users (`/api/users`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users` | Private | Get all registered users for team member selection |
| `PUT` | `/api/users/profile` | Private | Update current user's name or password |

---

## 🏛️ Core Architecture Principles

1. **Separation of Concerns:** Business logic, HTTP routing, database queries, and UI components are cleanly isolated.
2. **Normalized Data Modeling:** Mongoose references (`ObjectId`) prevent document bloat and ensure consistency when user profiles update.
3. **Stateless Authentication:** JSON Web Tokens allow the backend to authenticate requests without storing in-memory server sessions.
4. **Client Service Abstraction:** Centralized Axios services decouple API endpoint routes and HTTP headers from React presentation components.

---

## 📄 License
This project is licensed under the MIT License. Feel free to use it for your personal portfolio and interview demonstrations!
