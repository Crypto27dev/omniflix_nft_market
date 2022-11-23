import React from 'react';
import { Route, Switch } from 'react-router-dom';
import NavBar from './containers/NavBar';
import MarketPlace from './containers/MarketPlace';
import Collections from './containers/Collections';
import Home from './containers/Home';
import SingleAsset from './containers/SingleAsset';
import SingleCollection from './containers/SingleCollection';
import MyAccount from './containers/MyAccount';

const routes = [{
    path: '/home',
    component: Home,
}, {
    path: '/nfts',
    component: MarketPlace,
}, {
    path: '/collections',
    component: Collections,
}, {
    path: '/account/:address/:tab',
    component: MyAccount,
}, {
    path: '/account/:address',
    component: MyAccount,
}, {
    path: '/collection/:id',
    component: SingleCollection,
}, {
    path: '/nft/:nftID',
    component: SingleAsset,
}];

const Router = () => {
    return (
        <div className="main_content">
            <NavBar/>
            <div className="content_div">
                <Switch>
                    {routes.map((route) =>
                        <Route
                            key={route.path}
                            exact
                            component={route.component}
                            path={route.path}/>,
                    )}
                    <Route
                        exact
                        component={Home}
                        path="*"/>
                </Switch>
            </div>
        </div>
    );
};

export default Router;
