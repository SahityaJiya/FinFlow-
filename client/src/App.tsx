import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { RefreshProvider } from './context/RefreshContext';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Groups from './pages/Groups';
import Profile from './pages/Profile';
import Layout from './components/layout/Layout';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RefreshProvider>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Auth />} />
              <Route path="/register" element={<Auth />} />
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/groups" element={<Groups />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
            </Routes>
          </AnimatePresence>
        </RefreshProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
