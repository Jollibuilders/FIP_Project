import React, { useState } from 'react';
import { IoClose } from "react-icons/io5";

const SkillTags = ({ skills, setSkills }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill(inputValue.trim());
    }
  };

  const addSkill = (skill) => {
    // Basic validation
    if (!skill) return;
    if (skills.includes(skill)) return;
    if (skills.length >= 5) return;

    setSkills([...skills, skill]);
    setInputValue('');
  };

  const removeSkill = (skillToRemove) => {
    const updatedSkills = skills.filter((skill) => skill !== skillToRemove);
    setSkills(updatedSkills);
  };

  const removeAll = () => {
    setSkills([]);
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Skills (Up to five)
      </label>
      <div className="relative border border-gray-200 rounded-md p-2">
        {/* Remove All Button - Top Right (when there are skills) */}
        {skills.length > 0 && (
          <IoClose 
            onClick={removeAll} 
            className="absolute top-2 right-2 cursor-pointer text-gray-400 hover:text-red-500 hover:scale-125 transition-transform duration-200 ease-in-out active:scale-95" 
          />
        )}
  
        {/* Skill Tags */}
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2 pr-6 mb-2">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="flex items-center justify-center bg-gray-800 text-sm font-bold text-white px-2 py-1 rounded-full"
              >
                <span className="ml-1 mr-2">{skill}</span>
                <IoClose 
                  onClick={() => removeSkill(skill)} 
                  className="flex items-center justify-center text-gray-300 hover:text-red-500 hover:scale-130 transition-transform duration-200 ease-in-out active:scale-95"
                />
              </div>
            ))}
          </div>
        )}
  
        {/* Input and Remove All in One Line (when no skills) */}
        {skills.length < 5 && (
          <div className={`flex items-center ${skills.length === 0 ? 'justify-between' : 'mt-2'}`}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a skill and press Enter"
              className="w-full focus:outline-none text-sm py-1"
            />
            {skills.length === 0 && (
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

export default SkillTags;
