import React, { useState } from 'react'
import { getDistributionAccount, getUser } from '../services/Mongo';
import { writeFile } from '../services/generate-pdf';
import { runTransaction } from '../services/make-trxn';
import Stellar from 'stellar-sdk'
import '../media/home.css'
import { Link } from 'react-router-dom';
import { useStateValue } from '../context/authcontext';

const Transaction = () => {
    const [{ user }, dispatch] = useStateValue();
    const [receiverName, setReceiverName] = useState("");
    const [amount, setAmount] = useState("");
    const [tradingAsset, setTradingAsset] = useState("");
    const [file, setFile] = useState([])

    const makeTransaction = async () => {
        const [issuerAccount] = await getUser(user)
        console.log(tradingAsset, receiverName, amount);
        const [userDetail] = await getUser(user);
        const [receiverDetail] = await getUser(receiverName);
        console.log(receiverDetail)
        const ownerId = userDetail._id.toString();
        console.log(ownerId, tradingAsset === "XLM")
        const [distributionAccount] = tradingAsset === "XLM" ? await getUser(user) : await getDistributionAccount(tradingAsset, ownerId)
        console.log(distributionAccount)
        const asset = tradingAsset === "XLM" ? Stellar.Asset.native() : new Stellar.Asset(tradingAsset, issuerAccount.publicKey)
        console.log(asset);
        const transaction = await runTransaction(distributionAccount, receiverDetail, asset, amount);
        console.log(transaction, "transaction successfull");
        alert("transaction successfull")
    }

    const handleUpdate = async () => {
        await writeFile(file);
    }

    const handleChange = (e) => {
        const data = e.target.files;
        setFile(data)
    }
    return (

        <div className="main-wrapper my-4">
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
                <Link to="/" ><button className="my-2">Back</button></Link>
            </div>

        </div>
    )
}

export default Transaction
