import React from 'react'
import './Hom.css'

const Balance = ({ balance }) => {
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
