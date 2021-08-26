import React from 'react'
import { Link, useHistory } from 'react-router-dom';
import './Hom.css';

const Assets = (props) => {
    const history = useHistory();
    const { assetList, setAssetCode } = props;

    const makeOffer = (assetCode) => {
        setAssetCode(assetCode);
        history.push("./makeoffer");
    }
    return (

        <>
            <div className=" align-items-center h-100">
                {
                    assetList.length !== 0 ? (
                        <table className="table table-hover mt-2">
                            <thead className="thead-dark">
                                <tr className="text-center">
                                    <th scope="col">#</th>
                                    <th scope="col">Asset Name</th>
                                    <th scope="col">Asset Type</th>
                                    <th scope="col">Amount</th>
                                </tr>

                            </thead>
                            <tbody>
                                {

                                    assetList &&
                                    assetList.map((item, index) => {
                                        return (
                                            <>
                                                <tr className="p-3 text-center" key={index}>
                                                    <th>{index + 1}</th>
                                                    <td scope="row">{item.asset_code}</td>
                                                    <td>{item.asset_type}</td>
                                                    <td>{item.amount}</td>
                                                    <td><button type="button" className="btn btn-primary" onClick={() => makeOffer(item.asset_code)}>Make Offer</button></td>
                                                </tr>

                                            </>
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

export default Assets

