# Dynamic-Engine-App-Builder (C2A Engine)

A full-stack **Config-to-App (C2A) Engine** built with Next.js — generate complete web apps from a single JSON config file.

## 🚀 Live Demo

Deploy your own in one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/jiyasarkar582-ops/Internship)

## ✨ Features

- **Instant Generation** — Drop a JSON config → get a full-stack app with DB, API routes, and UI
- **Dynamic Schema** — Tables auto-created and evolved as your config changes
- **Auth Out of the Box** — NextAuth wired in with credentials login and route protection
- **Modular UI** — Smart `FormRenderer` and `TableRenderer` components adapt to any field type
- **CSV Import** — Bulk import data into any entity from a CSV file
- **GitHub Export** — Push your generated app directly to a new GitHub repo with one click
- **i18n Built-in** — Ship in English, Hindi, Bengali, Spanish and more

## 🛠 Tech Stack

- **Next.js 16** (App Router + Turbopack)
- **SQLite** via `sqlite3` + `sqlite`
- **NextAuth.js v4** (Credentials Provider)
- **Tailwind CSS v4**
- **TypeScript**
- **Lucide Icons**

## ⚙️ Getting Started

```bash
git clone https://github.com/jiyasarkar582-ops/Internship.git
cd Internship
npm install
cp .env.example .env.local   # add your NEXTAUTH_SECRET
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 🔑 Environment Variables

| Variable | Description |
|---|---|
| `NEXTAUTH_SECRET` | Random 32-char secret for JWT signing |
| `NEXTAUTH_URL` | Your deployment URL (e.g. `https://your-app.vercel.app`) |

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/  # NextAuth handler
│   │   ├── auth/register/       # User registration
│   │   ├── config/              # App config CRUD
│   │   ├── dynamic/[entity]/    # Dynamic CRUD API
│   │   └── export/github/       # GitHub export
│   ├── builder/                 # Visual App Builder
│   ├── login/                   # Login page
│   ├── register/                # Register page
│   └── [entity]/                # Dynamic entity views
├── components/                  # Reusable UI components
├── lib/                         # Utilities, DB, auth, i18n
└── app_config.json              # Your app configuration
```

## 📄 License

MIT
