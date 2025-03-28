import React, { useState } from 'react';
import { HiOutlineUser } from 'react-icons/hi';

const BasicInfo = ({ formData, setFormData, role, errors }) => {
  const [localErrors, setLocalErrors] = useState(errors || {});

  const handleChange = (e) => {
    // Excludes email from being updated (since it's autofilled)
    if (e.target.name !== 'email'){
      setFormData({ ...formData, [e.target.name]: e.target.value });
      setLocalErrors({ ...localErrors, [e.target.name]: "" });
    }
  };

  return (
    <div>
      {/* Full Name Field */}
      <div className="mb-4">
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
          <span className="text-red-600">* </span>
          Full Name
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <HiOutlineUser className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            name="fullName"
            id="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={`pl-10 w-full h-12 border rounded-md text-sm focus:ring-0 transition-colors ${
              errors?.fullName ? "border-red-500 bg-red-50 focus:border-red-600" : "border-gray-200 focus:border-gray-900"
            }`}
            placeholder="Enter your full name"
            required
          />
        </div>
      </div>

      {/* Email Field (Autofilled) */}
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          <span className="text-red-600">* </span>
          Email Address
        </label>
        <input
          type="email"
          name="email"
          id="email"
          value={formData.email}
          readOnly // non-editable to avoid unnecessary user input
          className="w-full h-12 border border-gray-200 rounded-md text-sm focus:border-gray-900 focus:ring-0 transition-colors px-3"
          placeholder="Autofilled from registration"
        />
      </div>

      {/* Location Field (Job Seekers only) */}
      {role === "Job Seeker" && (
        <div className="mb-4">
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            <span className="text-red-600">* </span>
            Location (City, Country)
          </label>
          <input
            type="text"
            name="location"
            id="location"
            value={formData.location}
            onChange={handleChange}
            className={`w-full h-12 border rounded-md text-sm focus:ring-0 transition-colors px-3 ${
              errors?.location ? "border-red-500 bg-red-50 focus:border-red-600" : "border-gray-200 focus:border-gray-900"
            }`}
            placeholder="Enter your city and country"
            required
          />
        </div>
      )}
    </div>
  );
};

export default BasicInfo;