<div align="center">

<img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" />
<img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript" />
<img src="https://img.shields.io/badge/SQLite-Database-green?style=for-the-badge&logo=sqlite" />
<img src="https://img.shields.io/badge/NextAuth-Auth-orange?style=for-the-badge" />
<img src="https://img.shields.io/badge/Tailwind_CSS-3-38bdf8?style=for-the-badge&logo=tailwindcss" />

# ⚙️ C2A Engine — Config-to-App Generator

**The no-code app generator powered by JSON.**  
Define your entities, fields, and theme in a single config file → get a full-stack web app with Auth, Database, REST APIs, and UI — instantly.

[🚀 Live Demo](#) · [📖 Docs](#how-it-works) · [⭐ Star this repo](#)

</div>

---

## 🧠 What Is C2A Engine?

C2A Engine is a **dynamic full-stack app generator** that reads a `app_config.json` file and auto-generates:

- 🗄️ **SQLite Database tables** — created and evolved on the fly
- 🔌 **REST CRUD APIs** — generic routes for every entity
- 🖥️ **React UI** — forms, tables, modals rendered dynamically
- 🔐 **Authentication** — session-based auth via NextAuth
- 🌍 **i18n** — multi-language support (EN, HI, BN, ES and more)
- 🔧 **Visual App Builder** — edit your config through a browser UI

> Think: *"No-code app builder — powered by JSON instead of drag-and-drop."*

---

## ✨ Features

| Feature | Description |
|---|---|
| ⚡ **Instant Generation** | Drop a JSON config → full-stack app in milliseconds |
| 🗄️ **Dynamic Schema** | Tables auto-create and evolve; never write a migration again |
| 🔐 **Auth Out of the Box** | NextAuth credential login & route protection |
| 🧩 **Modular UI** | `FormRenderer` and `TableRenderer` adapt to any field type |
| 📤 **GitHub Export** | Push your generated app to a new GitHub repo in one click |
| 🌍 **Multi-Language** | Switch language anywhere — EN, HI, BN, ES built in |
| 📦 **CSV Import** | Bulk-import records via CSV with header mapping |
| 🔧 **Visual App Builder** | Edit entities, fields, and theme from the browser |

---

## 🏗️ Architecture

```
app_config.json
      │
      ▼
┌─────────────────────────────────┐
│         C2A Engine              │
│  ┌──────────┐  ┌─────────────┐  │
│  │  Schema  │  │  API Route  │  │
│  │Generator │  │ /api/dynamic│  │
│  └──────────┘  └─────────────┘  │
│  ┌──────────────────────────┐   │
│  │    Dynamic UI Renderer   │   │
│  │  FormRenderer│TableRend. │   │
│  └──────────────────────────┘   │
└─────────────────────────────────┘
      │
      ▼
  Full-Stack App (DB + API + UI)
```

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/c2a-engine.git
cd c2a-engine
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root:

```env
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

> Generate a secret: `openssl rand -base64 32`

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — your app is live! 🎉

---

## ⚙️ Configuration

The entire app is driven by `app_config.json`. Here's a full example:

```json
{
  "appName": "Task Manager",
  "theme": {
    "primaryColor": "#3b82f6",
    "mode": "dark"
  },
  "auth": {
    "enabled": true,
    "providers": ["credentials"]
  },
  "language": "en",
  "entities": [
    {
      "name": "Task",
      "slug": "tasks",
      "icon": "CheckSquare",
      "fields": [
        { "name": "title",  "label": "Title",  "type": "string",  "required": true },
        { "name": "status", "label": "Status", "type": "select",
          "options": ["Pending", "In Progress", "Completed"], "default": "Pending" },
        { "name": "dueDate","label": "Due Date","type": "date" }
      ]
    }
  ]
}
```

### Supported Field Types

| Type | Description |
|---|---|
| `string` | Single-line text input |
| `text` | Multi-line textarea |
| `email` | Email input with validation |
| `number` | Numeric input |
| `date` | Date picker |
| `select` | Dropdown (provide `options` array) |
| `boolean` | Toggle checkbox |

---

## 📁 Project Structure

```
c2a-engine/
├── app/
│   ├── [entity]/          # Dynamic entity pages
│   ├── api/
│   │   ├── auth/          # NextAuth & registration
│   │   ├── config/        # Config read/write API
│   │   └── dynamic/       # Generic CRUD API
│   ├── builder/           # Visual App Builder UI
│   ├── login/             # Sign-in page
│   └── register/          # Sign-up page
├── components/
│   ├── AppShell.tsx        # Sidebar + layout
│   ├── DynamicEntityView.tsx
│   ├── FormRenderer.tsx    # Dynamic form generator
│   ├── TableRenderer.tsx   # Dynamic table generator
│   ├── CsvImportModal.tsx  # CSV bulk import
│   ├── GithubExportModal.tsx
│   └── LandingPageClient.tsx
├── lib/
│   ├── config-parser.ts   # Reads app_config.json
│   ├── db.ts              # SQLite connection
│   ├── schema-generator.ts# Auto table creation
│   └── i18n-context.tsx   # Language context
├── app_config.json        # ← Your app definition
└── middleware.ts          # Route protection
```

---

## 🌍 Adding a New Language

Open `app_config.json` and add a new language key under `translations`:

```json
"translations": {
  "en": { "dashboard": "Dashboard", "signIn": "Sign In", ... },
  "fr": { "dashboard": "Tableau de bord", "signIn": "Se connecter", ... }
}
```

The language switcher in the app header will automatically pick it up.

---

## 🔧 Visual App Builder

Navigate to `/builder` after logging in to:

- ✏️ Change your **App Name** and **Theme**
- ➕ **Add / Remove Entities** visually
- 🧩 **Add / Remove Fields** per entity with type, label, default value
- 💾 **Save & Deploy** — config is written and DB schema evolves instantly

---

## 📤 GitHub Export

1. Go to the **Dashboard** → click **Export to GitHub**
2. Enter your GitHub **Personal Access Token** (needs `repo` scope)
3. Provide a **repository name**
4. Click **Export** — a new public repo is created with your config!

---

## 🔐 Authentication

Authentication is powered by **NextAuth.js** with credential-based login.

- **Register** at `/register` — password is hashed with `bcryptjs`
- **Login** at `/login` — session stored in JWT cookie
- All routes except `/`, `/login`, `/register` are protected by middleware

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| [Next.js 15](https://nextjs.org) | Full-stack React framework (App Router) |
| [TypeScript](https://www.typescriptlang.org) | Type-safe development |
| [SQLite + better-sqlite3](https://github.com/WiseLibs/better-sqlite3) | Embedded local database |
| [NextAuth.js](https://next-auth.js.org) | Authentication |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | Password hashing |
| [Tailwind CSS](https://tailwindcss.com) | Utility-first styling |
| [Lucide React](https://lucide.dev) | Icon library |
| [PapaParse](https://www.papaparse.com) | CSV parsing |

---

## 🗺️ Roadmap

- [ ] PostgreSQL adapter
- [ ] Multi-tenant support (per-user configs)
- [ ] Relationship / foreign key support between entities
- [ ] File upload field type
- [ ] Role-based access control (RBAC)
- [ ] API key generation for external integrations
- [ ] Docker deployment guide

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m "Add amazing feature"`
4. Push and open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with ❤️ by **Jiya Sarkar**  
⭐ Star this repo if you found it useful!

</div>
