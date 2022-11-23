import React from 'react';
import * as PropTypes from 'prop-types';
import { Dialog } from '@material-ui/core';
import variables from '../../../utils/variables';
import { connect } from 'react-redux';
import './index.css';
import { hideConnectDialog } from '../../../actions/navbar';
import KeplrButton from './KeplrButton';
// import WalletConnectButton from './WalletConnectButton';

const ConnectDialog = (props) => {
    return (
        <Dialog
            aria-describedby="connect with OmniFlix marketplace"
            aria-labelledby="Connect account"
            className="dialog connect_dialog"
            open={props.open}
            onClose={props.handleClose}>
            <div className="connect_dialog_content">
                <h2 className="title">{variables[props.lang]['connect_wallet']}</h2>
                <div className="buttons_div">
                    <KeplrButton/>
                    {/* <WalletConnectButton/> */}
                </div>
            </div>
        </Dialog>
    );
};

ConnectDialog.propTypes = {
    handleClose: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        open: state.navbar.connectDialog,
    };
};

const actionToProps = {
    handleClose: hideConnectDialog,
};

export default connect(stateToProps, actionToProps)(ConnectDialog);
