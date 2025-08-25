import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import InviteForm from './components/InviteForm.tsx'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<InviteForm />} />
          <Route path="/invite" element={<InviteForm />} />
          <Route path="/invite.html" element={<Navigate to="/invite" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
