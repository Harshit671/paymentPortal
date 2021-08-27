import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';
import Stellar from 'stellar-sdk'
import { deleteOfferRequest, getDistributionAccount, getUser } from '../Mongo';
import { runOfferTransaction, runTransaction } from '../Node/makeTx';

const OfferRequest = (props) => {
    const { offerRequest, user } = props;

    const makeTransaction = async (buyer, assetName, amount) => {
        const [issuerAccount] = await getUser(user.email.split("@")[0])
        const [recAccount] = await getUser(buyer);
        console.log(recAccount)
        const ownerId = issuerAccount._id.toString();
        const [distributionAccount] = await getDistributionAccount(assetName, ownerId)
        console.log(distributionAccount)
        const asset = new Stellar.Asset(assetName, issuerAccount.publicKey)
        console.log(issuerAccount, recAccount, amount)
        const transaction = await runOfferTransaction(issuerAccount, distributionAccount, recAccount, asset, amount)
        console.log("success", transaction)
        await deleteOfferRequest(assetName, buyer)

    }

    useEffect(() => {
        console.log(offerRequest)
    })

    return (
        <>
            <div className=" align-items-center h-100">
                {
                    offerRequest.length !== 0 ? (
                        <table className="table table-hover mt-2">
                            <thead className="thead-dark">
                                <tr className="text-center">
                                    <th scope="col">#</th>
                                    <th scope="col">Buyer</th>
                                    <th scope="col">Selling Asset</th>
                                    <th scope="col">Buying to Selling Ratio</th>
                                </tr>

                            </thead>
                            <tbody>
                                {

                                    offerRequest &&
                                    offerRequest.map((item, index) => {

                                        return (
                                            <>
                                                <tr className="p-3 text-center" key={index}>
                                                    <th>{index + 1}</th>
                                                    <td scope="row">{item.buyer}</td>
                                                    <td>{item.asset}</td>
                                                    <td>{item.price}</td>
                                                    <td><button type="button" className="btn btn-primary" onClick={() => makeTransaction(item.buyer, item.asset, item.amount)}>Confirm</button></td>
                                                    <td><button type="button" className="btn btn-danger" onClick={async () => await deleteOfferRequest(item.asset, item.buyer)}>Reject</button></td>
                                                </tr>

                                            </>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    ) : (<h3 className="text-center">No Offer Request till Now</h3>)
                }
                <div className="text-center mt-3">
                    <Link to="/"> <button type="button" className="btn btn-primary text-center w-3" >Back</button> </Link>
                </div>
            </div>

        </>
    )
}

export default OfferRequest
