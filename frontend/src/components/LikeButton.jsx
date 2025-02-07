import { useState, useEffect } from "react";
import Heart from "../assets/heart.svg";

const LikeButton = () => {
    return (
        <div>
            <img src={Heart} className="w-10 h-10"/>
        </div>
    )
};

export default LikeButton;