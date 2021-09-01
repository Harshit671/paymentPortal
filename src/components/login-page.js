import React, { useState } from 'react'
import { useStateValue } from '../context/authcontext';
import { actionTypes } from '../context/reducer';
import '../media/status.css'
import Firebase from '../services/Firebase';

function Status() {
    const [{ }, dispatch] = useStateValue();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [hasAccount, setHasAccount] = useState(false);

    const clearInputs = () => {
        setEmail('')
        setPassword('')
    }

    const clearErrors = () => {
        setEmailError();
        setPasswordError();
    }

    const handleLogin = () => {

        clearErrors()
        Firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(userInfo => {
                dispatch({
                    type: actionTypes.SET_USER,
                    user: userInfo.user.email.split("@")[0],
                })
            })
            .catch((err) => {
                switch (err.code) {
                    case "auth/invalid-email":
                        setPasswordError(err.message);
                        break;
                    case "auth/user-disabled":
                        setPasswordError(err.message);
                        break;
                    case "auth/user-no-found":
                        setEmailError(err.message);
                        break;
                    case "auth/wrong-password":
                        setPasswordError(err.message);
                        break;
                    default:
                        setPasswordError(err.message);
                }
            });
    };
    const handleSignup = () => {
        clearErrors()
        Firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(userInfo => {
                dispatch({
                    type: actionTypes.SET_USER,
                    user: userInfo.user.email.split("@")[0],
                })
            })
            .catch((err) => {
                switch (err.code) {
                    case "auth/email-already-in-use":
                        setEmailError(err.message);
                        break;
                    case "auth/invalid-email":
                        setEmailError(err.message);
                        break;
                    case "auth/weak-password":
                        setPasswordError(err.message);
                        break;
                    default:
                        setPasswordError(err.message);
                }
            });
    };
    return (
        <section className="login">
            <div className="loginContainer" >
                <label>Username</label>
                <input type="text" outofocus required value={email}
                    onChange={(e) => setEmail(e.target.value)} />
                <p className="errorMsg">{emailError}</p>
                <label>Password</label>
                <input type="password" required value={password}
                    onChange={(e) => setPassword(e.target.value)} />
                <p className="errorMsg">{passwordError}</p>
                <div className="btnContainer">
                    {hasAccount ? (
                        <>
                            <button onClick={handleLogin}>Sign in</button>
                            <p>Don't have an account ? <span onClick={() => setHasAccount(!hasAccount)}>Sign Up</span></p>
                        </>
                    ) : (
                        <>
                            <button onClick={handleSignup}>Sign Up</button>
                            <p>Have an account? <span onClick={() => setHasAccount(!hasAccount)}>Sign in</span></p>
                        </>

                    )}
                </div>
            </div>
        </section>
    )
}

export default Status

