import { useEffect, useState } from "react";
import Skip from "../assets/skip.svg";

const SkipButton = ({ onClick }) => {
    return (
        <button className="hover:scale-120 transition-transform duration-200 ease-in-out active:scale-95" onClick={onClick}>
            <img src={Skip} className="w-8 h-8"/>
        </button>
    )
};

export default SkipButton;