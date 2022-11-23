import React from 'react';
import { Button, Drawer, IconButton } from '@mui/material';
import './index.css';
import * as PropTypes from 'prop-types';
import { setDisconnect } from '../../../actions/account';
import { connect } from 'react-redux';
import variables from '../../../utils/variables';
import Icon from '../../../components/Icon';
import CopyButton from '../../../components/CopyButton';
import { commaSeparator, splitDecimals } from '../../../utils/numbers';
import { withRouter } from 'react-router';
import IBCTokens from './IBCTokens';
import {
    fetchOwnerCollections,
    fetchOwnerNFTs,
    showDepositeDialog,
    showWithdrawDialog,
} from '../../../actions/myAccount';
import DepositeDialog from '../../MyAccount/IBCTokens/DepositeDialog';
import WithDrawDialog from '../../MyAccount/IBCTokens/WithDrawDialog';
import flixToken from '../../../assets/tokens/flix.svg';
import Collections from './Collections';
import NFTs from './NFTs';
import { config, FaucetList } from '../../../config';
import { fetchFaucetClaim, fetchIBCBalanceList, showFaucetDialog } from '../../../actions/faucet';
import { connectIBCAccount } from '../../../actions/account/IBCTokens';
import TotalValueTraded from './TotalValueTraded';
import { fetchAccountTokensTraded } from '../../../actions/marketplace';
import refreshIcon from '../../../assets/refresh.svg';
import { fetchBalance } from '../../../actions/account/BCDetails';
import FeeGrant from './FeeGrant';
import '../../MyAccount/IBCTokens/index.css';

class SidePanel extends React.Component {
    constructor (props) {
        super(props);

        this.handleDisconnect = this.handleDisconnect.bind(this);
        this.handleRedirect = this.handleRedirect.bind(this);
        this.handleFaucet = this.handleFaucet.bind(this);
        this.handleRefresh = this.handleRefresh.bind(this);
    }

    componentDidUpdate (pp, ps, ss) {
        if (pp.keys && pp.keys.bech32Address && this.props.keys && this.props.keys.bech32Address &&
            (pp.keys.bech32Address !== this.props.keys.bech32Address)) {
            this.props.fetchOwnerCollections(this.props.keys.bech32Address);
            this.props.fetchOwnerNFTs(this.props.keys.bech32Address);
            this.props.fetchAccountTokensTraded(this.props.keys.bech32Address);
        }
    }

    handleRefresh () {
        if (this.props.address) {
            this.props.fetchOwnerCollections(this.props.address);
            this.props.fetchOwnerNFTs(this.props.address);
            this.props.fetchAccountTokensTraded(this.props.address);
            this.props.fetchBalance(this.props.address);
        }
    }

    handleDisconnect () {
        this.props.onClose();
        this.props.setDisconnect();
        localStorage.removeItem('of_nucleus_address');
        localStorage.removeItem('of_marketplace_wallet_connect');
        if (this.props.walletConnector && this.props.walletConnector._connected) {
            this.props.walletConnector && this.props.walletConnector.killSession();
        }
    }

    handleRedirect (value) {
        this.props.onClose();
        this.props.history.push(`/account/${this.props.address}/${value}`);
    }

    handleFaucet () {
        const list = [...FaucetList];
        list.splice(0, 1);

        if (this.props.faucetClaim && !this.props.faucetClaim.claim && !this.props.faucetClaimInProgress) {
            this.props.fetchFaucetClaim(this.props.address);
        }

        if (this.props.balanceList && !this.props.balanceList.length && !this.props.balanceListInProgress) {
            list.map((value) => {
                const config = {
                    RPC_URL: value && value.network && value.network.rpc_address,
                    REST_URL: value && value.network && value.network.api_address,
                    CHAIN_ID: value && value.network && value.network.chain_id,
                    CHAIN_NAME: value && value.network && value.network.name,
                    COIN_DENOM: value && value.network && value.network.display_denom,
                    COIN_MINIMAL_DENOM: value && value.network && value.network.denom,
                    COIN_DECIMALS: value && value.network && value.network.decimals,
                    PREFIX: value && value.network && value.network.address_prefix,
                };

                this.props.connectIBCAccount(config, (address) => {
                    this.props.fetchIBCBalanceList(config.REST_URL, address[0].address);
                });

                return null;
            });
        }

        this.props.showFaucetDialog();
        this.props.onClose();
    }

