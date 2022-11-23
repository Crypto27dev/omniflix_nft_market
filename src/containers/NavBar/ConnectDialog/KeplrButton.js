import React, { useState } from 'react';
import { Button } from '@mui/material';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { initializeChain } from '../../../actions/account/wallet';
import variables from '../../../utils/variables';
import { fetchAllowances, fetchBalance } from '../../../actions/account/BCDetails';
import { hideConnectDialog } from '../../../actions/navbar';
import keplrIcon from '../../../assets/wallets/keplr.png';

const KeplrButton = (props) => {
    const [inProgress, setInProgress] = useState(false);

    const initializeKeplr = () => {
        setInProgress(true);
        props.initializeChain((address) => {
            setInProgress(false);
            if (!address) {
                window.onload = () => this.initializeKeplr();
                return;
            }

            localStorage.setItem('of_nucleus_address', address && address.length && address[0] && address[0].address);
            if ((address && address.length && address[0] && address[0].address) &&
                (props.balance.length === 0) && !props.balanceInProgress) {
                props.fetchBalance(address[0].address);
            }
            if ((address && address.length && address[0] && address[0].address) &&
                props.allowances && (props.allowances.length === 0) && !props.allowancesInProgress) {
                props.fetchAllowances(address[0].address);
            }
            props.hideConnectDialog();
        });
    };

    const connectInProgress = props.inProgress && inProgress;
    return (
        <Button
            className="keplr_button"
            disabled={connectInProgress}
            variant="contained"
            onClick={initializeKeplr}>
            <img alt="logo" src={keplrIcon}/>
            {connectInProgress ? variables[props.lang].connecting + '...' : variables[props.lang]['keplr_wallet']}
        </Button>
    );
};

KeplrButton.propTypes = {
    allowances: PropTypes.array.isRequired,
    allowancesInProgress: PropTypes.bool.isRequired,
    balance: PropTypes.array.isRequired,
    balanceInProgress: PropTypes.bool.isRequired,
    fetchAllowances: PropTypes.func.isRequired,
    fetchBalance: PropTypes.func.isRequired,
    hideConnectDialog: PropTypes.func.isRequired,
    inProgress: PropTypes.bool.isRequired,
    initializeChain: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
};

const stateToProps = (state) => {
    return {
        allowances: state.account.bc.allowances.value,
        allowancesInProgress: state.account.bc.allowances.inProgress,
        inProgress: state.account.wallet.connection.inProgress,
        balance: state.account.bc.balance.value,
        balanceInProgress: state.account.bc.balance.inProgress,
        lang: state.language,
    };
};

const actionToProps = {
    initializeChain,
    fetchAllowances,
    fetchBalance,
    hideConnectDialog,
};

export default connect(stateToProps, actionToProps)(KeplrButton);
