import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const [isBestTimeOpen, setIsBestTimeOpen] = useState<boolean>(false);

  const toggleBestTime = () => {
    setIsBestTimeOpen(prev => !prev);
  };

  return (
    <div className="sidebar">
      <h2>Menu</h2>

      <div className={`menu-group ${isBestTimeOpen ? 'active' : ''}`}>
        <button onClick={toggleBestTime}>
          Best Trending Time ⌄
        </button>
        {isBestTimeOpen && (
          <div className="submenu">
            <a href="#">Morning</a>
            <a href="#">Afternoon</a>
            <a href="#">Evening</a>
          </div>
        )}
      </div>

      <a className="static-link" href="#">Analytics</a>
      <a className="static-link" href="#">Reports</a>
      <a className="static-link" href="#">Settings</a>
    </div>
  );
};

export default Sidebar;
