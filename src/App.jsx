import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Routes, Route } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer } from 'react-toastify';
import { validateUser } from './api/authentication';
import 'react-toastify/dist/ReactToastify.css';
import SideNav from './components/SideNav/SideNav';
import Details from './components/Details/Details';

const spinner = (
  <FontAwesomeIcon icon={faSpinner} size="10x" color="gray" spin />
);

const Home = lazy(() => import('./pages/Home/Home'));
const Auth = lazy(() => import('./pages/Auth/Auth'));
const Profile = lazy(() => import('./pages/Profile/Profile'));

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [user, setUser] = useState(null);

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
    <>
      {isLoggedIn && (
        <div className="container">
          <SideNav />
          <Details />
          <div className="main">
            <Suspense fallback={spinner}>
              <Routes>
                <Route path="/" element={<Home />} />
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
  );
};

export default App;
