import React, { Component } from 'react';
import { Button } from '@mui/material';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { initializeChain, walletConnect } from '../../actions/account/wallet';
import { setDisconnect } from '../../actions/account';
import { fetchAllowances, fetchBalance } from '../../actions/account/BCDetails';
import DotsLoading from '../../components/DotsLoading';
import SidePanel from './SidePanel';
import { fetchAccountTokensTraded, fetchIBCTokensList } from '../../actions/marketplace';
import { config, FaucetList } from '../../config';
import { connectIBCAccount } from '../../actions/account/IBCTokens';
import { fetchIBCBalanceList } from '../../actions/faucet';
import { hideSideBar } from '../../actions/navbar';
import { fetchOwnerCollections, fetchOwnerNFTs } from '../../actions/myAccount';
import ProfileSkeletonLoader from '../../components/SkeletonLoader/ProfileSkeletonLoader';
import ConnectButton from './ConnectButton';
import { withRouter } from 'react-router';

class ProfilePopover extends Component {
    constructor (props) {
        super(props);
        this.state = {
            open: false,
        };

        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.initializeKeplr = this.initializeKeplr.bind(this);
        this.initKeplr = this.initKeplr.bind(this);
        this.handleIBCList = this.handleIBCList.bind(this);
        this.handleWalletConnect = this.handleWalletConnect.bind(this);
    }

    componentDidMount () {
        if (this.props.ibcTokensList.length === 0 && !this.props.ibcTokensListInProgress) {
            this.props.fetchIBCTokensList();
        }
        if (this.props.address === '' && localStorage.getItem('of_nucleus_address')) {
            if (localStorage.getItem('of_marketplace_wallet_connect')) {
                this.handleWalletConnect();

                return;
            }
            // used set time out to omit the image loading issue with window.onload
            setTimeout(() => {
                this.initializeKeplr();
            }, 600);
        } else {
            if ((this.props.address) &&
                (this.props.balance.length === 0) && !this.props.balanceInProgress) {
                this.props.fetchBalance(this.props.address);
            }
            if (this.props.address && this.props.allowances &&
                (this.props.allowances.length === 0) && !this.props.allowancesInProgress) {
                this.props.fetchAllowances(this.props.address);
            }
        }

        window.addEventListener('keplr_keystorechange', () => {
            this.props.setDisconnect();
            this.initKeplr();
            if (this.props.faucetDialog) {
                this.handleIBCList();
            }
        });
    }

    componentWillUnmount () {
        window.removeEventListener('keplr_keystorechange', this.initKeplr);
    }

    handleWalletConnect () {
        this.props.walletConnect(null, (connector, account) => {
            if (account && account.length === 0) {
                connector.killSession();

                return;
            }

            const address = account && account.length && account[0] && account[0].bech32Address;
            if (address) {
                if (address && (this.props.balance.length === 0) && !this.props.balanceInProgress) {
                    this.props.fetchBalance(address);
                }
                if (address && this.props.allowances && (this.props.allowances.length === 0) && !this.props.allowancesInProgress) {
                    this.props.fetchAllowances(address);
                }
            }
        });
    }

    initKeplr () {
        this.props.initializeChain((address) => {
            this.props.fetchBalance(address[0].address);
            this.props.fetchAllowances(address[0].address);
        });
    }

    initializeKeplr () {
        this.props.initializeChain((address) => {
            if (!address) {
                window.onload = () => this.initializeKeplr();
                return;
            }

            localStorage.setItem('of_nucleus_address', address && address.length && address[0] && address[0].address);
            if ((address && address.length && address[0] && address[0].address) &&
                (this.props.balance.length === 0) && !this.props.balanceInProgress) {
                this.props.fetchBalance(address[0].address);
            }
            if ((address && address.length && address[0] && address[0].address) &&
                this.props.allowances && (this.props.allowances.length === 0) && !this.props.allowancesInProgress) {
                this.props.fetchAllowances(address[0].address);
            }
        });
    }

