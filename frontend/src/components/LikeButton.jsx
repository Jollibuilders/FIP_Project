import { useState, useEffect } from "react";
import Heart from "../assets/heart.svg";

const LikeButton = ({ onClick }) => {
    return (
        <button className="hover:scale-130 transition-transform duration-200 ease-in-out active:scale-95" onClick={onClick}>
            <img src={Heart} className="w-8 h-8"/>
        </button>
    )
};

export default LikeButton;