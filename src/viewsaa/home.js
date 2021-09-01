import React, { useState, useEffect } from 'react'
import Stellar from 'stellar-sdk'
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { addDistributionAccount, addUser, getAllDistributionAccount, getAllUser, getDistributionAccount, getOfferRequest, getUser } from '../services/Mongo'
import '../media/home.css'
// import { checkedAccounts } from '../services/checkBalances';
// import { issueAccount } from '../services/issueAssets';
// import { useHistory } from 'react-router-dom';
// import { jointAccount } from '../services/makeJointAccount';
import { printFile } from '../services/generate-pdf';
// import Navbar from '../components/navbar';
// import Balance from './Balance';
// import Card from './Card';
import { actionTypes } from '../context/reducer';
import Balance from '../components/user-balance';
import Card from '../components/event-buttons';
import Navbar from '../components/navbar'
import { useStateValue } from '../context/authcontext';
import { useHistory } from 'react-router-dom';
import { checkedAccounts } from '../services/get-balance';

const Home = (props) => {
    const [{ user }, dispatch] = useStateValue();
    const history = useHistory();
    const [keys, setKeys] = useState({});
    const [isAsset, setIsAsset] = useState(false);
    const [assets, setAssets] = useState("");
    const [alert, setAlert] = useState(false);
    const [balance, setBalance] = useState({});
    const [distributionAccount, setDistributionAccount] = useState({});


    useEffect(async () => {
        const checkUser = await getAllUser();
        const userList = checkUser.map(item => item.user)
        const hasUser = userList.includes(user)
        console.log(hasUser)
        if (hasUser) {
            const [userDetail] = await getUser(user);
            console.log(userDetail)
            setKeys({
                secret: userDetail.privateKey,
                public: userDetail.publicKey
            })
            dispatch({
                type: actionTypes.SET_KEYS,
                keys: {
                    secret: userDetail.privateKey,
                    public: userDetail.publicKey
                },
            })
            const accountDetail = await checkedAccounts(userDetail.publicKey);
            setBalance(accountDetail);
        } else {
            const [userDetail] = await getUser(user);
            const pair = Stellar.Keypair.random();
            setKeys({
                secret: pair.secret(),
                public: pair.publicKey()
            })
            dispatch({
                type: actionTypes.SET_KEYS,
                keys: {
                    secret: userDetail.privateKey,
                    public: userDetail.publicKey
                },
            })
            await addUser(user, pair.secret(), pair.publicKey());
        }
    }, [])




    return (
        <>
            <section className="hero">

                <Navbar />
                <Balance />
                <Card />
                {
                    alert &&
                    <div className="alert">
                        <span className="closebtn" onClick={() => setAlert(false)}>&times;</span>
                        <strong>Success</strong>{isAsset ? "Asset Issued" : "Account Funded"}
                    </div>

                }

            </section>

        </>

    )
}

export default Home;




