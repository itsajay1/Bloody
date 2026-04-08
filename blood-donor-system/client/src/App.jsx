import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import RegisterDonor from './pages/RegisterDonor';
import RequestBlood from './pages/RequestBlood';
import Login from './pages/Login';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import { apiRequest } from './utils/api';
import { requestForToken, onMessageListener } from './firebase';
import { Toaster } from 'react-hot-toast';
import './App.css';

function App() {
  const { user } = useAuth();
  const [notification, setNotification] = useState({ title: '', body: '' });

  useEffect(() => {
    if (user && user.role === 'donor') {
      const initPush = async () => {
        try {
          const token = await requestForToken();
          if (token) {
            // Save token to backend using standardized apiRequest
            await apiRequest('/api/donor/fcm-token', {
              method: 'POST',
              body: JSON.stringify({ token })
            });
            console.log('Firebase token synced with backend.');
          }
        } catch (error) {
          console.error('Error setting up Firebase pushes:', error);
        }
      };
      initPush();
    }
  }, [user]);

  useEffect(() => {
    // Listen for foreground messages
    const listener = onMessageListener();
    if (listener) {
      listener.then((payload) => {
        if (payload?.notification) {
          setNotification({
            title: payload.notification.title || 'New Notification',
            body: payload.notification.body || '',
          });
          alert(`${payload.notification.title}\n${payload.notification.body}`);
        }
      }).catch((err) => console.error('FCM listener failed: ', err));
    }
  }, []);

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <div className="app-container">
        <Header />
        <main className="main-content pt-28 md:pt-36">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<RegisterDonor />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes — Require Authentication */}
            <Route path="/request" element={
              <ProtectedRoute>
                <RequestBlood />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
