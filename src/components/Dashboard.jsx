import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import useData from "../hooks/useData";
import { getFormsList } from "../api/Form.services";
import FormCard from "./FormCard/FormCard";

const Dashboard = () => {

    const LOGIN_URL = '/login';
    const FORM_URL = '/form/';

    const navigate = useNavigate();

    const { auth, setAuth } = useAuth();

    const { formList, setFormList } = useData();

    useEffect(() => {
        const fetchForms = async () => {
            if(auth.access != null){
                try {
                    const response = await getFormsList(auth.access);
                    setFormList(response.data);
                } catch (err) {
                    if (err.response?.status === 401 ){
                        if(err.response.data.code === "token_not_valid"){
                            console.log(auth);
                            localStorage.removeItem("auth");
                            setAuth({});
                            navigate(LOGIN_URL);
                        }
                    } else {
                        console.log(err);
                    }
                }
            }
        }
        
        fetchForms();
    }, [auth]);

    return (
        <>
            <section id="dashboard-container">
                <h1 className="main-title">Welcome, {auth.username}.</h1>
                <ul className="form-cards-container">
                    {
                        formList.map((form) => (
                                <FormCard key={form.id} form={form} />
                            )
                        )
                    }
                </ul>
            </section>
        </>
    );
}

export default Dashboard;