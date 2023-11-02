import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import SelectOptContainer from '../SelectOptContainer/SelectOptContainer';
import AddOptionButton from '../AddOptionButton/AddOptionButton';

import useAuth from '../../hooks/useAuth';
import useData from '../../hooks/useData';

import { deleteQuestion, patchQuestion } from "../../api/Question.services";

import "./question_editor.css";

const QuestionEditor = ({index}) => {

    // Log In url.
    const LOGIN_URL = '/login';

    // Hook to get authentication creds.
    const {auth, setAuth} = useAuth();

    // Hook used to navigate to other pages.
    const navigate = useNavigate();

    // Get the Form's data from the FormDataContext.
    const { form, setForm } = useData();

    // Hooks to save the current state of the Question.
    const [questText, setQuestText] = useState(form.questions[index].text);
    const [questType, setQuestType] = useState(form.questions[index].type);

    // Hooks to track input focus.
    const [typeIsFocused, setTypeIsFocused] = useState(false);
    const [textIsFocused, setTextIsFocused] = useState(false);

    // References used for Drag n' Drop functionality.
    const [dragItem, setDragItem] = useState();
    const [overItem, setOverItem] = useState();

    // useEffect to update the Question's text.
    useEffect(() => {
        const patchQuestText = async () => {
            try {
                const response = await patchQuestion(
                    form.id,
                    form.questions[index].id,
                    auth.access,
                    {"text": questText}
                );
                
                console.log(response);

                if(response?.status === 200){
                    const updatedQuestions = form.questions.map((question, i) => {
                        if(i===index){
                            question.text = questText;
                        }
                        return question;
                    });
    
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

        const timer = setTimeout(() => {
            if(textIsFocused && questText !== "")
                patchQuestText();
        }, 1500);

        return () => clearTimeout(timer);
    }, [questText]);

    // useEffect to update the Question's type.
    useEffect(() => {
        const patchQuestType = async () => {
            try {
                const response = await patchQuestion(
                    form.id, 
                    form.questions[index].id,
                    auth.access, 
                    {"type": questType}
                );
    
                console.log(response);
    
                if(response?.status === 200){
                    const updatedQuestions = form.questions.map((question, i) => {
                        if(i===index){
                            return response.data;
                        }
                        return question;
                    });
    
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

        if(typeIsFocused)
            patchQuestType();
    }, [questType]);

    // Delete question handler.
    const handleQuestionDelete = () => {
        
        // Function used to send the DELETE request to the server
        // to delete a Question from the Form.
        const removeQuestion = async () => {
            try {
                const response = await deleteQuestion(form.id, form.questions[index].id, auth.access);

                if(response?.status === 204){
                    const updatedQuestions = form.questions.filter(q => (
                        q.id !== form.questions[index].id
                    ));

                    setForm({...form, questions: updatedQuestions});
                }
            } catch (err) {
                console.log(err);
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

        // Call the delete function to send the DELETE request.
        removeQuestion();
    };

    // Drag n' Drop handler.
    const handleDrop = (e) => {
        const copyOptionsList = form.questions[index].options;
        const pivot = copyOptionsList[dragItem];
        copyOptionsList[dragItem] = copyOptionsList[overItem];
        copyOptionsList[overItem] = pivot;
        const updatedQuestions = 
            form
            .questions
            .map(
                question => question.id === form.questions[index].id 
                ? {...question, options: copyOptionsList} 
                : question
            );
        
        setForm({...form, questions: updatedQuestions});
    };

    return (
        <div className="question-editor-container">
            <div 
                className="close-button"
                onClick={handleQuestionDelete}
            >
                <FontAwesomeIcon icon={faXmark} />
            </div>
            <div className="select-container">
                <select
                    value={questType}
                    onChange={(e) => setQuestType(e.target.value)}
                    onFocus={() => setTypeIsFocused(true)}
                    onBlur={() => setTypeIsFocused(false)}
                >
                    <option value="text">Text</option>
                    <option value="select">Select</option>
                    <option value="multiple">Multiple</option>
                </select>
            </div>
            <input 
                type="text"
                className="question-title-input"
                placeholder="Question Title"
                value={questText}
                onChange={(e) => setQuestText(e.target.value)}
                onFocus={() => setTextIsFocused(true)}
                onBlur={() => setTextIsFocused(false)}
            />
            {
                form.questions[index].type === "text" ? 
                (<p className="answer-text-mockup">Answer goes here...</p>) : 
                form.questions[index].type === "select" || form.questions[index].type === "multiple" ?
                (
                    <ul className="options-list">
                        {
                            form.questions[index].options.map((option, i) => {
                                return (
                                        <SelectOptContainer 
                                            key={option.id}
                                            questionIndex={index}
                                            optionIndex={i}
                                            type={
                                                form.questions[index].type === "select" ?
                                                0 : form.questions[index].type === "multiple" ?
                                                1 : null
                                            }
                                            handleDrop={handleDrop}
                                            setDragItem={setDragItem}
                                            setOverItem={setOverItem}
                                        />
                                )
                            })
                        }
                        <AddOptionButton questionIndex={index} />
                    </ul>
                ) : (<p className="answer-text-mockup">Invalid Question Type</p>)
            }
        </div>
    );
};

export default QuestionEditor;