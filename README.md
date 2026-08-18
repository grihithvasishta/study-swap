# StudySwap 📘

> A peer-to-peer study notes and academic material sharing platform for college students.

StudySwap allows students to browse, filter, preview, and upload lecture notes, revision guides, formula sheets, and study materials across multiple academic disciplines.

---

## ✨ Features

- **Home Page (`index.html`)**:
  - Hero section with custom edtech illustration banner and quick CTA buttons.
  - Live impact stats counter (2,500+ notes, 18+ subjects, 40+ universities).
  - Dynamic "Recently Added Notes" grid synchronized in real-time.
  - 3-step "How It Works" guide and student community footer.

- **Browse Notes (`browse.html`)**:
  - **Instant Search**: Real-time keystroke searching across note titles, descriptions, uploaders, and topic tags.
  - **Multi-criteria Filtering**: Filter by Subject (*Computer Science, Mathematics, Physics, Economics, Chemistry, Mechanical Engineering*), Semester (*Sem 1 to 8*), and Sort (*Recent, Rating, Downloads, A-Z*).
  - **Quick-filter category pills**: One-click subject filtering.
  - **Interactive Note Modal**: Document preview sheet with metadata, table of contents, and simulated download action.

- **Upload Notes (`upload.html`)**:
  - Contribution guidelines and quality tips.
  - Drag-and-drop file upload zone supporting PDF, DOCX, PNG, JPG.
  - Client-side validation with real-time feedback and error handling.
  - Celebratory success modal with instant navigation to Browse Notes.

- **Hybrid Data Layer & Supabase Integration**:
  - Live remote database synchronization with **Supabase** (`@supabase/supabase-js`).
  - Automatic `localStorage` caching and fallback for zero latency and offline access.

---

## 📁 Project Structure

```
skill-swap/
├── index.html              # Home Page
├── browse.html             # Browse & Search Page
├── upload.html             # Upload & Contribution Page
├── README.md               # Documentation
│
├── css/
│   └── style.css           # Design system (DM Sans + Source Serif, dark theme, responsive grid)
│
├── js/
│   ├── supabase-config.js  # Supabase client setup & credentials
│   ├── data.js             # Data model, seed notes, and Supabase/localStorage sync
│   ├── navbar.js           # Navigation bar & mobile drawer toggle
│   ├── home.js             # Home page rendering logic & note preview modal
│   ├── browse.js           # Real-time search & multi-filter logic
│   └── upload.js           # Form validation, drag-and-drop & note submission
│
└── assets/
    └── hero-banner.jpg     # Hero banner illustration
```

---

## 🚀 Getting Started

### 1. Run Locally
Open `index.html` directly in any modern web browser. No compilation, Node.js, or build steps required.

### 2. Supabase Database Table Setup (Optional)
To persist notes permanently in your Supabase database, run this SQL in your **Supabase SQL Editor**:

```sql
create table if not exists notes (
  id text primary key,
  title text not null,
  subject text not null,
  semester text not null,
  uploader text not null,
  uploader_initials text,
  description text not null,
  file_format text default 'PDF',
  file_size text default 'N/A',
  pages integer default 10,
  downloads integer default 0,
  rating numeric default 5.0,
  date_added text default current_date::text,
  tags text[] default '{}'
);

-- Enable public read & insert policies
alter table notes enable row level security;
create policy "Allow public read" on notes for select using (true);
create policy "Allow public insert" on notes for insert with check (true);
```

---

## 🛠️ Tech Stack

- **Frontend**: Semantic HTML5, Custom CSS3 Design System, Vanilla JavaScript (ES6+)
- **Typography**: Google Fonts (`DM Sans`, `Source Serif 4`)
- **Backend / Database**: [Supabase](https://supabase.com) (PostgreSQL)
- **Icons**: Inline Feather/Lucide-style SVG icons

---

## 📄 License
MIT License. Built for students, by students.
