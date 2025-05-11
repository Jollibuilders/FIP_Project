import { useEffect, React } from "react";
import profile from "../../assets/test_image.jpg";
import { FaCircleInfo } from "react-icons/fa6";
import { Link } from 'react-router-dom';

const TopUserCard = ({ name, id }) => {
    return (
        <div className="flex flex-row px-6 items-center w-full h-14 rounded-xl shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] bg-white mb-6">
            <img src={profile} alt="User Profile" className="w-8 h-auto rounded-full mr-4" />
            <span className="font-semibold">{name}</span>
            <Link to={`/profile/${id}`} className="ml-auto transform transition-transform duration-200 hover:scale-130 active:scale-90 font-bold text-xl">
                <FaCircleInfo className="ml-auto text-[#3D270A]"/>
            </Link>
        </div>
    );
};

export default TopUserCard;