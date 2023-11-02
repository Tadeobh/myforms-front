import { useRef, useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { registerUser } from "../api/axios";
import useAuth from '../hooks/useAuth';

const Register = () => {

    const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
    const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

    const REGISTER_URL = '/api/users/';
    const DASH_URL = '/';

    const { setAuth } = useAuth();

    const navigate = useNavigate();

    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState("");
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [email, setEmail] = useState("");
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);
    
    const [pwd, setPwd] = useState("");
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const accessCreds = JSON.parse(localStorage.getItem("auth"));
        if (accessCreds?.access != null) {
            setAuth(accessCreds);
            navigate(DASH_URL);
        }

        userRef.current.focus();
    }, []);

    useEffect(() => {
        const result = USER_REGEX.test(user);
        console.log(`Username is ${result ? "valid" : "invalid"}`);
        setValidName(result);
    }, [user]);

    useEffect(() => {
        const result = EMAIL_REGEX.test(email);
        console.log(`Email is ${result ? "valid" : "invalid"}`);
        setValidEmail(result);
    }, [email]);

    useEffect(() => {
        const result = PWD_REGEX.test(pwd);
        console.log(`Password is ${result ? "valid" : "invalid"}`);
        setValidPwd(result);
        const match = pwd === matchPwd;
        setValidMatch(match);
    }, [pwd, matchPwd]);

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd, matchPwd]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const validateUser = USER_REGEX.test(user);
        const validateEmail = EMAIL_REGEX.test(email);
        const validatePwd = PWD_REGEX.test(pwd);
        const validateMatch = pwd === matchPwd;

        if (!validateUser || !validateEmail || !validatePwd || !validateMatch){
            setErrMsg("Invalid Entry");
            return;
        }

        console.log(`Username: ${user}\nEmail: ${email}\nPassword: ${pwd}\nConf. Password: ${matchPwd}`);
        
        try{
            const response = await registerUser(user, email,pwd);

            console.log(response);

            setSuccess(true);

        } catch (err) {
            console.log(err);
            
            if (!err?.response){
                setErrMsg("No Server Response");
            } else if (err.response?.status === 409 ){
                setErrMsg("User already exists");
            } else {
                setErrMsg("Registration Failed");
            }

            errRef.current.focus();
        }

    };
    
    return (
        <>
            {
                success ? (
                    <section>
                        <h1>Success!</h1>
                    </section>
                ) : (
                    <Container className="center-container">
                        <Row>
                            <Col md={8} lg={5} className='mx-auto'>
                                <Form onSubmit={handleSubmit}>
                                    <h1 className="mb-5">Create a new account.</h1>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="h5">Username</Form.Label>
                                        <Form.Control
                                            id="username"
                                            ref={userRef}
                                            autoComplete="off"
                                            onChange={(e) => setUser(e.target.value)}
                                            required
                                            aria-invalid={validName ? "false" : "true"}
                                            aria-describedby="uidnote"
                                            onFocus={() => setUserFocus(true)}
                                            onBlur={() => setUserFocus(false)}
                                        />
                                        <Form.Text className={userFocus && user && !validName ? 'text-danger' : 'visually-hidden'}>
                                            4 to 24 characters.<br/>
                                            Must begin with a letter.<br/>
                                            Letters, numbers, underscores, hyphens allowed.
                                        </Form.Text>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="h5">Email</Form.Label>
                                        <Form.Control
                                            id="email"
                                            autoComplete='off'
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            aria-invalid={validEmail ? "false" : "true"}
                                            aria-describedby="emailnote"
                                            onFocus={() => setEmailFocus(true)}
                                            onBlur={() => setEmailFocus(false)}
                                        />
                                        <Form.Text id="emailnote" className={emailFocus && email && !validEmail ? "text-danger" : "visually-hidden"}>
                                            Please enter a valid email.
                                        </Form.Text>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="h5">Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            id="password"
                                            onChange={(e) => setPwd(e.target.value)}
                                            required
                                            aria-invalid={validPwd ? "false" : "true"}
                                            aria-describedby="pwdnote"
                                            onFocus={() => setPwdFocus(true)}
                                            onBlur={() => setPwdFocus(false)}
                                        />
                                        <Form.Text id="pwdnote" className={pwdFocus && !validPwd ? "text-danger" : "visually-hidden"}>
                                            8 to 24 characters.<br/>
                                            Must include uppercase and lowercase letters, a number and a special character (<span aria-label="exclamation mark">!
                                            </span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#
                                            </span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>).
                                        </Form.Text>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="h5">Confirm Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            id="confirm_pwd"
                                            onChange={(e) => setMatchPwd(e.target.value)}
                                            required
                                            aria-invalid={validMatch ? "false" : "true"}
                                            aria-describedby="confirmnote"
                                            onFocus={() => setMatchFocus(true)}
                                            onBlur={() => setMatchFocus(false)}
                                        />
                                        <Form.Text id="confirmnote" className={matchFocus && !validMatch ? "text-danger" : "visually-hidden"}>
                                            Must match the first password input field.
                                        </Form.Text>
                                    </Form.Group>
                                    <div className='d-grid'>
                                        <Button type='submit' disabled={validName && validEmail && validPwd && validMatch ? false : true}>
                                            Register
                                        </Button>
                                    </div>
                                </Form>
                            </Col>
                        </Row>
                    </Container>
                )
            }
        </>
    )
}

export default Register;