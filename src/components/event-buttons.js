import React from 'react'
import { useHistory } from 'react-router-dom'
import '../media/home.css'
import { useStateValue } from '../context/authcontext';
import axios from 'axios';
import Stellar from 'stellar-sdk'
import { v4 as uuidv4 } from 'uuid';
import { addDistributionAccount, getUser } from '../services/Mongo';
import { jointAccount } from '../services/make-joint-account';
import { issueAccount } from '../services/issue-assets';
import { printFile } from '../services/generate-pdf';

const Card = () => {
    const history = useHistory();
    const [{ user, keys }, dispatch] = useStateValue();
    const makeTransaction = () => {
        history.push("/transaction")
    }

    const fundAccount = async (key = keys.public) => {
        console.log(key);
        await axios.get("/friendbot", {
            baseURL: "https://horizon-testnet.stellar.org",
            params: { addr: key }
        }).then(() => console.log("successfully funded"))
    }

    const listAllOffers = async () => {

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


    const issueAsset = async () => {
        const uuid = uuidv4();
        const assetName = prompt("Enter Asset Name");
        const assetValue = prompt("Enter Amount ");
        // setAssets(assetName)
        if (assetName) {
            var asset = new Stellar.Asset(assetName, keys.public);
            console.log(asset)
            const pair = Stellar.Keypair.random();
            fundAccount(pair.publicKey());
            const userDetail = await getUser(user);
            addDistributionAccount(assetName, pair.publicKey(), pair.secret(), userDetail[0]._id.toString())
            setTimeout(() => {
                issueAccount(keys, {
                    secret: pair.secret(),
                    public: pair.publicKey()
                }, asset, assetValue)
            }, 10000)

            printFile(uuid, userDetail[0].user, assetValue);


        }
    }


    return (
        <div className="cards ">
            <div className="card" onClick={() => fundAccount()}>
                <div className="card-body">
                    <i class="bi bi-bank"></i>
                    <h5 className="card-title">Fund Account</h5>
                </div>
            </div>
            <div className="card" onClick={() => listAllOffers()}>
                <div className="card-body">
                    <i class="bi bi-currency-exchange"></i>
                    <h5 className="card-title">Market Offers</h5>
                </div>
            </div>
            <div className="card" onClick={() => issueAsset()}>
                <div className="card-body">
                    <i class="bi bi-plus-circle"></i>
                    <h5 className="card-title">Issue Asset</h5>
                </div>
            </div>

            <div className="card" onClick={() => makeTransaction()}>
                <div className="card-body">
                    <i class="bi bi-credit-card"></i>
                    <h5 className="card-title">Make Transaction</h5>
                </div>
            </div>

            <div className="card" onClick={() => jointAccountOperation()}>
                <div className="card-body">
                    <i class="bi bi-people"></i>
                    <h5 className="card-title">Joint Account</h5>
                </div>
            </div>
        </div>
    )
}

export default Card
