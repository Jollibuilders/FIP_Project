import { useEffect, useState } from "react";
import Skip from "../assets/skip.svg";

const SkipButton = ({ onClick }) => {
    return (
        <button onClick={onClick}>
            <img src={Skip} className="w-10 h-10"/>
        </button>
    )
};

export default SkipButton;