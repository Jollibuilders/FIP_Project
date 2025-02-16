import React from 'react';

const AboutMe = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="aboutMe" className="block text-sm font-medium text-gray-700 mb-1">
          About Me
        </label>
        <textarea
          name="aboutMe"
          id="aboutMe"
          value={formData.aboutMe}
          onChange={handleChange}
          className="w-full h-32 border border-gray-200 rounded-md text-sm focus:border-gray-900 focus:ring-0 transition-colors px-3"
          placeholder="Tell us about yourself"
        />
      </div>
    </div>
  )
}

export default AboutMe;