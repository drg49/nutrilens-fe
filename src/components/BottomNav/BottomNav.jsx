import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import data from './links';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faCamera } from '@fortawesome/free-solid-svg-icons';
import { logout } from '../../api/authentication';
import './BottomNav.scss';

const LinkWithIcon = ({ name, icon, link, currentPath }) => {
  const cssClass = `bottom-nav-link${currentPath === link ? ' active' : ''}`;
  return (
    <Link to={link} className={cssClass}>
      <FontAwesomeIcon icon={icon} />
      <span className="link-name">{name}</span>
    </Link>
  );
};

const BottomNav = () => {
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  const left = data[0];
  const right = data[1];

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-inner">
        <div className="left-item">
          {left && (
            <LinkWithIcon
              name={left.name}
              icon={left.icon}
              link={left.link}
              currentPath={location.pathname}
            />
          )}
        </div>

        <div className="center-action">
          <Link to="/capture" className="camera-btn" aria-label="Capture">
            <div className="camera-inner">
              <FontAwesomeIcon icon={faCamera} />
            </div>
          </Link>
        </div>

        <div className="right-item">
          {right && (
            <LinkWithIcon
              name={right.name}
              icon={right.icon}
              link={right.link}
              currentPath={location.pathname}
            />
          )}
        </div>
      </div>

      <button className="logout-btn" onClick={handleLogout} aria-label="Logout">
        <FontAwesomeIcon icon={faSignOutAlt} />
      </button>
    </nav>
  );
};

export default BottomNav;
