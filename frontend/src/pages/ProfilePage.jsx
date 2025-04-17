import { useParams } from 'react-router-dom';

const ProfilePage = () => {
    const { id } = useParams()
    return (
<div className="max-w-5xl mx-auto mt-16">
        {/* Gray banner with name and info */}
        <div className="bg-[#f0f0f0] h-44 w-full relative rounded-md z-0">
          <div className="absolute inset-0 flex items-end pb-0 max-w-5xl mx-auto px-4">
            <div className="ml-46">
              <h1 className="text-2xl font-bold text-black">
                Test User <span className="text-sm text-gray-500">(they/them)</span>
              </h1>
              <p className="text-md font-medium text-black">Role Title @ Test University</p>
              <p className="text-sm text-gray-700">Test City, USA</p>
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
                <div className="w-28 h-28 rounded-full bg-[#3b2b1b] border-4 border-white" />
              </div>
  
              {/* Mentoring Topics Box */}
              <div className="bg-[#f4ede5] p-4 pt-6 mt-10 w-full rounded-md text-center">
                <h2 className="font-bold text-lg mb-3">Mentoring Topics</h2>
                <div className="flex flex-wrap justify-center gap-2">
                  {[
                    "Product Management",
                    "UI Design",
                    "Leadership",
                    "UX Engineering",
                    "Career Growth",
                  ].map((topic, idx) => (
                    <span
                      key={idx}
                      className="bg-[#cbb799] px-3 py-1 rounded-full text-sm"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
  
                {/* Optional filler box */}
                <div className="bg-[#cbb799] w-full h-24 mt-4 rounded-md" />
              </div>
            </div>
  
            {/* Right Column – Bio + Experience */}
            <div className="flex-1 space-y-6 mt-15">
              {/* Bio Section */}
              <div className="bg-[#f4ede5] p-4 rounded-md mt-6">
                <h2 className="font-bold mb-2">Currently looking for...</h2>
                <p className="text-sm">
                  This is a test bio. Here is where the user's summary or “About Me” would go.
                  It includes things like current goals, passions, and what they’re looking for.
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
  