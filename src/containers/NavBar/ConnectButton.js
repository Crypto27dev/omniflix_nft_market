import React from 'react';
import { Button } from '@mui/material';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import variables from '../../utils/variables';
import walletIcon from '../../assets/navbar/wallet.svg';
import { showConnectDialog } from '../../actions/navbar';

const ConnectButton = (props) => {
    return (
        <Button className="connect_button" onClick={props.showConnectDialog}>
            <img alt="wallet" src={walletIcon}/>
            <p>{variables[props.lang].connect}</p>
        </Button>
    );
};

ConnectButton.propTypes = {
    lang: PropTypes.string.isRequired,
    showConnectDialog: PropTypes.func.isRequired,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
    };
};

const actionToProps = {
    showConnectDialog,
};

export default connect(stateToProps, actionToProps)(ConnectButton);