    render () {
        const denom = this.props.chain && this.props.chain.ibc_denom_hash
            ? this.props.chain.ibc_denom_hash
            : config.COIN_MINIMAL_DENOM;
        const decimals = this.props.chain && this.props.chain.network && this.props.chain.network.decimals
            ? this.props.chain.network.decimals
            : config.COIN_DECIMALS;
        const ibcToken = denom && this.props.ibcTokensList && this.props.ibcTokensList.length &&
            this.props.ibcTokensList.find((val) => val && val.ibc_denom_hash && (val.ibc_denom_hash === denom));

        let balance = this.props.balance && this.props.balance.length && this.props.balance.find((val) => val.denom === denom);
        balance = balance && balance.amount && splitDecimals(balance.amount / (10 ** decimals));
        return (
            <Drawer
                anchor="right"
                className="side_panel"
                open={this.props.open}
                onClose={this.props.onClose}>
                <div className="side_panel_content scroll_bar">
                    <div
                        className="heading">
                        <div className="heading_left">
                            <h2>{variables[this.props.lang]['account_overview']}</h2>
                            <img
                                alt="refresh"
                                src={refreshIcon}
                                onClick={() => this.handleRefresh()}/>
                        </div>
                        <div className="heading_right">
                            <Button
                                className="primary_button"
                                onClick={this.handleFaucet}>
                                <span>{variables[this.props.lang].claim}</span>
                            </Button>
                            <p
                                className="see_all"
                                onClick={() => this.handleRedirect('nfts')}>{variables[this.props.lang]['goto_account']} &#8594;</p>
                        </div>
                    </div>
                    <div className="network">
                        <div className="header">
                            <h3>OmniFlix Network</h3>
                            <div className="chain_id">
                                <p>Chain:&nbsp;</p>
                                {config.CHAIN_ID}
                            </div>
                        </div>
                        <div className="content">
                            <div className="row">
                                <div className="address">
                                    <p>{variables[this.props.lang]['connected_with_keplr']}</p>
                                    <div className="copy_div">
                                        <div className="hash_text" title={this.props.address}>
                                            <p className="name">{this.props.address}</p>
                                            {this.props.address.slice(this.props.address.length - 6, this.props.address.length)}
                                        </div>
                                        <CopyButton data={this.props.address}/>
                                    </div>
                                </div>
                                <IconButton onClick={() => this.handleRedirect('nfts')}>
                                    <Icon className="re_direct" icon="re_direct"/>
                                </IconButton>
                            </div>
                            <p className="balance">
                                <img alt="icon" src={flixToken}/>
                                {(ibcToken && ibcToken.network && ibcToken.network.display_denom) || config.COIN_DENOM}&nbsp;
                                <span>
                                    {balance && balance.length
                                        ? <>
                                            {balance.length && balance[0] && commaSeparator(balance[0])}
                                            {balance.length && balance[1] &&
                                                <span>.{balance.length && balance[1]}</span>}
                                        </>
                                        : 0}
                                </span>
                            </p>
                        </div>
                    </div>
                    <FeeGrant/>
                    <div className="recently_collected ibc_tokens">
                        <div className="header">
                            <p className="sub_heading">{variables[this.props.lang]['ibc_tokens']}</p>
                            <p
                                className="see_all"
                                onClick={() => this.handleRedirect('ibc_tokens')}>{variables[this.props.lang]['see_all']} &#8594;</p>
                        </div>
                        <IBCTokens/>
                        <DepositeDialog/>
                        <WithDrawDialog/>
                    </div>
                    <div className="recently_collected">
                        <div className="header">
                            <p className="sub_heading">{variables[this.props.lang]['recent_collections']}</p>
                            <p
                                className="see_all"
                                onClick={() => this.handleRedirect('collections')}>{variables[this.props.lang]['see_all']} &#8594;</p>
                        </div>
                        <Collections/>
                    </div>
                    <div className="recently_collected">
                        <div className="header">
                            <p className="sub_heading">{variables[this.props.lang]['my_nfts']}</p>
                            <p
                                className="see_all"
                                onClick={() => this.handleRedirect('nfts')}>{variables[this.props.lang]['see_all']} &#8594;</p>
                        </div>
                        <NFTs/>
                    </div>
                    <div className="recently_collected ibc_tokens">
                        <div className="header">
                            <p className="sub_heading">{variables[this.props.lang]['my_total_traded_value']}</p>
                        </div>
                        <TotalValueTraded/>
                    </div>
                    <div className="footer">
                        <Button className="disconnect_button" onClick={this.handleDisconnect}>
                            {variables[this.props.lang].disconnect}
                        </Button>
                    </div>
                </div>
                <DepositeDialog/>
                <WithDrawDialog/>
            </Drawer>
        );
    }
}

SidePanel.propTypes = {
    address: PropTypes.string.isRequired,
    balance: PropTypes.array.isRequired,
    balanceList: PropTypes.array.isRequired,
    balanceListInProgress: PropTypes.bool.isRequired,
    chain: PropTypes.object.isRequired,
    connectIBCAccount: PropTypes.func.isRequired,
    faucetClaim: PropTypes.object.isRequired,
    faucetClaimInProgress: PropTypes.bool.isRequired,
    fetchAccountTokensTraded: PropTypes.func.isRequired,
    fetchBalance: PropTypes.func.isRequired,
    fetchFaucetClaim: PropTypes.func.isRequired,
    fetchIBCBalanceList: PropTypes.func.isRequired,
    fetchOwnerCollections: PropTypes.func.isRequired,
    fetchOwnerNFTs: PropTypes.func.isRequired,
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
    }).isRequired,
    ibcTokensList: PropTypes.array.isRequired,
    keys: PropTypes.object.isRequired,
    lang: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    setDisconnect: PropTypes.func.isRequired,
    showDepositeDialog: PropTypes.func.isRequired,
    showFaucetDialog: PropTypes.func.isRequired,
    showWithdrawDialog: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    walletConnector: PropTypes.object,
};

const stateToProps = (state) => {
    return {
        address: state.account.wallet.connection.address,
        balance: state.account.bc.balance.value,
        balanceList: state.faucet.balanceList.value,
        balanceListInProgress: state.faucet.balanceList.inProgress,
        chain: state.account.chainID.value,
        keys: state.account.wallet.connection.keys,
        ibcTokensList: state.marketplace.ibcTokensList.value,
        faucetClaim: state.faucet.faucetClaim.value,
        faucetClaimInProgress: state.faucet.faucetClaim.inProgress,
        lang: state.language,
        walletConnector: state.account.wallet.connection.walletConnector,
    };
};

const actionToProps = {
    setDisconnect,
    showDepositeDialog,
    showWithdrawDialog,
    fetchFaucetClaim,
    fetchOwnerNFTs,
    fetchOwnerCollections,
    showFaucetDialog,
    fetchIBCBalanceList,
    connectIBCAccount,
    fetchAccountTokensTraded,
    fetchBalance,
};

export default withRouter(connect(stateToProps, actionToProps)(SidePanel));
