import "./navbar.css";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Logo from "../logo/Logo";

const Navbar = () => {

    const {auth, setAuth} = useAuth();

    const DASH_URL = '/';
    const REGISTER_URL = '/register';
    const LOGIN_URL = '/login';
    const navigate = useNavigate();

    const logOut = (e) => {
        e.preventDefault();

        localStorage.removeItem("auth");
        setAuth({});
        navigate(LOGIN_URL);
    };

    return (
        <>
            {
                auth.access ? (
                    <div className='navbar-container'>
                        <Logo url={DASH_URL} />
                        <div className='ms-auto'>{auth.username}</div>
                        <div className='navbar-divider vr'/>
                        <div ><Link className="navbar-auth-link" onClick={logOut}>Log Out</Link></div>
                    </div>
                ) : (
                    <div className='navbar-container'>
                        <Logo url={DASH_URL} />
                        <div className='ms-auto'>{<Link className="navbar-auth-link" to={LOGIN_URL}>Log In</Link>}</div>
                        <div className='navbar-divider vr'/>
                        <div ><Link className="navbar-auth-link" to={REGISTER_URL}>Register</Link></div>
                    </div>
                )
            }
        </>
    );
};

export default Navbar;