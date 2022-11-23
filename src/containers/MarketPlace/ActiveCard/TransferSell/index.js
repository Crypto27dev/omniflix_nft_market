import React from 'react';
import './index.css';
import * as PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import variables from '../../../../utils/variables';
import { Button } from '@material-ui/core';
import { showSellDialog, showTransferDialog } from '../../../../actions/marketplace';
import { hideActiveCard } from '../../../../actions/explore';

class TransferSell extends React.Component {
    constructor (props) {
        super(props);

        this.handleTransferDialog = this.handleTransferDialog.bind(this);
        this.handleSellDialog = this.handleSellDialog.bind(this);
    }

    handleTransferDialog () {
        this.props.hideActiveCard();
        this.props.showTransferDialog(this.props.nftDetails || this.props.value);
    }

    handleSellDialog () {
        this.props.hideActiveCard();
        this.props.showSellDialog(this.props.nftDetails || this.props.value);
    }

    render () {
        return (
            <div className="transfer_sell">
                <Button
                    className="transfer_button"
                    onClick={this.handleTransferDialog}>
                    {variables[this.props.lang].transfer}
                </Button>
                <Button
                    className="sell_button"
                    onClick={this.handleSellDialog}>
                    {variables[this.props.lang].list}
                </Button>
            </div>
        );
    }
}

TransferSell.propTypes = {
    hideActiveCard: PropTypes.func.isRequired,
    ibcTokensList: PropTypes.array.isRequired,
    ibcTokensListInProgress: PropTypes.bool.isRequired,
    lang: PropTypes.string.isRequired,
    showSellDialog: PropTypes.func.isRequired,
    showTransferDialog: PropTypes.func.isRequired,
    value: PropTypes.object.isRequired,
    nftDetails: PropTypes.object,
};

const stateToProps = (state) => {
    return {
        ibcTokensList: state.marketplace.ibcTokensList.value,
        ibcTokensListInProgress: state.marketplace.ibcTokensList.inProgress,
        lang: state.language,
        value: state.explore.activeCard.value,
    };
};

const actionToProps = {
    showTransferDialog,
    showSellDialog,
    hideActiveCard,
};

export default withRouter(connect(stateToProps, actionToProps)(TransferSell));
