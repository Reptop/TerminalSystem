import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import App from './App'
import InfoPage from './components/InfoPage'

export function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="info" element={<InfoPage />} />
        </Route>
      </Routes>
    </Router>
  )
}
