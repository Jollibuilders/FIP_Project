import React from 'react';

const ProfessionalDetails = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="school" className="block text-sm font-medium text-gray-700 mb-1">
          School
        </label>
        <input
          type="text"
          name="school"
          id="school"
          value={formData.school}
          onChange={handleChange}
          className="w-full h-12 border border-gray-200 rounded-md text-sm focus:border-gray-900 focus:ring-0 transition-colors px-3"
          placeholder="Enter your school"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="currentJobTitle" className="block text-sm font-medium text-gray-700 mb-1">
          Current Job Title
        </label>
        <input
          type="text"
          name="currentJobTitle"
          id="currentJobTitle"
          value={formData.currentJobTitle}
          onChange={handleChange}
          className="w-full h-12 border border-gray-200 rounded-md text-sm focus:border-gray-900 focus:ring-0 transition-colors px-3"
          placeholder="Enter your current job title"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700 mb-1">
          Years of Experience
        </label>
        <input
          type="number"
          name="yearsOfExperience"
          id="yearsOfExperience"
          value={formData.yearsOfExperience}
          onChange={handleChange}
          className="w-full h-12 border border-gray-200 rounded-md text-sm focus:border-gray-900 focus:ring-0 transition-colors px-3"
          placeholder="Enter your amount of experience"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="keySkills" className="block text-sm font-medium text-gray-700 mb-1">
          Key Skills
        </label>
        <input
          type="text"
          name="keySkills"
          id="keySkills"
          value={formData.keySkills}
          onChange={handleChange}
          className="w-full h-12 border border-gray-200 rounded-md text-sm focus:border-gray-900 focus:ring-0 transition-colors px-3"
          placeholder="Skills (Up to five)"
        />
      </div>
    </div>
  )
}

export default ProfessionalDetails;