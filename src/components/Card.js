import React from 'react'
import { useHistory } from 'react-router-dom'
import './Hom.css'

const Card = ({ jointAccountOperation, issueAsset, listAllOffers, fundAccount }) => {
    const history = useHistory();
    const makeTransaction = () => {
        history.push("/transaction")
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
