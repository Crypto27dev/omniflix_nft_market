import React from 'react';
import { connect } from 'react-redux';
import * as PropTypes from 'prop-types';
import { hideSnackbar } from '../actions/snackbar';
import Snackbar from '../components/Snackbar';

const SnackbarMessage = (props) => {
    return (
        <Snackbar
            explorer={props.explorer}
            hash={props.hash}
            manual={props.ibcTxInProgress}
            message={props.message}
            open={props.open}
            progress={props.ibcTxInProgress || props.variant === 'processing'}
            variant={props.variant}
            onClose={props.onClose}/>
    );
};

SnackbarMessage.propTypes = {
    ibcTxInProgress: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    explorer: PropTypes.string,
    hash: PropTypes.string,
    variant: PropTypes.string,
};

const stateToProps = (state) => {
    return {
        explorer: state.snackbar.explorer,
        ibcTxInProgress: state.account.ibc.ibcTxInProgress,
        open: state.snackbar.open,
        message: state.snackbar.message,
        variant: state.snackbar.variant,
        hash: state.snackbar.hash,
    };
};

const actionsToProps = {
    onClose: hideSnackbar,
};

export default connect(stateToProps, actionsToProps)(SnackbarMessage);
