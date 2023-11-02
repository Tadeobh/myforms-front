import axiosConnection, { FORMS_ENDPOINT, QUESTIONS_ENDPOINT, createHeaders } from "./axios";

// Service to GET a Question.
export const getQuestion = async (form_id, accessToken) => {

    const questionEndpoint = FORMS_ENDPOINT + form_id + QUESTIONS_ENDPOINT + "/";

    const response = await axiosConnection.get(
        questionEndpoint,
        createHeaders(true, accessToken)    
    );

    return response;
};

// Service to CREATE a Question.
export const createQuestion = async (form_id, accessToken, payload) => {
    
    const questionEndpoint = FORMS_ENDPOINT + form_id + QUESTIONS_ENDPOINT;
    
    const response = await axiosConnection.post(
        questionEndpoint,
        JSON.stringify(payload),
        createHeaders(true, accessToken)
    );

    return response;
};

// Service to PATCH a Question.
export const patchQuestion = async (form_id, question_id, accessToken, payload) => {
    
    const questionEndpoint = FORMS_ENDPOINT + form_id + QUESTIONS_ENDPOINT + question_id + "/";
    
    const response = await axiosConnection.patch(
        questionEndpoint,
        JSON.stringify(payload),
        createHeaders(true, accessToken)
    );

    return response;
};
    
// Service to DELETE a Question.
export const deleteQuestion = async (form_id, question_id, accessToken) => {
    
    const questionEndpoint = FORMS_ENDPOINT + form_id + QUESTIONS_ENDPOINT + question_id + "/";

    const response = await axiosConnection.delete(
        questionEndpoint,
        createHeaders(true, accessToken)
    );

    return response;
};
