import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import image from '../assets/test_image.jpg';

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
        {/* Gray banner with name and info */}
        <div className="bg-[#f0f0f0] h-44 w-full relative rounded-md z-0">
          <div className="absolute inset-0 flex items-end pb-0 max-w-5xl mx-auto px-4">
            <div className="ml-46">
              <h1 className="text-2xl font-bold text-black">
              {profileData.fullName || "No Name"}{" "}
                </h1>
                <p className="text-md font-medium text-black">
                {profileData.currentJobTitle || "Role Title"} @{" "}
                {profileData.school || profileData.companyName || "N/A"}
                </p>
              <p className="text-sm text-gray-700">{profileData.location || "N/A"}</p>
            </div>
          </div>
        </div>
  
        {/* Main layout (everything below the banner) */}
        <div className="max-w-5xl mx-auto px-4 -mt-20">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Column – Profile Picture + Mentoring Topics */}
            <div className="md:w-1/4 flex flex-col items-center md:items-center">
              {/* Profile Picture centered between banner and box */}
              <div className="relative z-10 mb-[-68px]">
              <div className="w-28 h-28 rounded-full bg-black border-4 border-white overflow-hidden">
                <img
                    src={image}
                    alt="Profile"
                    className="w-full h-full object-cover"
                />
                </div>
              </div>
  
              {/* Mentoring Topics Box */}
              <div className="bg-[#f4ede5] p-4 pt-6 mt-10 w-full rounded-md text-center">
                <h2 className="font-bold text-lg mb-3">Mentoring Topics</h2>
                <div className="flex flex-wrap justify-center gap-2">
                    {profileData.keySkills && profileData.keySkills.length > 0 ? (
                        profileData.keySkills.map((topic, idx) => (
                        <span
                            key={idx}
                            className="bg-[#cbb799] px-3 py-1 rounded-full text-sm"
                        >
                            {topic}
                        </span>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">No mentoring topics listed.</p>
                    )}
                    </div>
  
                {/* uknown box */}
                <div className="bg-[#cbb799] w-full h-24 mt-4 rounded-md" />
              </div>
            </div>
  
            {/* Right Column – Bio + Experience */}
            <div className="flex-1 space-y-6 mt-15">
              {/* Bio Section */}
              <div className="bg-[#f4ede5] p-4 rounded-md mt-6">
                <h2 className="font-bold mb-2">Currently looking for...</h2>
                <p className="text-sm">
                  {profileData.aboutMe || ' '}
                </p>
              </div>
  
              {/* Experience Sections */}
              <div className="bg-[#f4ede5] p-4 rounded-md min-h-[150px]">
                <h2 className="font-bold mb-2">Experience</h2>
              </div>
              <div className="bg-[#f4ede5] p-4 rounded-md min-h-[150px]">
                <h2 className="font-bold mb-2">Experience</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default ProfilePage;
  