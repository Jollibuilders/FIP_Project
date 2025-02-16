import React from 'react';

const JobPreferences = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="desiredJobTitle" className="block text-sm font-medium text-gray-700 mb-1">
          Desired Job Title
        </label>
        <input
          type="text"
          name="desiredJobTitle"
          id="desiredJobTitle"
          value={formData.desiredJobTitle}
          onChange={handleChange}
          className="w-full h-12 border border-gray-200 rounded-md text-sm focus:border-gray-900 focus:ring-0 transition-colors px-3"
          placeholder="Enter your desired job title"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700 mb-1">
          Employment Type
        </label>
        <select
          name="employmentType"
          id="employmentType"
          value={formData.employmentType}
          onChange={handleChange}
          className="w-full h-12 border border-gray-200 rounded-md text-sm focus:border-gray-900 focus:ring-0 transition-colors px-3">
          <option value="">Select an option</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
          <option value="Internship">Internship</option>
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="desiredLocation" className="block text-sm font-medium text-gray-700 mb-1">
          Desired Location
        </label>
        <select
          name="desiredLocation"
          id="desiredLocation"
          value={formData.desiredLocation}
          onChange={handleChange}
          className="w-full h-12 border border-gray-200 rounded-md text-sm focus:border-gray-900 focus:ring-0 transition-colors px-3">
          <option value="">Select an option</option>
          <option value="Remote">Remote</option>
          <option value="Hybrid">Hybrid</option>
          <option value="On-Site">On-Site</option>
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-1">
          Resume
        </label>
        <input
          type="file"
          name="resume"
          id="resume"
          accept=".pdf"
          onChange={handleChange}
          className="w-full h-12 border border-gray-200 rounded-md text-sm focus:border-gray-900 focus:ring-0 transition-colors px-3"
        />
      </div>
    </div>
  )
}

export default JobPreferences;