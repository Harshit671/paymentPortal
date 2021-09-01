import { Switch, Route } from "react-router-dom";
import AllOffers from "../components/all-market-offers";
import Makeoffer from "../components/create-offer-page";
import Transaction from "../components/make-transaction";
import OfferRequest from "../components/offer-request";
import Assets from "../components/user-assets";
import OfferList from "../components/user-created-offers";
import Home from "../viewsaa/home";

const routes = [
  { path: '/', component: Home, auth: true },
  { path: '/assetlist', component: Assets, auth: true },
  { path: '/offerlist', component: OfferList, auth: true },
  { path: '/transaction', component: Transaction, auth: true },
  { path: '/alloffers', component: AllOffers, auth: true },
  { path: '/offerrequest', component: OfferRequest, auth: true },
  { path: '/makeoffer', component: Makeoffer, auth: true },
]

export default function Routes() {
  return (
    <Switch>
      {routes.map((item, i) => (
        <Route
          key={i}
          path={item.path}
          component={item.component}
          exact
        />
      ))}
    </Switch>
  );
}