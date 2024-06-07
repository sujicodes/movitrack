import React from 'react';
import "./TabButton.css"

const TabButton = ({ label, activeTab, onClick }) => (
  <button
    className={`tab-button`}
    onClick={() => onClick(label)}
  >
    {label}
  </button>
);

export default TabButton;