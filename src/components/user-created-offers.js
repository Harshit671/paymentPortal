import React, { useEffect, useState } from 'react'
import Stellar from 'stellar-sdk'
import { Link } from 'react-router-dom';
import { getDistributionAccount, getDistributionAccountByPublicKey, getUser } from '../services/Mongo';
import { manageBuyOffer } from '../services/create-newoffer';
import { useStateValue } from '../context/authcontext';

const OfferList = () => {
    const [{ user }, dispatch] = useStateValue();
    const [offerList, setOfferList] = useState([])

    const deleteOffer = async (index, id) => {
        console.log(index, id)
        const deleteId = offerList[index][id].seller
        const deleteAsset = new Stellar.Asset(offerList[index][id].selling.asset_code, offerList[index][id].selling.asset_issuer)
        const [distributionAccount] = await getDistributionAccountByPublicKey(deleteId);
        const offer = manageBuyOffer(distributionAccount, deleteAsset, "0", offerList[index][id].id, true);
        console.log(offerList)
        if (offerList.length > 1) {
            const unchangedArray = offerList.filter((elem, delId) => delId !== index)
            console.log(unchangedArray)
            const updateOfferList = offerList.filter((elem, delId) => delId === index)
            console.log(unchangedArray)
            const updateArray = updateOfferList.filter((elem, delId) => delId !== id)
            console.log(unchangedArray)
            const finalArray = unchangedArray.splice(index, 0, updateArray)
            console.log(unchangedArray)
            setOfferList(finalArray)
        }
        else {
            const updateArray = offerList[0].filter((elem, delId) => delId !== id)
            console.log([updateArray])
            setOfferList([updateArray])
        }
        // 
    }

    useEffect(async () => {
        const [userDetail] = await getUser(user);
        const ownerId = userDetail._id.toString();
        const distributionAccount = await getDistributionAccount("", ownerId)
        const distributionKeys = distributionAccount.map(item => item.publicKey)
        console.log(distributionKeys)
        distributionKeys.map(async item => {
            await fetch(`https://horizon-testnet.stellar.org/offers?seller=${item}`)
                .then(data => data.json())
                .then(info => {
                    console.log(info);
                    setOfferList((prevList) => [...prevList, info._embedded.records])
                });
        })
    }, [])
    return (
        <>
            <div className=" align-items-center h-100">
                {
                    offerList.length !== 0 ? (
                        <table className="table table-hover mt-2">
                            <thead className="thead-dark">
                                <tr className="text-center">
                                    <th scope="col">#</th>
                                    <th scope="col">Selling Asset Name</th>
                                    <th scope="col">Amount Received</th>
                                    <th scope="col">Buying Asset Name</th>
                                </tr>

                            </thead>
                            <tbody>
                                {

                                    offerList &&
                                    offerList.map((item, index) => {
                                        return (
                                            item.map((data, id) => {
                                                return (
                                                    <>
                                                        <tr className="p-3 text-center" key={index + id}>
                                                            <th>{index + id + 1}</th>
                                                            <td scope="row">{data.selling.asset_code}</td>
                                                            <td>{data.amount}</td>
                                                            <td>{data.buying.asset_type}</td>
                                                            <td><button type="button" className="btn btn-primary" onClick={() => deleteOffer(index, id)}>Delete Offer</button></td>
                                                        </tr>
                                                    </>
                                                )
                                            })
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    ) : (<h3 className="text-center">No asset Issued for this account</h3>)
                }
                <div className="text-center mt-3">
                    <Link to="/"> <button type="button" className="btn btn-primary text-center w-3" >Back</button> </Link>
                </div>
            </div>
        </>
    )
}

export default OfferList
