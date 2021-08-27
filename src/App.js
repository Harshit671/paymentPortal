import React, { useState, useEffect } from 'react'
import './App.css';
import Firebase from './Firebase';
import Status from './components/Status';
import Home from './components/Home';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Assets from './components/Assets';
import MakeOffer from './components/MakeOffer';
import OfferList from './components/OfferList';
import AllOffers from './components/AllOffers';
import OfferRequest from './components/OfferRequest';
import Transaction from './components/Transaction';

function App() {
  const [assetCode, setAssetCode] = useState("");
  const [user, setUser] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [hasAccount, setHasAccount] = useState(false);
  const [assetList, setAssetList] = useState([]);
  const [offerList, setOfferList] = useState([]);
  const [allOffers, setAllOffers] = useState([]);
  const [offerRequest, setOfferRequest] = useState([]);

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
        setUser(userInfo.user);
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
        setUser(userInfo.user)
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


  const handleLogout = () => {
    Firebase.auth().signOut();
  };

  const authListener = () => {
    Firebase.auth().onAuthStateChanged((user) => {

      if (user) {
        // console.log(user)
        clearInputs();
        setUser(user);
      } else {
        //console.log(user)
        setUser("");
      }
    });
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
              <Switch >
                <Route exact path="/" ><Home handleLogout={handleLogout} user={user} setAssetList={setAssetList} setOfferList={setOfferList} setAllOffers={setAllOffers} setOfferRequest={setOfferRequest} /></Route>
                <Route exact path="/assetlist"><Assets assetList={assetList} setAssetCode={setAssetCode} /></Route>
                <Route exact path="/offerlist"><OfferList offerList={offerList} /></Route>
                <Route exact path="/transaction"><Transaction user={user} /></Route>
                <Route exact path="/alloffers"><AllOffers allOffers={allOffers} user={user} /></Route>
                <Route exact path="/offerrequest"><OfferRequest offerRequest={offerRequest} user={user} /></Route>
                <Route exact path="/makeoffer"><MakeOffer assetCode={assetCode} user={user.email.split("@")[0]} /></Route>
              </Switch>
            </Router>


          </>
        ) : (
          <Status
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            handleLogin={handleLogin}
            handleSignup={handleSignup}
            hasAccount={hasAccount}
            setHasAccount={setHasAccount}
            emailError={emailError}
            passwordError={passwordError}
            user={user} />

        )}
      </div>
    </>
  );
};

export default App;
