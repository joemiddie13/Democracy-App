import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import HomePage from './Components/HomePage';
import SignUp from './Components/SignUp'
import Account from './Components/Account'
import Login from './Components/Login';

function App() {
  return (
    <Router>
      {/* Navigation Bar */}
      <div className="sticky top-0 bg-purple-600 py-4">
        <nav className="flex justify-center space-x-4">
          <Link to="/" className="text-white hover:bg-purple-700 px-3 py-2 rounded-md text-sm font-medium">Home</Link>
          <Link to="/signup" className="text-white hover:bg-purple-700 px-3 py-2 rounded-md text-sm font-medium">Sign Up</Link>
          <Link to="/login" className="text-white hover:bg-purple-700 px-3 py-2 rounded-md text-sm font-medium">Login</Link>
          <Link to="/candidates" className="text-white hover:bg-purple-700 px-3 py-2 rounded-md text-sm font-medium">Candidates</Link>
          <Link to="/about" className="text-white hover:bg-purple-700 px-3 py-2 rounded-md text-sm font-medium">About</Link>
        </nav>
      </div>
      {/* Web Pages */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/account" element={<Account />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}


export default App;
