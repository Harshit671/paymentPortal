import React from 'react'
import { Link } from 'react-router-dom';
import { useStateValue } from '../context/authcontext';
import '../media/home.css'
import Firebase from '../services/Firebase';
import Data from '../data/navs-header-main.json'

const Navbar = () => {
    const [{ user }, dispatch] = useStateValue();
    const handleLogout = () => {
        Firebase.auth().signOut();
    };
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-dark  ">
            <a className="navbar-brand " href="#">{`Welcome ${user.toUpperCase()}`}</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="nav navbar-nav navbar-center">
                    {
                        Data.data.map((item, index) => {
                            return (
                                <li key={index} className={`nav-item ${item.actv}`}>
                                    <Link to={item.link}><a className="nav-link" href="#">{item.name}</a></Link>
                                </li>
                            )
                        })
                        //                     <li className="nav-item active">
                        //                         <a className="nav-link" href="/">Home <span className="sr-only">(current)</span></a>
                        //                     </li>
                        //                     <li className="nav-item" >
                        //                         <Link to="/assetlist"><a className="nav-link" href="#">Assets</a></Link>
                        //                     </li>
                        //                     <li className="nav-item" >
                        //                         <Link to="/offerlist"><a className="nav-link" href="#">Offers</a></Link>
                        //                     </li>
                        //                     <li className="nav-item">
                        //                         <Link to="/offerrequest"><a className="nav-link" href="#">Transfers</a></Link>
                        //                     </li>
                        // }
                    }
                </ul>
                <div className="navbar-nav ms-auto">
                    <button className="btn btn-outline-success my-2 my-sm-0 ml-3" onClick={handleLogout} >Logout</button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
