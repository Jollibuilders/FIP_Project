import React from 'react';
import RoleTags from "../RoleTags.jsx";

const employmentOptions = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship"
];

const locationOptions = [
  "Remote",
  "Hybrid",
  "On-Site"
]

const RecruiterDetails = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEmploymentTypeChange = (option) => {
    const currentTypes = formData.companyEmploymentType || [];

    if (currentTypes.includes(option)) {
      setFormData({ ...formData, companyEmploymentType: currentTypes.filter(item => item !== option) });
    } else {
      setFormData({ ...formData, companyEmploymentType: [...currentTypes, option] });
    }
  };

  const handleLocationTypeChange = (option) => {
    const currentLocations = formData.companyLocation || [];

    if (currentLocations.includes(option)) {
      setFormData({ ...formData, companyLocation: currentLocations.filter(item => item !== option) });
    } else {
      setFormData({ ...formData, companyLocation: [...currentLocations, option] });
    }
  };

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
          Company Name
        </label>
        <input
          type="text"
          name="companyName"
          id="companyName"
          value={formData.companyName}
          onChange={handleChange}
          className="w-full h-12 border border-gray-200 rounded-md text-sm focus:border-gray-900 focus:ring-0 transition-colors px-3"
          placeholder="Enter your company's name"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="companySize" className="block text-sm font-medium text-gray-700 mb-1">
          Company Size
        </label>
        <select
          name="companySize"
          id="companySize"
          value={formData.companySize}
          onChange={handleChange}
          className="w-full h-12 border border-gray-200 rounded-md text-sm px-3 focus:border-gray-900 focus:ring-0 transition-colors"
        >
          <option value="">Select size</option>
          <option value="Small">Small (1-50 employees)</option>
          <option value="Medium">Medium (51-200 employees)</option>
          <option value="Large">Large (200+ employees)</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Company Employment Types
        </label>
        <div className="grid grid-cols-2 mt-2 gap-2">
          {employmentOptions.map((option) => (
            <label key={option} className="flex items-center gap-2">
              <input
                type="checkbox"
                name="companyEmploymentType"
                value={option}
                checked={formData.companyEmploymentType?.includes(option) || false}
                onChange={() => handleEmploymentTypeChange(option)}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <span className="text-sm">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="companyLocation" className="block text-sm font-medium text-gray-700 mb-1">
          Location Types
        </label>
        <div className="grid grid-cols-2 mt-2 gap-2">
          {locationOptions.map((option) => (
            <label key={option} className="flex items-center gap-2">
              <input
                type="checkbox"
                name="companyLocation"
                value={option}
                checked={formData.companyLocation?.includes(option) || false}
                onChange={() => handleLocationTypeChange(option)}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <span className="text-sm">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <RoleTags
        roles={formData.rolesHiringFor}
        setRoles={(updatedRoles) => setFormData({...formData, rolesHiringFor: updatedRoles})}
      />

      <div className="mt-4 mb-4">
        <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
          Contact Email
        </label>
        <input
          type="email"
          name="contactEmail"
          id="contactEmail"
          value={formData.contactEmail}
          onChange={handleChange}
          className="w-full h-12 border border-gray-200 rounded-md text-sm px-3 focus:border-gray-900 focus:ring-0 transition-colors"
          placeholder="Enter your contact email"
        />
      </div>
    </div>
  )
}

export default RecruiterDetails;