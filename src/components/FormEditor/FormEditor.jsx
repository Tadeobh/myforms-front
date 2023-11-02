import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import InternalNav from "../InternalNav/InternalNav";

import "./form_editor.css";
import FormEditorTitle from "../FormEditorTitle/FormEditorTitle";
import FormEditorDescription from "../FormEditorDescription/FormEditorDescription";
import QuestionEditor from "../QuestionEditor/QuestionEditor";
import AddQuestionButton from "../AddQuestionButton/AddQuestionButton";

import useAuth from "../../hooks/useAuth";
import { FormDataProvider } from "../../context/FormDataContext";
import { getForm } from "../../api/Form.services";
import useData from "../../hooks/useData";

const FormEditor = () => {

    // Hook used to grab the parameters passed through the URL.
    const params = useParams();

    // Endpoint and URL used to retrieve information and
    // redirect the user.
    const LOGIN_URL = '/login';
    
    // Hook to check for authentication token.
    const {auth, setAuth} = useAuth();

    // Hook to navigate to other URLs.
    const navigate = useNavigate();

    // selectorPos will determine what to show in the FormEditor main section.
    // 0 - corresponds to Questions.
    // 1 - corresponds to Answers.
    // 2 - corresponds to Stats.
    const [selectorPos, setSelectorPos] = useState(0);

    // Get the form state from the DataContext.
    const {form, setForm} = useData();

    // State used to make sure the components are only rendered after
    // the information from the endpoint is loaded.
    const [isLoading, setIsLoading] = useState(true);

    // Send a request to the Forms endpoint to get the information from the form 
    // with the ID given through the parameters.
    useEffect(() => {
        const fetchForm = async () => {
            if(auth.access != null){
                try {
                    const response = await getForm(auth.access, params?.formId);
                    setForm(response.data);
                } catch (err) {
                    if (err.response?.status === 401 ){
                        if(err.response.data.code === "token_not_valid"){
                            localStorage.removeItem("auth");
                            setAuth({});
                            navigate(LOGIN_URL);
                        }
                    } else {
                        console.log(err);
                    }
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchForm();
    },[auth]);

    return (
        <>
            {isLoading ? 
                (
                    <p>Loading...</p>
                ):(
                    <section id="form-section">
                        <InternalNav selectorPos={selectorPos} setSelectorPos={setSelectorPos} />
                        <div id="content-container">
                            {
                                selectorPos==0 ? (
                                    <>
                                        <FormEditorTitle />
                                        <FormEditorDescription />
                                        {form.questions.map((question, i) => {
                                            return (
                                                <QuestionEditor 
                                                    key={question.id}
                                                    index={i}
                                                />
                                            );
                                        })}
                                        <AddQuestionButton />
                                    </>
                                ): selectorPos==1 ? (
                                    "Answers"
                                ): (
                                    "Stats"
                                )
                            }
                        </div>
                    </section>
                ) 
            }
        </>
    );
};

export default FormEditor;