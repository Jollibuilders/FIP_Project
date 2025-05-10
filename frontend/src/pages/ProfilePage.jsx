import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import image from '../assets/test_image.jpg';
import jakesresume from '../assets/jakesresume.pdf';
import banner from '../assets/banner.svg';

const ProfilePage = () => {
  const { id } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        const token = await user.getIdToken();

        const res = await fetch(`http://localhost:3000/profiles/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok && data.user) {
          setProfileData(data.user);
          console.log(data.user)
        } else {
          console.error("Error loading profile data.");
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="text-sm font-medium text-gray-500 tracking-wide">Loading profile...</div>
    </div>
  );
  
  if (!profileData) return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="text-sm font-medium text-gray-500 tracking-wide">Profile not found.</div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto pt-8 pb-16 px-4 sm:px-6 bg-white">
      <div className="w-full relative rounded-sm z-0 h-52 overflow-hidden">
        <img 
          src={banner} 
          alt="Profile Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-end pb-2 max-w-5xl mx-auto px-4">
          <div className="ml-36 flex flex-col flex-1 overflow-hidden">
            <h1 className="text-lg font-semibold text-white tracking-tight">
              {profileData.fullName || "No Name"}
            </h1>
            <p className="text-sm text-white">
              {profileData.currentJobTitle || "Role Title"} @{" "}
              {profileData.role === "Recruiter"
                ? profileData.companyName || "No company listed"
                : profileData.school || "No school listed"}
            </p>
            <p className="text-xs text-white mt-1">{profileData.location || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="max-w-5xl mx-auto -mt-20">
        <div className="relative z-10 flex justify-center md:justify-start md:pl-6 mb-6">
          <div className="w-32 h-32 rounded-full bg-white border-4 border-white overflow-hidden">
            <img
              src={image || "/placeholder.svg"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/4">
          <div className="bg-white w-full p-6 border border-gray-100 rounded-sm">
            {profileData.role === "Recruiter" && (
              <>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
                  Mentoring Topics
                </h2>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-gray-50 text-gray-700 px-3 py-1 text-xs rounded-sm border border-gray-100 transition-colors duration-200">
                    Resume Building
                  </span>
                  <span className="bg-gray-50 text-gray-700 px-3 py-1 text-xs rounded-sm border border-gray-100 transition-colors duration-200">
                    Interview Prep
                  </span>
                  <span className="bg-gray-50 text-gray-700 px-3 py-1 text-xs rounded-sm border border-gray-100 transition-colors duration-200">
                    Career Switching
                  </span>
                  <span className="bg-gray-50 text-gray-700 px-3 py-1 text-xs rounded-sm border border-gray-100 transition-colors duration-200">
                    Job Search
                  </span>
                  <span className="bg-gray-50 text-gray-700 px-3 py-1 text-xs rounded-sm border border-gray-100 transition-colors duration-200">
                    Networking
                  </span>
                </div>

                {/* Separator */}
                <hr className="border-t border-gray-200 my-6" />
              </>
            )}

            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {profileData.keySkills?.map((skill) => (
                <span
                  key={skill}
                  className="bg-gray-50 text-gray-700 px-3 py-1 text-xs rounded-sm border border-gray-100 transition-colors duration-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>


          {/* Right Column */}
          <div className="flex-1">
            {/* About Me Section*/}
            <div className="bg-white p-6 border border-gray-100 rounded-sm">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">About Me</h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                {profileData.aboutMe || "No about me section included."}
              </p>
            </div>

            {profileData.role !== "Recruiter" ? (
              <div className="space-y-6 mt-6">
                <div className="bg-white p-6 border border-gray-100 rounded-sm">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Job Preferences</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Desired Job</p>
                      <p className="text-sm text-gray-800">{profileData.desiredJobTitle || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Employment Type</p>
                      <p className="text-sm text-gray-800">{profileData.employmentType || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Desired Location</p>
                      <p className="text-sm text-gray-800">{profileData.desiredLocation || 'N/A'}</p>
                    </div>
                  </div>
                </div>
            
              </div>
            ) : (
              <div className="space-y-6 mt-6">
                <div className="bg-white p-6 border border-gray-100 rounded-sm">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Company Details</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Company Size</p>
                      <p className="text-sm text-gray-800">{profileData.companySize || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Location</p>
                      <p className="text-sm text-gray-800">{profileData.companyLocation || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Work Types</p>
                      <p className="text-sm text-gray-800">{profileData.companyLocationType?.join(', ') || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Employment Types</p>
                      <p className="text-sm text-gray-800">{profileData.companyEmploymentType?.join(', ') || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 border border-gray-100 rounded-sm">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Hiring For</h2>
                  {profileData.rolesHiringFor?.length > 0 ? (
                    <ul className="space-y-2">
                      {profileData.rolesHiringFor.map((role, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="inline-block w-1 h-1 rounded-full bg-gray-400 mt-2 mr-2"></span>
                          <span className="text-sm text-gray-700">{role}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No roles listed.</p>
                  )}
                </div>
              </div>
            )}

            {/* Contact Section */}
            <div className="bg-white p-6 border border-gray-100 rounded-sm mt-6">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Contact</h2>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href={`mailto:${profileData.email || profileData.contactEmail}`} className="text-sm text-gray-700 hover:text-gray-900 transition-colors duration-200">
                  {profileData.email || profileData.contactEmail || 'N/A'}
                </a>
              </div>
            </div>

            {/* Resume Section */}
            <div className="bg-white p-6 border border-gray-100 rounded-sm mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Resume</h2>
                <a 
                  href={jakesresume} 
                  download="Jakes_Resume.pdf"
                  className="text-xs text-gray-700 flex items-center hover:text-gray-900 transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </a>
              </div>
              <div className="w-full h-[800px] border border-gray-100 rounded-sm overflow-hidden">
                <object
                  data={jakesresume}
                  type="application/pdf"
                  className="w-full h-full"
                >
                  <div className="p-8 text-center bg-gray-50 h-full flex flex-col items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-xs text-gray-500 mb-4">
                      Your browser doesn't support embedded PDFs.
                    </p>
                    <a href={jakesresume} className="text-xs text-gray-700 hover:text-gray-900 border border-gray-300 px-4 py-2 rounded-sm hover:bg-gray-50 transition-colors duration-200">
                      View Resume
                    </a>
                  </div>
                </object>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
  
export default ProfilePage;