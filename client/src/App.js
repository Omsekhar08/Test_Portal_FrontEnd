import React, { useState, useEffect } from 'react';
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
          <Box display="flex" flexDirection="column" minHeight="100vh">
            <Header />
            <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/tests" element={<TestManager />} />
                <Route path="/admin/users" element={<UserManager />} />
                <Route path="/admin/mcq" element={<MCQManager />} />
                <Route path="/admin/coding" element={<CodingChallengeManager />} />
                <Route path="/login" element={<Login />} />
             
                <Route path="/mcq" element={<MCQSection hackathonId="dummy-id" mcqs={[]} />} />
                <Route path="/coding" element={<CodingChallengeSection hackathonId="dummy-id" challenges={[]} />} />
                <Route path="/test" element={<TestPage />} />
                <Route path="/tests" element={<TestPage />} />
                <Route path="/test/:testId" element={<TestDetailsPage />} />
                <Route path="/proctoring" element={<Proctoring />} />
                <Route path="/online-proctoring" element={<OnlineProctoring />} />
                <Route path="/profile" element={<UserDetailsForm />} />
              </Routes>
            </Container>
            <Footer />
          </Box>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
