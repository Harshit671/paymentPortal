import React, { useState, useEffect } from 'react'
import './App.css';
import Firebase from './services/Firebase';
// import Status from './components/Status';
// import Home from './components/Home';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
// import Assets from './components/Assets';
// import MakeOffer from './components/MakeOffer';
// import OfferList from './components/OfferList';
// import AllOffers from './components/all-market-offers';
// import OfferRequest from './components/OfferRequest';
// import Transaction from './components/Transaction';
import { useStateValue } from './context/authcontext';
import { actionTypes } from './context/reducer';
import Routes from './routes/routes';
import Status from './components/login-page';

function App() {
  const [{ user }, dispatch] = useStateValue();
  const [assetCode, setAssetCode] = useState("");
  // const [user, setUser] = useState('');
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  // const [emailError, setEmailError] = useState('');
  // const [passwordError, setPasswordError] = useState('');
  // const [hasAccount, setHasAccount] = useState(false);
  // const [assetList, setAssetList] = useState([]);
  // const [offerList, setOfferList] = useState([]);
  // const [allOffers, setAllOffers] = useState([]);
  // const [offerRequest, setOfferRequest] = useState([]);

  // const clearInputs = () => {
  //   setEmail('')
  //   setPassword('')
  // }

  // const clearErrors = () => {
  //   setEmailError();
  //   setPasswordError();
  // }

  // const handleLogin = () => {

  //   clearErrors()
  //   Firebase
  //     .auth()
  //     .signInWithEmailAndPassword(email, password)
  //     .then(userInfo => {
  //       setUser(userInfo.user);
  //       dispatch({
  //         type: actionTypes.SET_USER,
  //         user: userInfo.user.email.split("@")[0],
  //       })
  //     })
  //     .catch((err) => {
  //       switch (err.code) {
  //         case "auth/invalid-email":
  //           setPasswordError(err.message);
  //           break;
  //         case "auth/user-disabled":
  //           setPasswordError(err.message);
  //           break;
  //         case "auth/user-no-found":
  //           setEmailError(err.message);
  //           break;
  //         case "auth/wrong-password":
  //           setPasswordError(err.message);
  //           break;
  //         default:
  //           setPasswordError(err.message);
  //       }
  //     });
  // };
  // const handleSignup = () => {
  //   clearErrors()
  //   Firebase
  //     .auth()
  //     .createUserWithEmailAndPassword(email, password)
  //     .then(userInfo => {
  //       setUser(userInfo.user)
  //     })
  //     .catch((err) => {
  //       switch (err.code) {
  //         case "auth/email-already-in-use":
  //           setEmailError(err.message);
  //           break;
  //         case "auth/invalid-email":
  //           setEmailError(err.message);
  //           break;
  //         case "auth/weak-password":
  //           setPasswordError(err.message);
  //           break;
  //         default:
  //           setPasswordError(err.message);
  //       }
  //     });
  // };


  // const handleLogout = () => {
  //   Firebase.auth().signOut();
  // };

  const authListener = () => {
    Firebase.auth().onAuthStateChanged((user) => {

      if (user) {
        console.log(user)
        // clearInputs();
        // setUser(user);
        // dispatch({
        //   type: actionTypes.SET_USER,
        //   user: user.email.split("@")[0],
        // })
      }
      else {
        //console.log(user)
        // setUser("");
        dispatch({
          type: actionTypes.SET_USER,
          user: null,
        })
      }
    }
    );
  };

  useEffect(() => {
    authListener();

  }, []);

  return (
    <>
      <div className="App">
        {user ? (
          <>
            <Router >
              <Routes />
            </Router>
          </>
        ) : (
          <Status />
        )}
      </div>
    </>
  );
};

export default App;
