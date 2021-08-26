import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import Stellar from 'stellar-sdk'
import { getDistributionAccount, getUser } from '../Mongo';
import { manageBuyOffer } from '../Node/manageBuyOffer';
import './Hom.css'

const Makeoffer = (props) => {
    const { assetCode, user } = props;
    const [amount, setAmount] = useState(null);
    const [buyingAsset, setBuyingAsset] = useState("");
    const makeOffer = async () => {
        const [userDetail] = await getUser(user);
        const ownerId = userDetail._id.toString();
        console.log(ownerId, userDetail)
        const [distributionAccount] = await getDistributionAccount(assetCode, ownerId)
        console.log(distributionAccount)
        const asset = new Stellar.Asset(assetCode, userDetail.publicKey)
        const offer = manageBuyOffer(distributionAccount, asset, amount, false);
        console.log("offer", offer)
    }
    return (
        <>
            <section className="hero">
                <div className="main-wrapper">
                    <div className="mainContainer">
                        <label><b>Selling Asset</b></label>
                        <input type="text" value={assetCode} disabled={true} />
                        <p className="errorMsg"></p>
                        <label><b>Buying Asset</b></label>
                        <input type="text" required placeholder="Asset Code (Name) ..." value={buyingAsset} onChange={(e) => setBuyingAsset(e.target.value)} />
                        <label><b>Buying Amount </b></label>
                        <input type="number" required placeholder="Amount ..." value={amount} onChange={(e) => setAmount(e.target.value)} />
                        <Link to="./assetlist"><button className="transaction_btn" onClick={() => makeOffer()}>Make Offer</button> </Link>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Makeoffer
