import React, { useEffect } from 'react';
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
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import './App.css';

function App() {
  const { user } = useAuth();

  useEffect(() => {
    if (Capacitor.isNativePlatform() && user && user.role === 'donor') {
      const registerNativePush = async () => {
        let permStatus = await PushNotifications.checkPermissions();

        if (permStatus.receive === 'prompt') {
          permStatus = await PushNotifications.requestPermissions();
        }

        if (permStatus.receive !== 'granted') {
          console.warn('User denied push permission');
          return;
        }

        // Register with Apple / Google to receive push via APNS/FCM
        await PushNotifications.register();

        // On success, we should be able to receive notifications
        PushNotifications.addListener('registration', async (token) => {
          console.log('Push registration success, token: ' + token.value);
          try {
            await apiRequest('/api/donor/fcm-token', {
              method: 'POST',
              body: JSON.stringify({ token: token.value })
            });
            console.log('Native push token sent to backend');
          } catch (error) {
            console.error('Failed to sync push token', error);
          }
        });

        PushNotifications.addListener('registrationError', (error) => {
          console.error('Error on registration: ' + JSON.stringify(error));
        });

        PushNotifications.addListener('pushNotificationReceived', (notification) => {
          console.log('Push received: ' + JSON.stringify(notification));
          // Provide local alert or UI update
          alert(`${notification.title}\n${notification.body}`);
        });
      };

      registerNativePush();
      
      return () => {
        PushNotifications.removeAllListeners();
      };
    }
  }, [user]);

  return (
    <BrowserRouter>
      <div className="app-container">
        <Header />
        <main className="main-content pt-28 md:pt-36">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<RegisterDonor />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes — Shielding identity session */}
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
