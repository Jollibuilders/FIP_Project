import React from 'react';
import SkillTags from "../SkillTags.jsx";

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
          onChange={(e) => {
            const newValue = Math.max(0, parseInt(e.target.value, 10) || 0);
            setFormData({ ...formData, yearsOfExperience: newValue });
          }}
          className="w-full h-12 border border-gray-200 rounded-md text-sm focus:border-gray-900 focus:ring-0 transition-colors px-3"
          placeholder="Enter your amount of experience"
        />
      </div>

      <SkillTags
        skills={formData.keySkills}
        setSkills={(updatedSkills) => setFormData({ ...formData, keySkills: updatedSkills })}
      />
    </div>
  )
}

export default ProfessionalDetails;