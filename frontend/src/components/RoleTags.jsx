import React, { useState } from 'react';
import { IoClose } from "react-icons/io5";

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
      <div className="relative border border-gray-200 rounded-md p-2">
        {/* Similar design to skilltags */}
        {roles.length > 0 && (
          <IoClose 
            onClick={removeAll} 
            className="absolute top-2 right-2 cursor-pointer text-gray-400 hover:text-red-500 hover:scale-125 transition-transform duration-200 ease-in-out active:scale-95"
          />
        )}
  
        {/* Role Tags */}
        {roles.length > 0 && (
          <div className="flex flex-wrap gap-2 pr-6 mb-2">
            {roles.map((role, index) => (
              <div
                key={index}
                className="flex items-center justify-center bg-gray-800 text-sm font-bold text-white px-2 py-1 rounded-full"
              >
                <span className="ml-1 mr-2">{role}</span>
                <IoClose 
                  onClick={() => removeRole(role)} 
                  className="flex items-center justify-center text-gray-300 hover:text-red-500 hover:scale-130 transition-transform duration-200 ease-in-out active:scale-95"
                />
              </div>
            ))}
          </div>
        )}

        {roles.length < 5 && (
          <div className={`flex items-center ${roles.length === 0 ? 'justify-between' : 'mt-2'}`}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={roles.length === 0 ? "E.g. Software Engineer, Product Manager" : ""}
              className="w-full focus:outline-none text-sm py-1"
            />
            {roles.length === 0 && (
              <IoClose 
                onClick={removeAll} 
                className="ml-2 cursor-pointer text-gray-400 hover:text-red-500 hover:scale-125 transition-transform duration-200 ease-in-out active:scale-95"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleTags;
