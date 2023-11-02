import axios from 'axios';

// LOG IN endpoint.
export const LOGIN_ENDPOINT = '/api/login/';

// Register endpoint.
export const REGISTER_ENDPOINT = '/api/users/';

// Base endpoint for all objects that belong to a Form.
export const FORMS_ENDPOINT = '/api/forms/';

// Sub-endpoint for all objects that belong to a Question.
export const QUESTIONS_ENDPOINT = '/questions/';

// Sub-endpoint for Options.
export const OPTIONS_ENDPOINT = '/options/';

// Headers used when using a protected endpoint.
export const createHeaders = (authenticated, accessToken) => {
    const headers = {
        headers: {'Content-Type': 'application/json'},
        withCredentials: true,
    };

    if(authenticated)
        headers.headers['Authorization'] = 'Bearer ' + accessToken;

    return headers;
};

// Create the Axios connection with the base URL.
const axiosConnection = axios.create({
    baseURL: 'http://localhost:8000'
});

// Function to Log In a User.
export const logIn = async(username, password) => {
    return await axiosConnection.post(
        LOGIN_ENDPOINT,
        JSON.stringify({
            "username": username,
            "password": password
        }),
        createHeaders(false)
    );
};

// Service to Register a new User.
export const registerUser = async(username, email, password) => {
    return await axiosConnection.post(
        REGISTER_ENDPOINT,
        JSON.stringify({
            "username": username,
            "email": email,
            "password": password
        }),
        createHeaders(false)
    );
};

// Service to CREATE a Form.
export const createForm = async (accessToken, payload) => {

    const formEndpoint = FORMS_ENDPOINT;

    const response = await axiosConnection.post(
        formEndpoint,
        JSON.stringify(payload),
        createHeaders(true, accessToken)
    );

    return response;
};

// Service to PATCH a Form.
export const patchForm = async (form_id, accessToken, payload) => {

    const formEndpoint = FORMS_ENDPOINT + form_id + "/";

    const response = await axiosConnection.patch(
        formEndpoint,
        JSON.stringify(payload),
        createHeaders(true, accessToken)
    );

    return response;
};

// Service to DELETE a Form.
export const deleteForm = async (form_id, accessToken) => {
    
    const formEndpoint = FORMS_ENDPOINT + form_id + "/";

    const response = await axiosConnection.delete(
        formEndpoint,
        createHeaders(true, accessToken)
    );

    return response;
};

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

// Service to CREATE an Option.
export const createOption = async (form_id, question_id, accessToken, payload) => {
    
    const optionEndpoint = (
        FORMS_ENDPOINT + form_id + QUESTIONS_ENDPOINT + question_id + OPTIONS_ENDPOINT
    );
    
    const response = await axiosConnection.post(
        optionEndpoint,
        JSON.stringify(payload),
        createHeaders(true, accessToken)
    );

    return response;
};

// Service to PATCH an Option.
export const patchOption = async (form_id, question_id, option_id, accessToken, payload) => {
    
    const optionEndpoint = (
        FORMS_ENDPOINT + form_id + QUESTIONS_ENDPOINT + question_id + OPTIONS_ENDPOINT + option_id + "/"
    );
    
    const response = await axiosConnection.patch(
        optionEndpoint,
        JSON.stringify(payload),
        createHeaders(true, accessToken)
    );

    return response;
};
    
// Service to DELETE an Option.
export const deleteOption = async (form_id, question_id, option_id, accessToken) => {
    
    const optionEndpoint = (
        FORMS_ENDPOINT + form_id + QUESTIONS_ENDPOINT + question_id + OPTIONS_ENDPOINT + option_id + "/"
    );

    const response = await axiosConnection.delete(
        optionEndpoint,
        createHeaders(true, accessToken)
    );

    return response;
};

export default axiosConnection;