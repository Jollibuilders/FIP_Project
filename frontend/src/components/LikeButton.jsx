import { useState, useEffect } from "react";
import Heart from "../assets/heart.svg";

const LikeButton = ({ onClick }) => {
    return (
        <button onClick={onClick}>
            <img src={Heart} className="w-10 h-10"/>
        </button>
    )
};

export default LikeButton;