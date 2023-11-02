import { Link } from "react-router-dom";

import "./logo.css";

const Logo = ({url}) => {
    return (
        <div className='logo'><Link className='logo' to={url}>myforms</Link></div>
    );
};

export default Logo;