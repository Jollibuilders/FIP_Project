import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import image from '../assets/test_image.jpg';
import jakesresume from '../assets/jakesresume.pdf'

const ProfilePage = () => {
    const { id } = useParams()
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

  if (isLoading) return <div className="mt-16 text-center">Loading profile...</div>;
  if (!profileData) return <div className="mt-16 text-center">Profile not found.</div>;
  return (
    <div className="max-w-5xl mx-auto mt-16">
      {/* Gray banner */}
      <div className="bg-[#F3F4F6] h-44 w-full relative rounded-md z-0">
        <div className="absolute inset-0 flex items-end pb-0 max-w-5xl mx-auto px-4">
          <div className="ml-52 flex flex-col flex-1 overflow-hidden">
            <h1 className="text-2xl font-bold text-black">
              {profileData.fullName || "No Name"}
            </h1>
            <p className="text-md font-medium text-black">
              {profileData.currentJobTitle || "Role Title"} @{" "}
              {profileData.role === "Recruiter"
                ? profileData.companyName || "No company listed"
                : profileData.school || "No school listed"}
            </p>
            <p className="text-sm text-gray-700">{profileData.location || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="max-w-5xl mx-auto px-4 -mt-20">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Left Column */}
          <div className="md:w-1/4 flex flex-col items-center md:items-center">
            <div className="relative z-10 mb-[-68px]">
              <div className="w-32 h-32 rounded-full bg-black border-4 border-white overflow-hidden">
                <img
                  src={image}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="bg-[#F3F4F6] p-4 pt-6 mt-11 w-full rounded-md text-center">
              <h2 className="font-bold text-lg mb-3">
              {profileData.role === "Recruiter" ? "Mentoring Topics" : "Skills"}
              </h2>
              <div className="flex flex-wrap justify-center gap-2">
                {profileData.keySkills && profileData.keySkills.length > 0 ? (
                  profileData.keySkills.map((topic, idx) => (
                    <span
                      key={idx}
                      className="bg-[#FFFFFF] px-3 py-1 rounded-full text-sm"
                    >
                      {topic}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    {profileData.role === "Recruiter"
                      ? "No mentoring topics listed."
                      : "No skills listed."}
                  </p>
                )}
              </div>

              <div className="bg-[#FFFFFF] w-full h-24 mt-4 rounded-md" />
            </div>
          </div>

          {/* Right Column */}
          <div className="flex-1 space-y-6 mt-20">
            <div className="bg-[#F3F4F6] p-4 rounded-md mt-6">
              <h2 className="font-bold mb-2">About Me</h2>
              <p className="text-sm">{profileData.aboutMe || "No description provided."}</p>
            </div>

            {profileData.role !== "Recruiter" ? (
              <>
                <div className="bg-[#F3F4F6] p-4 rounded-md">
                  <h2 className="font-bold mb-2">Job Preferences</h2>
                  <p className="text-sm">Desired Job: {profileData.desiredJobTitle || 'N/A'}</p>
                  <p className="text-sm">Employment Type: {profileData.employmentType || 'N/A'}</p>
                  <p className="text-sm">Desired Location: {profileData.desiredLocation || 'N/A'}</p>
                </div>
                <div className="bg-[#F3F4F6] p-4 rounded-md">
                  <h2 className="font-bold mb-2">Experience</h2>
                  <p className="text-sm">{profileData.experience || 'No experience listed.'}</p>
                </div>
              </>
            ) : (
              <>
                <div className="bg-[#F3F4F6] p-4 rounded-md">
                  <h2 className="font-bold mb-2">Company Details</h2>
                  <p className="text-sm">Size: {profileData.companySize || 'N/A'}</p>
                  <p className="text-sm">Location: {profileData.companyLocation || 'N/A'}</p>
                  <p className="text-sm">Work Types: {profileData.companyLocationType?.join(', ') || 'N/A'}</p>
                  <p className="text-sm">Employment Types: {profileData.companyEmploymentType?.join(', ') || 'N/A'}</p>
                </div>
                <div className="bg-[#F3F4F6] p-4 rounded-md">
                  <h2 className="font-bold mb-2">Hiring For</h2>
                  {profileData.rolesHiringFor?.length > 0 ? (
                    <ul className="list-disc pl-5 text-sm">
                      {profileData.rolesHiringFor.map((role, idx) => (
                        <li key={idx}>{role}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm">No roles listed.</p>
                  )}
                </div>
                <div className="bg-[#F3F4F6] p-4 rounded-md">
                  <h2 className="font-bold mb-2">Experience</h2>
                  <p className="text-sm">{profileData.experience || 'No experience listed.'}</p>
                </div>
              </>
            )}

            <div className="bg-[#F3F4F6] p-4 rounded-md">
              <h2 className="font-bold mb-2">Contact</h2>
              <p className="text-sm">Email: {profileData.email || profileData.contactEmail || 'N/A'}</p>
            </div>

            {/* Resume Section */}
            <div className="bg-[#F3F4F6] p-4 rounded-md">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-bold">Resume</h2>
                <a 
                  href={jakesresume} 
                  download="Jakes_Resume.pdf"
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </a>
              </div>
              <div className="w-full h-96 border border-gray-300 rounded-md overflow-hidden">
                <object
                  data={jakesresume}
                  type="application/pdf"
                  className="w-full h-full"
                >
                  <p className="p-4 text-center">
                    Your browser doesn't support embedded PDFs.
                    <a href={jakesresume} className="text-blue-600 hover:underline ml-1">
                      Click here to view the resume instead.
                    </a>
                  </p>
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