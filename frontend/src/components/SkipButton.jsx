import { useEffect, useState } from "react";
import Skip from "../assets/skip.svg";

const SkipButton = () => {
    return (
        <div>
            <img src={Skip} className="w-10 h-10"/>
        </div>
    )
};

export default SkipButton;