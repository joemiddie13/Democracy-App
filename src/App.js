import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './Components/HomePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/about" element={<AboutPage />} />
        <Route path="/candidates" element={<CandidatesPage />} /> */}
      </Routes>
    </Router>
  );
}


export default App;
