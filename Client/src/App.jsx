import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/User/login.jsx';
import Signup from './pages/User/signUp.jsx';
import Search from './pages/Search/Search.jsx';
import Home from './pages/Home/Home.jsx';
import SingleHotel from './pages/Hotel/SingleHotel.jsx';
import ProtectedRoute from './component/ProtectedRoute/ProtectedRoute.jsx';
import EmailVerification from './component/EmailVerification/EmailVerification.jsx';
import ProtectedLoginRoute from './component/ProtectedRoute/ProtectedLoginRoute.jsx';
import Profile from './pages/User/Profile.jsx';
import VerificationRequest from './pages/Hotel/VerificationRequest.jsx';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/*" element={<Navigate to="/login" />} />
          <Route path="/login" element={<ProtectedLoginRoute element={<Login />} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/search" element={<ProtectedRoute element={<Search />} />} />
          <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
          <Route path="/hotelname/:id" element={<ProtectedRoute element={<SingleHotel />} />} />
          {/* Deliberately public: the user clicks this from their inbox before
              they have ever logged in, often in a different browser. */}
          <Route path="/email-verification/:token" element={<EmailVerification />} />
          <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
          <Route path="/verify/verification-request" element={<ProtectedRoute element={<VerificationRequest />} />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;