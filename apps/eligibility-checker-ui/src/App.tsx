import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ApplicationProvider } from './context/ApplicationContext'
import Layout from './components/Layout/Layout'
import ScrollToTop from './components/ScrollToTop'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import ConsentPage from './pages/ConsentPage'
import PersonalInfoPage from './pages/PersonalInfoPage'
import DisabilityInfoPage from './pages/DisabilityInfoPage'
import VerificationPage from './pages/VerificationPage'
import ResultsPage from './pages/ResultsPage'
import ReviewPage from './pages/ReviewPage'
import ConfirmationPage from './pages/ConfirmationPage'
import './App.css'

function App() {
  return (
    <ApplicationProvider>
      <Router>
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/personal-info" element={<PersonalInfoPage />} />
            <Route path="/disability-info" element={<DisabilityInfoPage />} />
            <Route path="/consent" element={<ConsentPage />} />
            <Route path="/verification" element={<VerificationPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/review" element={<ReviewPage />} />
            <Route path="/confirmation" element={<ConfirmationPage />} />
          </Routes>
        </Layout>
      </Router>
    </ApplicationProvider>
  )
}

export default App
