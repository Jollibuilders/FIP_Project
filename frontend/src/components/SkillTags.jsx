import React, { useState } from 'react';
import X from '../assets/x-icon.png';
import SkipButton from "./SkipButton.jsx";

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
      <div className="flex flex-wrap items-center gap-2 border border-gray-200 rounded-md p-2">
        {skills.map((skill, index) => (
          <div
            key={index}
            className="flex items-center justify-center bg-gray-800 text-sm font-bold text-white px-2 py-1 rounded-full"
          >
            <span className="ml-1 mr-1">{skill}</span>
            <button
              type="button"
              className="flex items-center justify-center text-white hover:text-red-300"
              onClick={() => removeSkill(skill)}
            >
              <img src={X} className="w-4 h-4" />
            </button>
          </div>
        ))}

        <div className="flex flex-1 justify-between items-center w-full">
          {skills.length < 5 && (
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={skills.length === 0 ? "Add a skill and press Enter" : ""}
              className="flex-1 focus:outline-none"
            />
          )}
          <SkipButton onClick={removeAll} className="flex-shrink-0" />
        </div>
      </div>
    </div>
  );
};

export default SkillTags;
