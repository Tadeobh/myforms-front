import { createContext, useState } from "react";

const FormDataContext = createContext({});

export const FormDataProvider = ({children, formData}) => {

    const [form, setForm] = useState(formData);

    return (
        <FormDataContext.Provider value={{form, setForm}}>
            {children}
        </FormDataContext.Provider>
    )
};

export default FormDataContext;