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
    const currentLocations = formData.companyLocationType || [];

    if (currentLocations.includes(option)) {
      setFormData({ ...formData, companyLocationType: currentLocations.filter(item => item !== option) });
    } else {
      setFormData({ ...formData, companyLocationType: [...currentLocations, option] });
    }
  };

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
          <span className="text-red-600">* </span>
          Company Name
        </label>
        <input
          type="text"
          name="companyName"
          id="companyName"
          value={formData.companyName}
          onChange={handleChange}
          required
          className="w-full h-12 border border-gray-200 rounded-md text-sm focus:border-gray-900 focus:ring-0 transition-colors px-3"
          placeholder="Enter your company's name"
        />
      </div>

      {/* Company Location (City, Country) */}
      <div className="mb-4">
        <label htmlFor="companyLocation" className="block text-sm font-medium text-gray-700 mb-1">
          <span className="text-red-600">* </span>
          Company Location (City, Country)
        </label>
        <input
          type="text"
          name="companyLocation"
          id="companyLocation"
          value={formData.companyLocation}
          onChange={handleChange}
          className="w-full h-12 border border-gray-200 rounded-md text-sm focus:border-gray-900 focus:ring-0 transition-colors px-3"
          placeholder="Enter your company's city and country"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="companySize" className="block text-sm font-medium text-gray-700 mb-1">
          <span className="text-red-600">* </span>
          Company Size
        </label>
        <select
          name="companySize"
          id="companySize"
          value={formData.companySize}
          onChange={handleChange}
          required
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
          <span className="text-red-600">* </span>
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
                required
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <span className="text-sm">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="companyLocationType" className="block text-sm font-medium text-gray-700 mb-1">
          <span className="text-red-600">* </span>
          Location Types
        </label>
        <div className="grid grid-cols-2 mt-2 gap-2">
          {locationOptions.map((option) => (
            <label key={option} className="flex items-center gap-2">
              <input
                type="checkbox"
                name="companyLocationType"
                value={option}
                checked={formData.companyLocationType?.includes(option) || false}
                onChange={() => handleLocationTypeChange(option)}
                required
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
          <span className="text-red-600">* </span>
          Contact Email
        </label>
        <input
          type="email"
          name="contactEmail"
          id="contactEmail"
          value={formData.contactEmail}
          onChange={handleChange}
          required
          className="w-full h-12 border border-gray-200 rounded-md text-sm px-3 focus:border-gray-900 focus:ring-0 transition-colors"
          placeholder="Enter your contact email"
        />
      </div>
    </div>
  )
}

export default RecruiterDetails;