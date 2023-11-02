import { Outlet, useNavigate } from "react-router-dom"
import useAuth from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { DataProvider } from "../context/DataContext";


const RequireAuth = () => {

    const { auth } = useAuth();
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        if(!auth?.access){
            navigate('/login');
        }
        setIsLoading(false);
    },[]);

    return (
        <>
            {
                !isLoading ? (
                    <DataProvider>
                        <Outlet />
                    </DataProvider>
                ) : (
                    <p>Loading...</p>
                )
            }
        </>
    )
};

export default RequireAuth;