import React, { useState, useEffect } from 'react'
import Stellar from 'stellar-sdk'
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { addDistributionAccount, addUser, getAllDistributionAccount, getAllUser, getDistributionAccount, getOfferRequest, getUser } from '../Mongo'
import './Hom.css'
import { checkedAccounts } from '../Node/checkBalances';
import { issueAccount } from '../Node/issueAssets';
import { runTransaction } from '../Node/makeTx';
import { useHistory } from 'react-router-dom';
import { jointAccount } from '../Node/makeJointAccount';
import { printFile, writeFile } from '../Node/File';

const Home = (props) => {
    const history = useHistory();
    const [keys, setKeys] = useState({});
    const [user, setUser] = useState("")
    const [isAsset, setIsAsset] = useState(false);
    const [asset, setAssets] = useState("");
    const [alert, setAlert] = useState(false);
    const [balance, setBalance] = useState({});
    const [distributionAccount, setDistributionAccount] = useState({});
    const [show, setShow] = useState(false)
    const [receiverName, setReceiverName] = useState("");
    const [amount, setAmount] = useState("");
    const [tradingAsset, setTradingAsset] = useState("");
    const [file, setFile] = useState([])

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

    const makeTransaction = async () => {
        console.log(tradingAsset, receiverName, amount);
        const [userDetail] = await getUser(user);
        const [receiverDetail] = await getUser(receiverName);
        console.log(receiverDetail)
        const ownerId = userDetail._id.toString();
        console.log(ownerId, tradingAsset === "XLM")
        const [distributionAccount] = tradingAsset === "XLM" ? await getUser(user) : await getDistributionAccount(tradingAsset, ownerId)
        console.log(distributionAccount)
        const asset = new Stellar.Asset(tradingAsset, keys.public)
        console.log(asset);
        const transaction = await runTransaction(distributionAccount, receiverDetail, asset, amount);
        console.log(transaction, "transaction successfull");
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
            const addUsers = await addUser(name, pair.secret(), pair.publicKey());
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

    const handleChange = (e) => {
        const data = e.target.files;
        setFile(data)
    }
    const handleUpdate = async () => {
        await writeFile(file);
    }

    return (
        <>
            <section className="hero">
                {/* <nav>
                    <h2>{`Welcome ${props.user.email.split("@")[0]}`}</h2>
                    <button onClick={() => fundAccount()} > Fund Account </button>
                    <button onClick={() => { checkBalance(); setShow(!show) }} >{show ? "Hide Balance" : "Show Balance"}</button>
           
                    
                </nav> */}
                <nav className="navbar navbar-expand-lg navbar-light bg-light ">
                    <a className="navbar-brand " href="#">Navbar</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="nav navbar-nav navbar-center">
                            <li className="nav-item active">
                                <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
                            </li>
                            <li className="nav-item" onClick={() => getAssets()}>
                                <a className="nav-link" href="#">Assets</a>
                            </li>
                            <li className="nav-item" onClick={() => fundAccount()}>
                                <a className="nav-link" href="#">Fund Account</a>
                            </li>
                            <li className="nav-item" onClick={() => listOffers()} >
                                <a className="nav-link" href="#">Offers Created</a>
                            </li>
                            <li className="nav-item" onClick={() => listAllOffers()}  >
                                <a className="nav-link" href="#">Market Offers</a>
                            </li>
                            <li className="nav-item" onClick={() => offerRequest()}>
                                <a className="nav-link" href="#">Transfers</a>
                            </li>
                            <li className="nav-item" onClick={() => jointAccountOperation()}>
                                <a className="nav-link" href="#">Joint Account</a>
                            </li>
                            <li className="nav-item" onClick={() => issueAsset()}>
                                <a className="nav-link" href="#">Issue Asset</a>
                            </li>
                        </ul>
                        <div className="navbar-nav ms-auto">
                            <button className="btn btn-outline-success my-2 my-sm-0 ml-3" onClick={() => handleLogout()} >Logout</button>
                        </div>
                    </div>
                </nav>

                <div className="balance my-5">
                    <h2>Balance</h2><br />

                    {
                        balance.balances &&
                        balance.balances.map((item, index) => {
                            return (
                                <div key={index}>
                                    <h4>{index === balance.balances.length - 1 ? item.asset_type : item.asset_code}</h4>
                                    <p>{item.balance}</p>
                                </div>
                            )
                        })
                    }

                </div>

                <div className="main-wrapper">
                    <div className="mainContainer">
                        <label><b>Sending To</b></label>
                        <input type="text" required placeholder="Enter Receiver's Name ..." onChange={(e) => setReceiverName(e.target.value)} />
                        <p className="errorMsg"></p>
                        <label><b>Amount</b></label>
                        <input type="number" required placeholder="Amount ..." onChange={(e) => setAmount(e.target.value)} />
                        <label><b>Asset to be sent</b></label>
                        <input type="text" required placeholder="Asset Name ..." onChange={(e) => setTradingAsset(e.target.value)} />
                        <button className="transaction_btn" onClick={() => makeTransaction()}>Make Transaction</button>
                        <label><b>Select Asset File</b></label>
                        <input type="file" onChange={(e) => handleChange(e)} multiple={true} />
                        <span><button onClick={() => handleUpdate()}>Upload</button></span>
                    </div>
                </div>
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




