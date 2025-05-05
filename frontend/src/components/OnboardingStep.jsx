import React, { useRef, useEffect, useState } from 'react';

const OnboardingStep = ({ questionData, formData, onInputChange, onMultiSelectChange, onTagsChange }) => {
  const { question, key, type, placeholder, options } = questionData;

  // For skills input
  const [skillInputValue, setSkillInputValue] = useState('');

  const inputRef = useRef(null);

  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current && (type === 'text' || type === 'email' || type === 'number' || type === 'textarea')) {
      inputRef.current.focus();
    }
  }, [key, type]);

  // Skills handlers
  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill(skillInputValue.trim());
    }
  };

  const addSkill = (skill) => {
    // Basic validation
    if (!skill) return;
    const currentSkills = formData[key] || [];
    if (currentSkills.includes(skill)) return;
    if (currentSkills.length >= 5) return;

    onInputChange(key, [...currentSkills, skill]);
    setSkillInputValue('');
  };

  const removeSkill = (skillToRemove) => {
    const currentSkills = formData[key] || [];
    const updatedSkills = currentSkills.filter((skill) => skill !== skillToRemove);
    onInputChange(key, updatedSkills);
  };

  const removeAllSkills = () => {
    onInputChange(key, []);
  };

  const renderInputField = () => {
    switch (type) {
      case 'text':
      case 'email':
      case 'number':
        return (
          <input
            ref={inputRef}
            type={type}
            value={formData[key] || ''}
            onChange={(e) => onInputChange(key, e.target.value)}
            placeholder={placeholder}
            className="w-full p-3 border border-gray-300 rounded-lg mt-4"
          />
        );

      case 'textarea':
        return (
          <textarea
            ref={inputRef}
            value={formData[key] || ''}
            onChange={(e) => onInputChange(key, e.target.value)}
            placeholder={placeholder}
            className="w-full p-3 border border-gray-300 rounded-lg mt-4 h-32"
          />
        );

      case 'select':
        return (
          <div className="mt-4 space-y-2 w-full">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => onInputChange(key, option)}
                className={`block w-full text-left px-4 py-3 rounded-lg border transition-colors duration-200 ease-in-out
                    ${formData[key] === option
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'}`}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center border ${formData[key] === option
                      ? 'border-white bg-white'
                      : 'border-gray-400 bg-white'
                    }`}>
                    {formData[key] === option && (
                      <div className="w-3 h-3 rounded-full bg-gray-900"></div>
                    )}
                  </div>
                  <span className="font-medium">{option}</span>
                </div>
              </button>
            ))}
          </div>
        );

      case 'multiselect':
        return (
          <div className="mt-4 space-y-2 w-full">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => onMultiSelectChange(key, option)}
                className={`block w-full text-left px-4 py-3 rounded-lg border transition-colors duration-200 ease-in-out
                    ${formData[key]?.includes(option)
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'}`}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-sm mr-3 flex items-center justify-center border ${formData[key]?.includes(option)
                      ? 'border-white bg-white'
                      : 'border-gray-400 bg-white'
                    }`}>
                    {formData[key]?.includes(option) && (
                      <svg className="w-3 h-3 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    )}
                  </div>
                  <span className="font-medium">{option}</span>
                </div>
              </button>
            ))}
          </div>
        );

      case 'tags':
        const skills = formData[key] || [];
        return (
          <div className="mt-4 w-full">
            <div className="relative w-full">
              <input
                type="text"
                value={skillInputValue}
                onChange={(e) => setSkillInputValue(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                placeholder="Add a skill and press Enter"
                className="w-full p-3 border border-gray-300 rounded-lg mt-4 h-12 box-border"
                style={{ minHeight: '48px', fontSize: '1rem' }}
              />
            </div>

            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center bg-gray-900 text-sm font-medium text-white px-3 py-1 rounded-full"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      className="ml-1 flex items-center justify-center text-white hover:text-red-300"
                      onClick={() => removeSkill(skill)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                {skills.length > 0 && (
                  <button
                    type="button"
                    onClick={removeAllSkills}
                    className="text-xs text-gray-500 hover:text-gray-700 flex items-center mt-1"
                  >
                    Clear all
                  </button>
                )}
              </div>
            )}
            {skills.length >= 5 && (
              <p className="text-xs text-gray-500 mt-1">Maximum of 5 skills reached</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-start w-full">
      <h2 className="text-2xl font-semibold mb-4">{question}</h2>
      {renderInputField()}
    </div>
  );
};

export default OnboardingStep;