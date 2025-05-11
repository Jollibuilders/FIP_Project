import { useEffect, React } from "react";
import profile from "../../assets/test_image.jpg";

const TopUserCard = ({ name }) => {
    return (
        <div className="flex flex-row px-6 items-center w-full h-14 rounded-xl shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] bg-white mb-6">
            <img src={profile} alt="User Profile" className="w-10 h-auto rounded-full mr-4" />
            <span className="font-semibold">{name}</span>
        </div>
    );
};

export default TopUserCard;