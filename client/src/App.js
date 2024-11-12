import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container, CssBaseline, Box } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import './App.css';

// Import components
import Header from './pages/Header';
import Footer from './pages/Footer';
import AdminDashboard from './components/admin/AdminDashBoard';
import UserManager from './components/admin/UserManager';
import MCQManager from './components/admin/MCQManager';
import CodingChallengeManager from './components/admin/CodingChallengeManager';
import MCQSection from './components/user/MCQSection';
import CodingChallengeSection from './components/user/CodingChallengeSection';
import Login from './pages/Login';
 
import TestPage from './components/user/TestPage';
import TestDetailsPage from './components/user/TestDetailsPage';
import TestManager from './components/admin/TestManager';
import Home from './pages/Home';
import Proctoring from './components/user/Proctoring';
import UserDetailsForm from './pages/UserDetailsForm';
import OnlineProctoring from './pages/OnlineProctoring';
import Signup from './pages/Signup';
import VendorDashboard from './components/vendor/vendorDashboard';
// Create a theme instance
const theme = createTheme({
  // You can customize your theme here
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              minHeight: '100vh' 
            }}
          >
            <Header />
            <Box 
              component="main" 
              sx={{ 
                flexGrow: 1,
                pt: '64px', // Height of the fixed header
                pb: '64px', // Height of the footer
                minHeight: 'calc(100vh - 128px)', // Viewport height minus header and footer
                backgroundColor: '#f5f5f5' // Optional: adds a subtle background color
              }}
            >
              <Container 
                maxWidth="lg" 
                sx={{ 
                  py: 4  
                }}
              >
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/tests" element={<TestManager />} />
                  <Route path="/admin/users" element={<UserManager />} />
                  <Route path="/admin/mcq" element={<MCQManager />} />
                  <Route path="/admin/coding" element={<CodingChallengeManager />} />
                  <Route path="/login" element={<Login />} />
                  <Route path ="/signup" element={<Signup />} />
             
                  <Route path="/mcq" element={<MCQSection hackathonId="dummy-id" mcqs={[]} />} />
                  <Route path="/coding" element={<CodingChallengeSection hackathonId="dummy-id" challenges={[]} />} />
                  <Route path="/test" element={<TestPage />} />
                  <Route path="/tests" element={<TestDetailsPage />} />
                  <Route path="/test/:testId" element={<TestPage />} />
                  <Route path="/test/:testId/start" element={<TestPage />} />
                  <Route path="/proctoring" element={<Proctoring />} />
                  <Route path="/online-proctoring" element={<OnlineProctoring />} />
                  <Route path="/profile" element={<UserDetailsForm />} />
                  <Route path="/vendor" element={<VendorDashboard />} />
                </Routes>
              </Container>
            </Box>
            <Footer />
          </Box>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
