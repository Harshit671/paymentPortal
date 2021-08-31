import { Switch, Route } from "react-router-dom";

//views - user
import Home from '../viewsaa/home';


const routes =[

  { path:'/home', component: Home, auth:true },
  
]

export default function Routes() {

  return (
    <Switch>
      {routes.map ((item,i)=>(
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