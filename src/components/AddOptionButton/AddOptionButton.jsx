import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createOption } from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import useData from "../../hooks/useData";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import "./add_option_button.css";

const AddOptionButton = ({questionIndex}) => {

    // Log In url.
    const LOGIN_URL = '/login';

    // Hook used to get authentication creds.
    const { auth, setAuth } = useAuth();

    // Hook used to get the current Form's data.
    const { form, setForm } = useData();

    const onClickHandler = async () => {

        let lastOptPosition = 0;
        console.log(form.questions[questionIndex].options);
        form.questions[questionIndex].options.map(
            option =>
                lastOptPosition = option.position > lastOptPosition ? option.position : lastOptPosition
        );

        try {
            const response = await createOption(
                form.id,
                form.questions[questionIndex].id,
                auth.access, 
                {
                    "value": "New Option",
                    "position": lastOptPosition+1,
                }
            );

            if(response?.status === 201){
                const updatedQuestions = form.questions.map((question, i) => {
                    if(i === questionIndex){
                        question.options.push({...response.data});
                    }

                    return question
                });

                console.log(updatedQuestions)
                setForm({...form, questions: updatedQuestions});
            }
        } catch (err) {
            console.log(err);
            if(!err.response){
                console.log("No Server Response.");
            } else if(err.response?.status === 401){
                if(err.response.data.code === "token_not_valid"){
                    setAuth({});
                    localStorage.removeItem("auth");
                    navigate(LOGIN_URL);
                }
            }
        }
    };

    return (
        <>
            <button
                className="add-option-button"
                onClick={onClickHandler}
            >
                <FontAwesomeIcon icon={faPlus}/> Option
            </button>
        </>
    );
};

export default AddOptionButton;