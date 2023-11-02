import { createContext, useState } from "react";

const DataContext = createContext({});

export const DataProvider = ({children}) => {

    const [formList, setFormList] = useState([]);
    const [form, setForm] = useState({});

    return (
        <DataContext.Provider value={{formList, setFormList, form, setForm}}>
            {children}
        </DataContext.Provider>
    )
};

export default DataContext;