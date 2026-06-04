# AD350 PATS Project  
A Parts & Traceability System modeling the full lifecycle of propulsion assemblies, including valves, kits, IFMs, PIFs, IPUs, and MQC/ISTC chamber events.

## 📌 Overview
The PATS (Parts & Traceability System) project is a full‑stack application developed for **AD350 – Application Development** at North Seattle College.  
It models the real‑world traceability workflow used in aerospace propulsion manufacturing and testing.

This repository contains the **PATS-Client**, a React + Supabase front‑end that provides CRUD operations, data views, and a scalable architecture for future tables.

---

## 🧱 Tech Stack
- **React + Vite** (front‑end)
- **Supabase** (database + API)
- **JavaScript / JSX**
- **Git + GitHub**
- **Markdown documentation**

---

## 📂 Project Structure
PATS-Client/
│
├── src/
│   ├── components/
│   ├── pages/
│   │   ├── kits/
│   │   │   ├── App.jsx
│   │   │   ├── KitDetail.jsx
│   │   │   ├── AddKit.jsx
│   │   │   ├── EditKit.jsx
│   │   │   └── DeleteModal.jsx
│   │   └── (future modules: parts, assemblies, work_orders, technicians)
│   ├── supabase/
│   └── main.jsx
│
├── docs/
│   ├── scalability.md
│   └── (additional project documentation)
│
└── README.md


---

## 🚀 Current Functionality (as of Week 08)

### ✔ Kits Module (Complete CRUD)
- List all kits  
- View kit details  
- Add new kit  
- Edit existing kit  
- Delete kit (with confirmation modal)  
- Fully integrated with Supabase  

### ✔ Scalability Architecture
Documented in:  
`/docs/scalability.md`

Includes:
- Folder structure for multi‑table expansion  
- CRUD pattern for every future table  
- Routing expansion strategy  
- Shared components plan  
- Navigation bar plan  
- Supabase reuse strategy  

---

## 🛠 Upcoming Features
- Parts module (CRUD)
- Assemblies module
- Work Orders module
- Technicians module
- Shared components (Pagination, Search, Table)
- Top navigation bar
- Relationship views (foreign keys)
- Traceability reports

---

## 📘 Documentation
- **Scalability Notes:**  
  [`docs/scalability.md`](docs/scalability.md)

- **Weekly Development Updates:**  
  Submitted through Canvas

---

## 🧑‍💻 How to Run the Project

### 1. Install dependencies
npm install


### 2. Start the dev server
npm run dev


### 3. Environment Variables
Create a `.env` file with your Supabase keys:
VITE_SUPABASE_URL=your-url
VITE_SUPABASE_ANON_KEY=your-key


---

## 🤝 Contribution Workflow (AD350 Requirements)
- Create a new branch for each weekly update  
- Commit regularly  
- Push to GitHub  
- Submit a Pull Request for each weekly development update  
- Review at least two classmates’ PRs  

---

## 🏁 Author
**David A. Davis**  
North Seattle College – AD350  
2026



