import React, { useEffect, useState } from 'react'
import { useStateValue } from '../context/authcontext';
import '../media/home.css'
import { checkedAccounts } from '../services/get-balance'

const Balance = () => {
    const [{ keys }, dispatch] = useStateValue();
    const [balance, setBalance] = useState({})

    useEffect(async () => {
        console.log(keys)
        if (keys) {
            await checkedAccounts(keys.public).then(res => setBalance(res)).catch(err => console.log(err));

        }
    }, [keys])
    return (
        <div className="balance my-2">
            <h2 className="text-center">Balance  <span><i className="bi bi-wallet-fill"></i></span>
            </h2>
            <div className="list">
                {
                    balance.balances &&
                    balance.balances.map((item, index) => {
                        return (
                            <>
                                <div key={index} className="borderList">
                                    <h4>{index === balance.balances.length - 1 ? item.asset_type : item.asset_code}</h4>
                                    <p>{item.balance}</p>
                                </div>
                            </>
                        )
                    })
                }
            </div>

        </div>




    )
}

export default Balance
