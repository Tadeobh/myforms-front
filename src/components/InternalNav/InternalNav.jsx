import { useState } from "react";
import "./internal_nav.css";

const InternalNav = ({selectorPos, setSelectorPos}) => {

    return (
        <div className="internal-nav-container">
            <div 
                id="internal-nav-selector"
                className="internal-nav-option"
                style={{left: (selectorPos==0 ? 0 : selectorPos==1 ? 7.5 : selectorPos==2 ? 15 : 0) + 'rem'}}
            ></div>
            <div
                onClick={() => setSelectorPos(0)}
                className="internal-nav-option internal-nav-option-selected"
                style={{color: selectorPos==0 ? "var(--light)":"var(--black)"}}
            >Questions</div>
            <div
                onClick={() => setSelectorPos(1)}
                className="internal-nav-option"
                style={{color: selectorPos==1 ? "var(--light)":"var(--black)"}}
            >Answers</div>
            <div
                onClick={() => setSelectorPos(2)}
                className="internal-nav-option"
                style={{color: selectorPos==2 ? "var(--light)":"var(--black)"}}
            >Stats</div>
        </div>
    );
};

export default InternalNav;