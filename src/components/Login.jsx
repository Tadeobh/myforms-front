import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import { logIn } from '../api/axios';
import useAuth from '../hooks/useAuth';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const Login = () => {

    const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;

    const DASH_URL = '/';

    const navigate = useNavigate();

    const { auth, setAuth } = useAuth();

    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [isPwd, setIsPwd] = useState(true);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        const result = USER_REGEX.test(user);
        setValidName(result);
    }, [user]);

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!USER_REGEX.test(user)){
            setErrMsg("Invalid Entry.");
            return;
        }

        try{
            const response = await logIn(user, pwd);

            const authCreds = {
                "username": user,
                "access": response.data.access
            };

            localStorage.setItem("auth", JSON.stringify(authCreds));
            setAuth(authCreds);
            navigate(DASH_URL);

        } catch (err) {
            console.log(err);
            
            if (!err?.response){
                setErrMsg("No Server Response");
            } else if (err.response?.status === 401 ){
                setErrMsg(err.response.data.code);
            } else {
                setErrMsg("Login Failed.");
            }

            //errRef.current.focus();
        }
         
    };

    return (
        <Container className='center-container'>
            <Row >
                <Col md={8} lg={5} className='mx-auto'>
                    <Form onSubmit={handleSubmit}>
                        <h1 className='mb-5'>Log into your account.</h1>
                        <Form.Group className='mb-2'>
                            <Form.Label className='h5' htmlFor='username'>Username</Form.Label>
                            <Form.Control 
                                id='username'
                                autoComplete='false'
                                ref={userRef}
                                required
                                placeholder='Enter username'
                                onChange={e => setUser(e.target.value)}
                                onFocus={() => setUserFocus(true)}
                                onBlur={() => setUserFocus(false)}
                            />
                            <Form.Text className={userFocus && user && !validName ? 'text-danger' : 'invisible'}>
                                Please enter a valid username with at least 3 non-special characters.
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className='mb-5'>
                            <Form.Label className='h5' htmlFor='password'>Password</Form.Label>
                            <Form.Control 
                                type={isPwd ? 'password' : 'text'}
                                id='password'
                                placeholder='Password'
                                autoComplete='off'
                                onChange={(e) => setPwd(e.target.value)}
                                required
                            />
                            <Form.Check className='mt-2'
                                type='checkbox'
                                label='Show password'
                                onClick={() => isPwd ? setIsPwd(false) : setIsPwd(true)}
                            />
                        </Form.Group>
                        <div className='d-grid'>
                            <Button type='submit' disabled={validName && pwd.length>3 ? false : true}>
                                Log In
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}

export default Login;