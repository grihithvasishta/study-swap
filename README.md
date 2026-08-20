# CampusEats

CampusEats is a premium, 3-page web platform designed for college students to easily order food from various campus canteens. It features a modern design aesthetic, responsive layouts, and a seamless cart/checkout experience.

## ✨ Features

- **Modern Premium Design**: Glassmorphism navbars, cinematic dark hero sections, and elevated food cards with clean hover animations (inspired by 21st.dev).
- **Full Menu Browsing**: Real-time search functionality and category filters (Snacks, Meals, Beverages, Desserts).
- **Cart Management**: Persistent cart state via `localStorage`, item quantity controls, and dynamic total calculation.
- **Backend Integration**: Includes a Python (FastAPI) backend configured to connect with Supabase for menu data and order persistence.

## 📂 Project Structure

```
├── index.html          # Home page (Hero, Today's Specials, How it Works)
├── menu.html           # Full menu with search and filter capabilities
├── cart.html           # Shopping cart and checkout form
├── assets/
│   ├── css/
│   │   └── styles.css  # Custom design system and utility classes
│   ├── js/
│   │   ├── app.js      # Core logic, cart state, and DOM manipulation
│   │   └── api.js      # API abstraction layer
│   └── images/         # Premium food photography and UI assets
└── backend/
    ├── main.py         # FastAPI application
    ├── requirements.txt# Python dependencies
    └── .env            # Supabase credentials (ignored in git)
```

## 🚀 Getting Started

### Option 1: Frontend Only (No Setup Required)
You don't need the backend running to view and interact with the UI. The application uses a fallback sample dataset if the backend is unreachable.
1. Clone the repository.
2. Open `index.html` in your web browser.

### Option 2: Full Stack (With FastAPI & Supabase)
1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # Windows:
   venv\Scripts\activate
   # Mac/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure your environment variables. Ensure you have a `.env` file in the `backend/` directory:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   ```
5. Run the FastAPI development server:
   ```bash
   uvicorn main:app --reload
   ```
   *The server will start at `http://127.0.0.1:8000`.*

## 🛠 Tech Stack

- **Frontend**: HTML5, Vanilla CSS3, Vanilla JavaScript
- **Backend**: Python 3, FastAPI, Uvicorn
- **Database**: Supabase (PostgreSQL)

## 📄 License
MIT License
# campus-eats-
