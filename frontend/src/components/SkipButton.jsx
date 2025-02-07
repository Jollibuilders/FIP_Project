import { useEffect, useState } from "react";
import Skip from "../assets/skip.svg";

const SkipButton = ({ onClick }) => {
    return (
        <button onClick={onClick}>
            <img src={Skip} className="w-8 h-8"/>
        </button>
    )
};

export default SkipButton;