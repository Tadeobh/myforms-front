import { Outlet, useNavigate } from "react-router-dom"
import useAuth from "../hooks/useAuth";
import { useEffect, useState } from "react";


const RequireNoAuth = () => {

    const { auth } = useAuth();
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        if(auth?.access){
            navigate('/');
        }
        setIsLoading(false);
    },[]);

    return (
        <>
            {
                !isLoading ? (
                    
                    <Outlet />
                ) : (
                    <p>Loading...</p>
                )
            }
        </>
    )
};

export default RequireNoAuth;