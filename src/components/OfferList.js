import React, { useEffect, useState } from 'react'
import Stellar from 'stellar-sdk'
import { Link } from 'react-router-dom';
import { getDistributionAccountByPublicKey } from '../Mongo';
import { manageBuyOffer } from '../Node/manageBuyOffer';

const OfferList = (props) => {
    const { offerList } = props;
    const [newOfferList, setNewOfferList] = useState([]);

    const deleteOffer = async (index, id) => {
        console.log(index, id)
        const deleteId = offerList[index][id].seller
        const deleteAsset = new Stellar.Asset(offerList[index][id].selling.asset_code, offerList[index][id].selling.asset_issuer)
        const [distributionAccount] = await getDistributionAccountByPublicKey(deleteId);
        const offer = manageBuyOffer(distributionAccount, deleteAsset, "0", offerList[index][id].id, true);
        console.log(newOfferList)
        if (offerList.length > 1) {
            const unchangedArray = newOfferList.filter((elem, delId) => delId !== index)
            console.log(unchangedArray)
            const updateOfferList = newOfferList.filter((elem, delId) => delId === index)
            console.log(unchangedArray)
            const updateArray = updateOfferList.filter((elem, delId) => delId !== id)
            console.log(unchangedArray)
            const finalArray = unchangedArray.splice(index, 0, updateArray)
            console.log(unchangedArray)
            setNewOfferList(finalArray)
        }
        else {
            const updateArray = newOfferList[0].filter((elem, delId) => delId !== id)
            console.log([updateArray])
            setNewOfferList([updateArray])
        }
        // 
    }

    useEffect(() => {
        console.log(offerList)
        setNewOfferList(offerList)
    }, [])
    return (
        <>
            <div className=" align-items-center h-100">
                {
                    newOfferList.length !== 0 ? (
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

                                    newOfferList &&
                                    newOfferList.map((item, index) => {
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
