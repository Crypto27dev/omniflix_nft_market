import { combineReducers } from 'redux';
import language from './language';
import snackbar from './snackbar';
import account from './account';
import navbar from './navbar';
import filters from './filters';
import explore from './explore';
import marketplace from './marketplace';
import activity from './activity';
import myAccount from './myAccount';
import faucet from './faucet';
import collection from './collection';
import campaign from './campaign';
import home from './home';
import auctions from './auctions';

export default combineReducers({
    account,
    auctions,
    language,
    snackbar,
    explore,
    navbar,
    filters,
    marketplace,
    activity,
    myAccount,
    faucet,
    collection,
    campaign,
    home,
});
