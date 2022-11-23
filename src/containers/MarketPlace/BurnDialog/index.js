import { Dialog, DialogContent } from '@material-ui/core';
import React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './index.css';
import Burn from './Burn';
import { hideBurnDialog } from '../../../actions/marketplace';

const BurnDialog = (props) => {
    return (
        <Dialog
            aria-describedby="preview-dialog-description"
            aria-labelledby="preview-dialog-title"
            className="dialog preview_dialog menu_action_dialog common_action_dialog"
            open={props.open}
            onClose={props.handleClose}>
            <DialogContent className="dialog_content scroll_bar">
                <Burn asset={props.asset}/>
            </DialogContent>
        </Dialog>
    );
};

BurnDialog.propTypes = {
    asset: PropTypes.object.isRequired,
    handleClose: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
};

const stateToProps = (state) => {
    return {
        open: state.marketplace.burnDialog.open,
        asset: state.marketplace.burnDialog.asset,
        lang: state.language,
    };
};

const actionToProps = {
    handleClose: hideBurnDialog,
};

export default connect(stateToProps, actionToProps)(BurnDialog);
