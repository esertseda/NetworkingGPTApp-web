import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import InviteForm from './components/InviteForm.tsx'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={
            <div>
              <header className="App-header">
                <h1>NetworkingGPT</h1>
                <p>Davet Sistemi</p>
              </header>
              <main>
                <InviteForm />
              </main>
            </div>
          } />
          <Route path="/invite" element={
            <div>
              <header className="App-header">
                <h1>NetworkingGPT</h1>
                <p>Davet Sistemi</p>
              </header>
              <main>
                <InviteForm />
              </main>
            </div>
          } />
          <Route path="/invite.html" element={<Navigate to="/invite" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
