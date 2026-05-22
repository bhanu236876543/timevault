import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import WriteLetter from './pages/WriteLetter';
import ReadLetter from './pages/ReadLetter';
import AddMemory from './pages/AddMemory';
import Goals from './pages/Goals';
import Memories from './pages/Memories';
import Moods from './pages/Moods';
import Settings from './pages/Settings';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password/:token" element={<ResetPassword />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="write-letter" element={<WriteLetter />} />
            <Route path="letter/:id" element={<ReadLetter />} />
            <Route path="add-memory" element={<AddMemory />} />
            <Route path="goals" element={<Goals />} />
            <Route path="memories" element={<Memories />} />
            <Route path="moods" element={<Moods />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;

