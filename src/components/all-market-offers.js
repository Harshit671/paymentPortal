import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { addOffers, getAllDistributionAccount, getUserByPublicKey } from '../services/Mongo';
import { useStateValue } from '../context/authcontext';

const AllOffers = (props) => {
    // const { user } = props
    const [{ user }, dispatch] = useStateValue();
    const [allOffers, setAllOffers] = useState([]);
    const [apply, setApply] = useState(false);
    var count = 0;
    const addOffer = async ([data]) => {
        console.log(data)
        await addOffers(data.selling.asset_code, data.price, data.selling.asset_issuer, user, data.amount)
        setApply(true)
    }

    useEffect(async () => {
        setAllOffers([])
        const users = await getAllDistributionAccount();
        const usersPublicKey = users.map(item => item.publicKey)
        usersPublicKey.map(async item => {
            await fetch(`https://horizon-testnet.stellar.org/offers?seller=${item}`).then(data => data.json()).then(info => setAllOffers(prevList => [...prevList, info._embedded.records]));
        })
    }, [])
    return (

        <>
            <div className=" align-items-center h-100">
                {
                    allOffers.length !== 0 ? (
                        <table className="table table-hover mt-2">
                            <thead className="thead-dark">
                                <tr className="text-center">
                                    <th scope="col">#</th>
                                    <th scope="col">Seller</th>
                                    <th scope="col">Selling Asset</th>
                                    <th scope="col">Buying to Selling Ratio</th>
                                </tr>

                            </thead>
                            <tbody>
                                {

                                    allOffers &&
                                    allOffers.map((item, index) => {
                                        return (
                                            item.length !== 0 ? (
                                                item.map((data, id) => {
                                                    count++
                                                    return (
                                                        <>
                                                            <tr className="p-3 text-center" key={count}>
                                                                <th>{count}</th>
                                                                <td scope="row">{data.selling.asset_issuer}</td>
                                                                <td>{data.selling.asset_code}</td>
                                                                <td>{data.price}</td>
                                                                <td><button type="button" className="btn btn-primary" onClick={() => addOffer([data])}>Buy</button></td>
                                                            </tr>

                                                        </>
                                                    )
                                                })
                                            ) : null
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

export default AllOffers
