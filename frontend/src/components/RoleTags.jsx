import React, { useState } from 'react';
import X from '../assets/x-icon.png';
import SkipButton from "./SkipButton.jsx";

const RoleTags = ({ roles, setRoles }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addRole(inputValue.trim());
    }
  };

  const addRole = (role) => {
    // Basic validation
    if (!role) return;
    if (roles.includes(role)) return;
    if (roles.length >= 5) return;

    setRoles([...roles, role]);
    setInputValue('');
  };

  const removeRole = (roleToRemove) => {
    const updatedRoles = roles.filter((role) => role !== roleToRemove);
    setRoles(updatedRoles);
  };

  const removeAll = () => {
    setRoles([]);
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Available Roles (Up to five)
      </label>
      <div className="flex flex-wrap items-center gap-2 border border-gray-200 rounded-md p-2">
        {roles.map((role, index) => (
          <div
            key={index}
            className="flex items-center justify-center bg-gray-800 text-sm font-bold text-white px-2 py-1 rounded-full"
          >
            <span className="ml-1 mr-1">{role}</span>
            <button
              type="button"
              className="flex items-center justify-center text-white hover:text-red-300"
              onClick={() => removeRole(role)}
            >
              <img src={X} className="w-4 h-4" />
            </button>
          </div>
        ))}

        <div className="flex flex-1 flex-row justify-between items-center w-full px-1">
          {roles.length < 5 && (
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={roles.length === 0 ? "E.g. Software Engineer, Product Manager" : ""}
              className="flex-1 focus:outline-none text-sm py-1"
            />
          )}
          <div className="flex items-center w-4 h-4">
            <SkipButton onClick={removeAll} className="flex-shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleTags;
