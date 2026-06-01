import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import KitDetail from './KitDetail.jsx'
import AddKit from './AddKit.jsx'
import EditKit from './EditKit.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/kits/:kit_id" element={<KitDetail />} />
        <Route path="/add-kit" element={<AddKit />} />
        <Route path="/edit-kit/:kit_id" element={<EditKit />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)


