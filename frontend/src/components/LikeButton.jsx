import { useState, useEffect } from "react";
import Heart from "../assets/heart.svg";

const LikeButton = ({ onClick }) => {
    return (
        <button onClick={onClick}>
            <img src={Heart} className="w-8 h-8"/>
        </button>
    )
};

export default LikeButton;