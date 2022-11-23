import React from 'react';
import { Button } from '@mui/material';
import walletConnectIcon from '../../../assets/wallets/walletConnect.png';
import variables from '../../../utils/variables';
import * as PropTypes from 'prop-types';
import { hideConnectDialog } from '../../../actions/navbar';
import { connect } from 'react-redux';
import { walletConnect } from '../../../actions/account/wallet';
import { showMessage } from '../../../actions/snackbar';
import { fetchAllowances, fetchBalance } from '../../../actions/account/BCDetails';

const WalletConnectButton = (props) => {
    const handleConnect = () => {
        const address = localStorage.getItem('of_nucleus_address');

        props.walletConnect(address, (connector, account) => {
            if (account && account.length === 0) {
                props.showMessage(variables[props.lang]['chain_not_supported']);
                connector.killSession();

                return;
            }

            const address = account && account.length && account[0] && account[0].bech32Address;
            if (address) {
                localStorage.setItem('of_nucleus_address', address);
                const storageAccount = JSON.stringify(account);
                localStorage.setItem('of_marketplace_wallet_connect', storageAccount);
                if (address && (props.balance.length === 0) && !props.balanceInProgress) {
                    props.fetchBalance(address);
                }
                if (address && props.allowances && (props.allowances.length === 0) && !props.allowancesInProgress) {
                    props.fetchAllowances(address);
                }

                props.hideConnectDialog();
            }
        });
    };

    return (
        <Button
            className="wallet_connect_button"
            variant="contained"
            onClick={handleConnect}>
            <img alt="logo" src={walletConnectIcon}/>
            {variables[props.lang]['wallet_connect']}
        </Button>
    );
};

WalletConnectButton.propTypes = {
    allowances: PropTypes.array.isRequired,
    allowancesInProgress: PropTypes.bool.isRequired,
    balance: PropTypes.array.isRequired,
    balanceInProgress: PropTypes.bool.isRequired,
    fetchAllowances: PropTypes.func.isRequired,
    fetchBalance: PropTypes.func.isRequired,
    hideConnectDialog: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    showMessage: PropTypes.func.isRequired,
    walletConnect: PropTypes.func.isRequired,
};

const stateToProps = (state) => {
    return {
        allowances: state.account.bc.allowances.value,
        allowancesInProgress: state.account.bc.allowances.inProgress,
        balance: state.account.bc.balance.value,
        balanceInProgress: state.account.bc.balance.inProgress,
        lang: state.language,
    };
};

const actionToProps = {
    fetchAllowances,
    fetchBalance,
    hideConnectDialog,
    showMessage,
    walletConnect,
};

export default connect(stateToProps, actionToProps)(WalletConnectButton);
