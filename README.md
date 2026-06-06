# Trinetra AI

**Where Foresight Becomes Protection.**

Trinetra AI is an advanced, AI-powered emergency operations and situational awareness platform. It provides real-time mission control, incident management, resource tracking, and predictive capabilities designed for mass-scale events like the Mahakumbh.

---

## 🎯 Overview

Trinetra AI unifies field communications, crowd management analytics, and automated response protocols into a single, high-density professional dashboard. It enables emergency operators to monitor risk distributions, predict escalations, and issue multilingual public broadcasts instantly.

---

## ✨ Features

- **Mission Control Dashboard**: Real-time KPI tracking, interactive zone heat maps, and live incident feeds.
- **Emergency Memory AI**: Predictive modeling that leverages historical cases to anticipate crowd movements and operational risks.
- **Automated Triage**: Natural-language incident reporting with instant AI classification and severity scoring.
- **Multilingual Broadcasting**: One-click generation and deployment of AI-drafted emergency alerts across various languages and digital signage channels.
- **Resource Management**: Live tracking of medical, security, and infrastructure response units.
- **Premium UI/UX**: Dark-themed, glassmorphism-heavy, enterprise-grade interface inspired by military and government command centers.

---

## 🏗️ Architecture

Trinetra AI is built on a modern full-stack monorepo architecture:

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS + Custom Design System
- **Routing**: React Router DOM
- **Icons & Visuals**: Lucide React + Recharts
- **Location**: `/frontend`

### Backend (Coming Soon)
- **Framework**: FastAPI (Python)
- **Responsibilities**: AI Model Integration, API Routing, Data Processing
- **Location**: `/backend`

---

## 🚀 Installation & Local Development

### Prerequisites
- Node.js (v18+)
- Python 3.10+ (For backend development)

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Run the development server:**
   ```bash
   npm run dev
   ```
   *The frontend will be available at `http://localhost:5173`.*

### Backend Setup (Placeholder)

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```
2. **Create a virtual environment and install dependencies:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```
3. **Run the FastAPI server:**
   ```bash
   uvicorn main:app --reload
   ```

---

## 🌍 Deployment Strategy

The project structure is natively prepared for decoupled deployment:

- **Frontend**: Ready to be deployed via [Vercel](https://vercel.com). Just connect the repository and set the Root Directory to `frontend`.
- **Backend**: Ready to be deployed via [Render](https://render.com) or AWS. Point the web service to the `backend/main.py` entry point.
- **Database**: PostgreSQL integrations planned via [Supabase](https://supabase.com).

---

## 🔮 Future Scope

- **Live WebSocket Feeds**: Transition from mock data to real-time socket connections for incidents and telemetry.
- **Generative AI Integration**: Hook up the Emergency Memory AI to LLM providers (e.g., Gemini) for dynamic case-resolution generation.
- **Auth & RBAC**: Implement multi-tier role-based access control (Operator, Commander, Admin) using Supabase Auth.
