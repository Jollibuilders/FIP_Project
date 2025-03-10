import React from 'react';
import { HiOutlineUser } from 'react-icons/hi';

const BasicInfo = ({ formData, setFormData, role }) => {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
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
            className="pl-10 w-full h-12 border border-gray-200 rounded-md text-sm focus:border-gray-900 focus:ring-0 transition-colors"
            placeholder="Enter your full name"
          />
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full h-12 border border-gray-200 rounded-md text-sm focus:border-gray-900 focus:ring-0 transition-colors px-3"
          placeholder="Enter your email address"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
          {role === "Job Seeker" ? "Location (City, Country)" : "Company Location"}
        </label>
        <input
          type="text"
          name="location"
          id="location"
          value={formData.location}
          onChange={handleChange}
          className="w-full h-12 border border-gray-200 rounded-md text-sm focus:border-gray-900 focus:ring-0 transition-colors px-3"
          placeholder={role === "Job Seeker" ? "Enter your city and country" : "Enter your company's city and country"}
        />
      </div>
    </div>
  );
};

export default BasicInfo;