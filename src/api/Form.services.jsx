import axiosConnection, { FORMS_ENDPOINT, createHeaders } from "./axios";

// Service to GET the list of Forms.
export const getFormsList = async (accessToken) => {
    return await axiosConnection.get(
        FORMS_ENDPOINT,
        createHeaders(true, accessToken)
    );
};

// Service to GET a specific Form.
export const getForm = async (accessToken, formId) => {
    return await axiosConnection.get(
        (FORMS_ENDPOINT+formId),
        createHeaders(true, accessToken)
    );
};

// Service to CREATE a Form.
export const createForm = async (accessToken, payload) => {
    return await axiosConnection.post(
        FORMS_ENDPOINT,
        JSON.stringify(payload),
        createHeaders(true, accessToken)
    );
};

// Service to PATCH a Form.
export const patchForm = async (formId, accessToken, payload) => {

    const formEndpoint = FORMS_ENDPOINT + formId + "/";

    return await axiosConnection.patch(
        formEndpoint,
        JSON.stringify(payload),
        createHeaders(true, accessToken)
    );
};

// Service to DELETE a Form.
export const deleteForm = async (formId, accessToken) => {
    
    const formEndpoint = FORMS_ENDPOINT + formId + "/";

    return await axiosConnection.delete(
        formEndpoint,
        createHeaders(true, accessToken)
    );
};