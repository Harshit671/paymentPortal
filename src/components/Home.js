import React, { useState, useEffect } from 'react'
import Stellar from 'stellar-sdk'
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { addDistributionAccount, addUser, getAllDistributionAccount, getAllUser, getDistributionAccount, getOfferRequest, getUser } from '../Mongo'
import './Hom.css'
import { checkedAccounts } from '../Node/checkBalances';
import { issueAccount } from '../Node/issueAssets';
import { useHistory } from 'react-router-dom';
import { jointAccount } from '../Node/makeJointAccount';
import { printFile } from '../Node/File';
import Navbar from './Navbar';
import Balance from './Balance';
import Card from './Card';

const Home = (props) => {
    const history = useHistory();
    const [keys, setKeys] = useState({});
    const [user, setUser] = useState("")
    const [isAsset, setIsAsset] = useState(false);
    const [assets, setAssets] = useState("");
    const [alert, setAlert] = useState(false);
    const [balance, setBalance] = useState({});
    const [distributionAccount, setDistributionAccount] = useState({});



    const { handleLogout, setAssetList, setOfferList, setAllOffers, setOfferRequest } = props

    const fundAccount = async (key = keys.public) => {
        console.log(key);
        await axios.get("/friendbot", {
            baseURL: "https://horizon-testnet.stellar.org",
            params: { addr: key }
        }).then(() => console.log("successfully funded"))
        setAlert(true);
        setTimeout(() => setAlert(false), 4000)
    }



    const issueAsset = async () => {
        const uuid = uuidv4();
        const assetName = prompt("Enter Asset Name");
        const assetValue = prompt("Enter Amount ");
        setAssets(assetName)
        if (assetName) {
            var asset = new Stellar.Asset(assetName, keys.public);
            console.log(asset)
            const pair = Stellar.Keypair.random();
            fundAccount(pair.publicKey());
            setDistributionAccount({
                secret: pair.secret(),
                public: pair.publicKey()
            })
            const userDetail = await getUser(user);
            addDistributionAccount(assetName, pair.publicKey(), pair.secret(), userDetail[0]._id.toString())
            setTimeout(() => {
                issueAccount(keys, {
                    secret: pair.secret(),
                    public: pair.publicKey()
                }, asset, assetValue)
                setIsAsset(true)
                setAlert(true)
                setTimeout(() => setAlert(false), 4000)
            }, 10000)

            printFile(uuid, userDetail[0].user, assetValue);


        }
    }

    const getAssets = async () => {

        var server = new Stellar.Server("https://horizon-testnet.stellar.org");

        server
            .assets()
            .forIssuer(keys.public)
            .call()
            .then(function (resp) {
                console.log(resp)
                setAssetList(resp.records);
                history.push("/assetlist");
            })
            .catch(function (err) {
                console.error(err);
            });
    }

    useEffect(async () => {
        const name = props.user.email.split("@")[0];
        setUser(name);
        const checkUser = await getAllUser();
        const userList = checkUser.map(item => item.user)
        const hasUser = userList.includes(name)
        if (hasUser) {
            const [userDetail] = await getUser(name);
            setKeys({
                secret: userDetail.privateKey,
                public: userDetail.publicKey
            })
            const accountDetail = await checkedAccounts(userDetail.publicKey);
            setBalance(accountDetail);
        } else {
            const pair = Stellar.Keypair.random();
            setKeys({
                secret: pair.secret(),
                public: pair.publicKey()
            })
            await addUser(name, pair.secret(), pair.publicKey());
        }
    }, [])


    const listOffers = async () => {
        const [userDetail] = await getUser(user);
        const ownerId = userDetail._id.toString();
        const distributionAccount = await getDistributionAccount("", ownerId)
        const distributionKeys = distributionAccount.map(item => item.publicKey)
        console.log(distributionKeys)
        setOfferList([]);
        distributionKeys.map(async item => {
            await fetch(`https://horizon-testnet.stellar.org/offers?seller=${item}`).then(data => data.json()).then(info => { console.log(info); setOfferList((prevList) => [...prevList, info._embedded.records]) });
        })
        setTimeout(() => {
            history.push("./offerlist")
        }, 5000)

    }

    const listAllOffers = async () => {
        setAllOffers([])
        const users = await getAllDistributionAccount();
        const usersPublicKey = users.map(item => item.publicKey)
        usersPublicKey.map(async item => {
            await fetch(`https://horizon-testnet.stellar.org/offers?seller=${item}`).then(data => data.json()).then(info => setAllOffers(prevList => [...prevList, info._embedded.records]));
        })
        history.push("/alloffers")
    }

    const jointAccountOperation = async () => {
        const numberOfSigners = prompt("enter number of co-owners");
        let ownerList = [];
        for (let i = 0; i < numberOfSigners; i++) {

            let ownerName = prompt(`enter ${i + 1} owner`);
            ownerList = [...ownerList, ownerName];
        }
        const ownerDetail = async () =>
            await Promise.all(ownerList.map(async (item) =>
                await getUser(item)

            ))
        const detail = await ownerDetail()
        if (detail.length > 0) {
            const ownersPublicKey = detail.map(item => item[0].publicKey)
            console.log(ownersPublicKey)
            const joint = jointAccount(keys, ownersPublicKey, true);
            console.log(joint)
        }
    }

    const offerRequest = async () => {
        const offer = await getOfferRequest(keys.public)
        setOfferRequest(offer);
        history.push("/offerrequest")
    }


    return (
        <>
            <section className="hero">

                <Navbar getAssets={getAssets}

                    listOffers={listOffers}

                    offerRequest={offerRequest}


                    handleLogout={handleLogout}
                    user={user}
                />


                <Balance balance={balance} />

                <Card jointAccountOperation={jointAccountOperation}
                    issueAsset={issueAsset}
                    listAllOffers={listAllOffers}
                    fundAccount={fundAccount}

                />




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




