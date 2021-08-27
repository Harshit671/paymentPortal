import React from 'react'
import './Hom.css'

const Navbar = ({ getAssets, listOffers, offerRequest, handleLogout, user }) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-dark  ">
            <a className="navbar-brand " href="#">{`Welcome ${user.toUpperCase()}`}</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="nav navbar-nav navbar-center">
                    <li className="nav-item active">
                        <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
                    </li>
                    <li className="nav-item" onClick={() => getAssets()}>
                        <a className="nav-link" href="#">Assets</a>
                    </li>
                    <li className="nav-item" onClick={() => listOffers()} >
                        <a className="nav-link" href="#">Offers</a>
                    </li>
                    <li className="nav-item" onClick={() => offerRequest()}>
                        <a className="nav-link" href="#">Transfers</a>
                    </li>
                </ul>
                <div className="navbar-nav ms-auto">
                    <button className="btn btn-outline-success my-2 my-sm-0 ml-3" onClick={() => handleLogout()} >Logout</button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
