import { useContext } from "react";
import FormDataContext from "../context/FormDataContext";

const useFormData = () => {
    return useContext(FormDataContext);
};

export default useFormData;