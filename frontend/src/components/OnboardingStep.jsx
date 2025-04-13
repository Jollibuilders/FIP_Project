import React from 'react';

const OnboardingStep = ({questionData, onAnswerSelect, currentAnswer}) => {
  const { question, description, options } = questionData;

  return (
    <div className="flex flex-col items-start">
      <h2 className={`text-2xl font-semibold mb-2 ${!description && 'mb-8'}`}>{question}</h2>
      {description && <p className="mb-8 text-md text-gray-600">{description}</p>}

      {options && options.map((option) => (
        <button
          key={option}
          onClick={() => onAnswerSelect(option)}
          className={`block w-full text-left px-4 py-3 my-1 mb-2 rounded-full 
            ${currentAnswer === option ? 'bg-gray-900 text-white' : 'bg-gray-200 text-black'}`}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default OnboardingStep;
