import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Routes, Route } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import { validateUser } from './api/authentication';
import 'react-toastify/dist/ReactToastify.css';
import BottomNav from './components/BottomNav/BottomNav';

const spinner = (
  <div className="spinner-wrapper">
    <FontAwesomeIcon icon={faSpinner} size="10x" color="gray" spin />
  </div>
);

const Home = lazy(() => import('./pages/Home/Home'));
const Auth = lazy(() => import('./pages/Auth/Auth'));
const Profile = lazy(() => import('./pages/Profile/Profile'));
const Capture = lazy(() => import('./pages/Capture/Capture'));

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [user, setUser] = useState(null);

  const theme = createTheme({
    palette: {
      mode: 'light',
    },
  });

  useEffect(() => {
    validateUser()
      .then((data) => {
        console.log('User validated:', data);
        setUser(data.user);
        setIsLoggedIn(true);
      })
      .catch(() => setIsLoggedIn(false));
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <>
        {isLoggedIn && (
          <div className="container">
            <BottomNav />
            <div className="main">
              <Suspense fallback={spinner}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/capture" element={<Capture />} />
                  <Route path="/profile" element={<Profile user={user} />} />
                </Routes>
              </Suspense>
            </div>
          </div>
        )}
        {isLoggedIn === false && <Auth />}
        {isLoggedIn === null && <div id="main-spinner">{spinner}</div>}
        <ToastContainer limit={3} />
      </>
    </ThemeProvider>
  );
};

export default App;
