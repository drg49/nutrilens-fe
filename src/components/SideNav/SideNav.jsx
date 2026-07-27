import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import data from './links';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'; // Imported a logout icon
import Logo from '../Logo/Logo';
import { logout } from '../../api/authentication'; // Imported the logout function
import './SideNav.scss';

const LinkWithIcon = ({ name, icon, link, currentPath }) => {
  const cssClass = `side-nav-link${currentPath === link ? ' active' : ''}`;
  return (
    <div className={cssClass}>
      <FontAwesomeIcon icon={icon} />
      <Link to={link}>{name}</Link>
    </div>
  );
};

const SideNav = () => {
  const location = useLocation();

  const handleLogout = () => {
    logout();
    // Optional: Add window.location.href = '/login' or a useHistory/useNavigate hook
    // here if your logout API doesn't automatically trigger a redirect.
  };

  const links = data.map((i, index) => (
    <LinkWithIcon
      key={index} // Added a key prop to fix React's list warning
      name={i.name}
      icon={i.icon}
      link={i.link}
      currentPath={location.pathname}
    />
  ));

  return (
    <nav className="side-nav">
      <Logo size="2x" />

      <div className="side-nav-links-wrapper">{links}</div>

      {/* Logout Button */}
      <div
        className="side-nav-link logout-btn"
        onClick={handleLogout}
        style={{ cursor: 'pointer' }}
      >
        <FontAwesomeIcon icon={faSignOutAlt} />
        <span className="logout-txt">Logout</span>
      </div>
    </nav>
  );
};

export default SideNav;
