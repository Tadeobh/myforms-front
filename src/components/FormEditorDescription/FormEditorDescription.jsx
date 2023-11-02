import { useEffect, useState,useRef } from "react";
import "./form_editor_description.css";
import useAuth from "../../hooks/useAuth";

import { patchForm } from "../../api/axios";
import { useNavigate } from "react-router-dom";
import useFormData from "../../hooks/useFormData";
import useData from "../../hooks/useData";

const FormEditorDescription = () => {

    // useAuth hook to get the authentication creds from the user.
    const {auth} = useAuth();

    // URL of the Log In page. 
    const LOGIN_URL = '/login';

    // Hook used to redirect the user to other pages.
    const navigate = useNavigate();

    // Get the Form's data from the FormDataContext.
    const { form, setForm } = useData();

    // description is a temporary state used to display the current description
    // in the Form, and to synchronize the Form's state when it is
    // updated in the backend.
    const [description, setDescription] = useState(form.description);

    // descFocus is used to know when the Description input is focused.
    const [descFocus, setDescFocus] = useState(false);

    // useRef hook used to reference the Description's Text Area.
    const textAreaRef = useRef(null);

    useEffect(() => {

        // Function to send the PATCH request.
        const patchDesc = async () => {
            try {
                const response = await patchForm(form.id, auth.access, {'description': description});

                console.log("Form Desc changed: " + description);

                if(response?.status === 200){
                    const newForm = {...form, description: description}
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

            // If the Description input is focused and description is not empty,
            // send the PATCH request.
            if(descFocus && description !== "")
                patchDesc();
        }, 1500);

        // Clear the timer if the component is unmounted before the
        // 1.5sec are due.
        return () => clearTimeout(timer);
    }, [description]);

    // Resize the description's textarea, if needed, every time the description changes.
    useEffect(() => {
        if(textAreaRef.current){
            textAreaRef.current.style.height = "0px";
            const scrollHeight = textAreaRef.current.scrollHeight;
            textAreaRef.current.style.height = (scrollHeight+2) +"px";
        }
    },[description])

    // Function to update the Form every time the Description's text box is changed.
    const handleDescription = (e) => {
        const value = e.target.value;
        if(value.length <=511){
            setDescription(value);
        }
    };

    return (
        <>
            <textarea 
                type="text"
                ref={textAreaRef}
                rows={1}
                className="desc-input"
                placeholder="Enter a description here..."
                value={description}
                onFocus={() => setDescFocus(true)}
                onBlur={() => setDescFocus(false)}
                onChange={handleDescription}
            />
        </>
    );
};

export default FormEditorDescription;