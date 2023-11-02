import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { Outlet } from "react-router-dom";

const SessionHandler = () => {

    const {setAuth} = useAuth();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const accessCreds = JSON.parse(localStorage.getItem("auth"));

        if (accessCreds?.access != null){
            setAuth(accessCreds);
        }

        setIsLoading(false);

    }, []);

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

export default SessionHandler;