import "./select_opt_container.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { deleteOption, patchOption } from "../../api/axios";
import useData from "../../hooks/useData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGripVertical, faXmark } from "@fortawesome/free-solid-svg-icons";

const SelectOptContainer = ({questionIndex, optionIndex, type, handleDrop, setDragItem, setOverItem}) => {

    // Log In url.
    const LOGIN_URL = '/login';

    // Hook to get authentication creds.
    const { auth, setAuth } = useAuth();

    // Hook used to navigate to other pages.
    const navigate = useNavigate();

    // Hook to get the Form's data from the context.
    const { form, setForm } = useData();

    // State to track the current state of the Option's value.
    const [value, setValue] = useState(form.questions[questionIndex].options[optionIndex].value);

    // State to track the Option value's input focus.
    const [valueFocus, setValueFocus] = useState(false);

    // State to track the Option value's input hover.
    const [valueHover, setValueHover] = useState(false);

    useEffect(() => {
        // Function to send the PATCH request.
        const saveValue = async () => {
            try {
                const response = await patchOption(
                    form.id, 
                    form.questions[questionIndex].id, 
                    form.questions[questionIndex].options[optionIndex].id,
                    auth.access, 
                    {'value': value}
                );
                
                console.log(response);

                if(response?.status === 200){
                    let updatedQuestions = form.questions;
                    updatedQuestions[questionIndex].options = form.questions[questionIndex].options.map(
                        (option, i) => {
                            if(i===optionIndex){
                                option.value = value;
                            }
                            return option;
                        }
                    );
                    

                    setForm({...form, questions: updatedQuestions});
                }
            } catch (err) {
                if(!err.response){
                    console.log("No Server Response.");
                } else if(err.response?.status === 401){
                    if(err.response.data.code === "token_not_valid"){
                        localStorage.removeItem("auth");
                        setAuth({});
                        navigate(LOGIN_URL);
                    }
                }
            }
        };

        // Start a 1.5sec timer.
        let timer = setTimeout(() => {

            // If the value input is focused and value is not empty,
            // send the PATCH request.
            if(valueFocus && value !== "")
                saveValue();
        }, 1500);

        // Clear the timer if the component is unmounted before the
        // 1.5sec are due.
        return () => clearTimeout(timer);
    },[value]);

    const handleDelete = () => {

        const removeOption = async () => {
            try {
                const response = await deleteOption(
                    form.id,
                    form.questions[questionIndex].id,
                    form.questions[questionIndex].options[optionIndex].id,
                    auth.access
                );

                if(response?.status === 204){
                    const updatedOptions = 
                        form
                        .questions[questionIndex]
                        .options
                        .filter(option => (
                            option.id !== form.questions[questionIndex].options[optionIndex].id
                        ));
                    
                    const updatedQuestions = form.questions;
                    updatedQuestions[questionIndex].options = updatedOptions;

                    setForm({...form, questions: updatedQuestions});
                }
            } catch (err) {
                if(!err.response){
                    console.log("No Server Response.");
                } else if(err.response?.status === 401){
                    if(err.response.data.code === "token_not_valid"){
                        localStorage.removeItem("auth");
                        setAuth({});
                        navigate(LOGIN_URL);
                    }
                }
            }
        };

        removeOption();
    };

    return (
        <div 
            className={`option-container ${valueFocus ? "option-focused" : ""}`}
            onMouseOverCapture={() => setValueHover(true)}
            onMouseOut={() => setValueHover(false)}

            onDragStart={() => {setDragItem(optionIndex)}}
            onDragEnter={() => {setOverItem(optionIndex)}}
            onDragEnd={handleDrop}
            onDragOver={e => e.preventDefault()}
            draggable
        >
            <input 
                className="option-action"
                type={type === 0 ? "checkbox" : "radio"}
                disabled
            />
            <input
                className="option-value"
                type="text"
                value={value}
                onFocus={() => setValueFocus(true)}
                onBlur={() => setValueFocus(false)}
                onChange={(e) => setValue(e.target.value)}
            />
            <div 
                className={valueHover ? "delete-opt-button" : "delete-opt-button hidden"}
                onClick={handleDelete}
            >
                <FontAwesomeIcon icon={faXmark} />
            </div>
        </div>
    );
};

export default SelectOptContainer;