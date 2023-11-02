import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./add_question_button.css";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { createQuestion } from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import useData from "../../hooks/useData";

const AddQuestionButton = () => {

    // Log In url.
    const LOGIN_URL = '/login';

    // Hook used to get authentication creds.
    const { auth, setAuth } = useAuth();

    const { form, setForm } = useData();
    
    const onClickHandler = async () => {
        try {
            const response = await createQuestion(
                form.id,
                auth.access,
                {
                    type: "text",
                    options: [],
                }
            );

            console.log(response);

            if(response?.status === 201){
                const updatedQuestions = form.questions;
                updatedQuestions.push({...response.data});
                console.log(updatedQuestions);
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
                className="add-question-button"
                onClick={onClickHandler}
            >
                <FontAwesomeIcon icon={faPlus}/> Question
            </button>
        </>
    );
};

export default AddQuestionButton;