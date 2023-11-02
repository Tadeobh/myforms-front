import { useEffect, useRef, useState } from "react";
import "./form_editor_title.css";
import { patchForm } from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import useFormData from "../../hooks/useFormData";
import useData from "../../hooks/useData";

const FormEditorTitle = () => {

    // useAuth hook to get the authentication creds from the user.
    const {auth} = useAuth();

    // URL of the Log In page. 
    const LOGIN_URL = '/login';

    // Hook used to redirect the user to other pages.
    const navigate = useNavigate();

    // Get the Form's data from the FormDataContext.
    const { form, setForm } = useData();

    // title is a temporary state used to display the current title
    // in the Form, and to synchronize the Form's state when it is
    // updated in the backend.
    const [title, setTitle] = useState(form.title);

    // titleFocus is used to know when the Title input is focused.
    const [titleFocus, setTitleFocus] = useState(false);

    // Title input reference.
    const titleRef = useRef();

    // Every time the title is changed, and after 1.5sec of no tpying, 
    // send a PATCH request to update the Form's title.
    useEffect(() => {
        // Function to send the PATCH request.
        const saveTitle = async () => {
            try {
                const response = await patchForm(form.id, auth.access, {'title': title});

                if(response?.status === 200){
                    const newForm = {...form, title: title}
                    setForm(newForm);
                }
            } catch (err) {
                if(!err.response){
                    console.log("No Server Response.");
                } else if(err.response?.status === 401){
                    if(err.response.data.code === "token_not_valid"){
                        localStorage.removeItem("auth");
                        navigate(LOGIN_URL);
                    }
                }
            }
        };

        // Start a 1.5sec timer.
        let timer = setTimeout(() => {

            // If the Title input is focused and title is not empty,
            // send the PATCH request.
            if(titleFocus && title !== "")
                saveTitle();
        }, 1500);

        // Clear the timer if the component is unmounted before the
        // 1.5sec are due.
        return () => clearTimeout(timer);
    }, [title]);

    return (
        <>
            <input 
                type="text"
                ref={titleRef}
                className="title-input main-title"
                placeholder="Form Title"
                value={title}
                onFocus={() => setTitleFocus(true)}
                onBlur={() => setTitleFocus(false)}
                onChange={(e) => setTitle(e.target.value)}
            />
        </>
    );
};

export default FormEditorTitle;