    handleIBCList () {
        const list = [...FaucetList];

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

    handleOpen () {
        if (this.props.address) {
            if (this.props.collections && !this.props.collections.length && !this.props.collectionsInProgress) {
                this.props.fetchOwnerCollections(this.props.address);
            }
            if (this.props.nftSList && !this.props.nftSList.length && !this.props.nftSInProgress) {
                this.props.fetchOwnerNFTs(this.props.address);
            }
            if (this.props.tokensTraded && Object.keys(this.props.tokensTraded) &&
                !Object.keys(this.props.tokensTraded).length && !this.props.tokensTradedInProgress) {
                this.props.fetchAccountTokensTraded(this.props.address);
            }
        }

        this.setState({
            open: true,
        });
        if (this.props.show) {
            const path = this.props.location && this.props.location.pathname && this.props.location.pathname.split('/')[1];
            if ((path === 'account') || (path === 'collection')) {
                document.body.style.overflow = null;
            }

            this.props.hideSideBar();
        }
    }

    handleClose () {
        this.setState({
            open: false,
        });
    }

    render () {
        const {
            address,
        } = this.props;
        const denom = this.props.chain && this.props.chain.ibc_denom_hash
            ? this.props.chain.ibc_denom_hash
            : config.COIN_MINIMAL_DENOM;
        const decimals = this.props.chain && this.props.chain.network && this.props.chain.network.decimals
            ? this.props.chain.network.decimals
            : config.COIN_DECIMALS;
        const ibcToken = denom && this.props.ibcTokensList && this.props.ibcTokensList.length &&
            this.props.ibcTokensList.find((val) => val && val.ibc_denom_hash && (val.ibc_denom_hash === denom));

        let balance = this.props.balance && this.props.balance.length && this.props.balance.find((val) => val.denom === denom);
        balance = balance && balance.amount && balance.amount / (10 ** decimals);

        return (
            <div className="profile">
                {this.props.address === '' && !localStorage.getItem('of_nucleus_address')
                    ? <ConnectButton/>
                    : (this.props.inProgress || this.props.balanceInProgress) &&
                    (this.props.address === '' && !localStorage.getItem('of_nucleus_address'))
                        ? <ProfileSkeletonLoader type="profile"/>
                        : <Button
                            className="profile_section"
                            variant="contained"
                            onClick={this.handleOpen}>
                            <div className="account">
                                {this.props.balanceInProgress
                                    ? <DotsLoading/>
                                    : balance
                                        ? <p className="balance">
                                            {balance} {(ibcToken && ibcToken.network && ibcToken.network.display_denom) || config.COIN_DENOM}
                                        </p>
                                        : <p className="balance">
                                            0 {(ibcToken && ibcToken.network && ibcToken.network.display_denom) || config.COIN_DENOM}
                                        </p>}
                                {this.props.inProgress && this.props.address === ''
                                    ? <DotsLoading/>
                                    : <div className="hash_text" title={address}>
                                        <p className="name">{address}</p>
                                        {address.slice(address.length - 6, address.length)}
                                    </div>}
                            </div>
                            <span className="profile_img"/>
                        </Button>}
                <SidePanel open={this.state.open} onClose={this.handleClose}/>
            </div>
        );
    }
}

ProfilePopover.propTypes = {
    address: PropTypes.string.isRequired,
    allowances: PropTypes.array.isRequired,
    allowancesInProgress: PropTypes.bool.isRequired,
    balance: PropTypes.array.isRequired,
    balanceInProgress: PropTypes.bool.isRequired,
    chain: PropTypes.object.isRequired,
    collections: PropTypes.array.isRequired,
    collectionsInProgress: PropTypes.bool.isRequired,
    connectIBCAccount: PropTypes.func.isRequired,
    faucetDialog: PropTypes.bool.isRequired,
    fetchAccountTokensTraded: PropTypes.func.isRequired,
    fetchAllowances: PropTypes.func.isRequired,
    fetchBalance: PropTypes.func.isRequired,
    fetchIBCBalanceList: PropTypes.func.isRequired,
    fetchIBCTokensList: PropTypes.func.isRequired,
    fetchOwnerCollections: PropTypes.func.isRequired,
    fetchOwnerNFTs: PropTypes.func.isRequired,
    hideSideBar: PropTypes.func.isRequired,
    ibcTokensList: PropTypes.array.isRequired,
    ibcTokensListInProgress: PropTypes.bool.isRequired,
    inProgress: PropTypes.bool.isRequired,
    initializeChain: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
    }).isRequired,
    nftSInProgress: PropTypes.bool.isRequired,
    nftSList: PropTypes.array.isRequired,
    setDisconnect: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired,
    tokensTraded: PropTypes.object.isRequired,
    tokensTradedInProgress: PropTypes.bool.isRequired,
    walletConnect: PropTypes.func.isRequired,
};

const stateToProps = (state) => {
    return {
        address: state.account.wallet.connection.address,
        allowances: state.account.bc.allowances.value,
        allowancesInProgress: state.account.bc.allowances.inProgress,
        inProgress: state.account.wallet.connection.inProgress,
        balance: state.account.bc.balance.value,
        balanceInProgress: state.account.bc.balance.inProgress,
        chain: state.account.chainID.value,
        collections: state.myAccount.ownerCollections.result,
        collectionsInProgress: state.myAccount.ownerCollections.inProgress,
        lang: state.language,
        nftSList: state.myAccount.ownerNFTs.result,
        nftSInProgress: state.myAccount.ownerNFTs.inProgress,
        ibcTokensList: state.marketplace.ibcTokensList.value,
        ibcTokensListInProgress: state.marketplace.ibcTokensList.inProgress,
        faucetDialog: state.faucet.faucetDialog.open,
        show: state.navbar.show,
        tokensTraded: state.marketplace.accountTokensTraded.result,
        tokensTradedInProgress: state.marketplace.accountTokensTraded.inProgress,
    };
};

const actionToProps = {
    setDisconnect,
    initializeChain,
    fetchAccountTokensTraded,
    fetchAllowances,
    fetchBalance,
    fetchIBCTokensList,
    fetchOwnerNFTs,
    fetchOwnerCollections,
    connectIBCAccount,
    fetchIBCBalanceList,
    hideSideBar,
    walletConnect,
};

export default withRouter(connect(stateToProps, actionToProps)(ProfilePopover));
