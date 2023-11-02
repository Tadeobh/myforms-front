import { faCircleQuestion, faCommentDots } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./form_card.css";
import { Link, useNavigate } from "react-router-dom";

const FormCard = ({form}) => {

    const FORM_URL = '/form/';

    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate(FORM_URL+form.id);
    };

    return (
        <div className="form-card-container" onClick={handleRedirect}>
            <p className="form-card-title">{form.title}</p>
            <p className="form-card-desc">{form.description}</p>
            <div className="form-card-counter-container">
                <div className="form-card-counter">
                    <FontAwesomeIcon icon={faCircleQuestion}/>
                    <p className="form-card-counter-digit">{form?.questions.length || "0"}</p>
                </div>
                <div className="form-card-counter">
                    <FontAwesomeIcon icon={faCommentDots}/>
                    <p className="form-card-counter-digit">{form?.responses.length || "0"}</p>
                </div>
            </div>
        </div>
    );
};

export default FormCard;