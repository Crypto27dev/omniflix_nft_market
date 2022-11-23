import React from 'react';
import * as PropTypes from 'prop-types';
import { Button, Dialog, DialogContent } from '@material-ui/core';
import variables from '../../../../../utils/variables';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import '../../TransferSell/ListDialog/index.css';
import './index.css';
// import Info from './Info';
import { config, EXPLORER_URL } from '../../../../../config';
import { hidePlaceBidDialog } from '../../../../../actions/auctions';
import AmountValueTextField from '../../../../MyAccount/IBCTokens/AmountValueTextField';
import TotalSale from '../../TransferSell/ListDialog/TotalSale';
import PlaceBidButton from './PlaceBidButton';
import successIcon from '../../../../../assets/collections/success.svg';
import CopyButton from '../../../../../components/CopyButton';
import failIcon from '../../../../../assets/collections/failed.svg';
import Info from '../../TransferSell/ListDialog/Info';
import { mathCeilDecimals } from '../../../../../utils/numbers';

const PlaceBidDialog = (props) => {
    const denom = props.value && props.value.nftDetails && props.value.nftDetails.auction &&
        props.value.nftDetails.auction.price && props.value.nftDetails.auction.price.denom;
    const ibcToken = denom && props.ibcTokensList && props.ibcTokensList.length &&
        props.ibcTokensList.find((val) => val && val.ibc_denom_hash && (val.ibc_denom_hash === denom));
    const decimals = ibcToken && ibcToken.network && ibcToken.network.decimals
        ? ibcToken.network.decimals
        : config.COIN_DECIMALS;
    const displayDenom = ibcToken && ibcToken.network && ibcToken.network.display_denom
        ? ibcToken.network.display_denom : config.COIN_DENOM;
    let amount = props.value && props.value.nftDetails && props.value.nftDetails.auction &&
        props.value.nftDetails.auction.price && props.value.nftDetails.auction.price.amount;
    if (props.value && props.value.nftDetails && props.value.nftDetails.auction &&
        props.value.nftDetails.auction.last_bid) {
        amount = (amount) + ((props.value && props.value.nftDetails && props.value.nftDetails.auction &&
            props.value.nftDetails.auction.increment_percentage) * amount);
    }

    amount = amount / (10 ** decimals);
    amount = mathCeilDecimals(amount, 2);

    const totalSale = {
        tokenPrice: props.amountValue,
        tokenValue: denom,
        details: props.value && props.value.nftDetails,
        splitInfo: props.value && props.value.nftDetails &&
            props.value.nftDetails.auction && props.value.nftDetails.auction.split_shares,
    };
    let balance = props.balance && props.balance.length && props.balance.find((val) => val.denom === denom);
    balance = balance && balance.amount && balance.amount / (10 ** decimals);

    return (
        <Dialog
            disableEnforceFocus
            aria-describedby="preview-dialog-description"
            aria-labelledby="preview-dialog-title"
            className="dialog listing_dialog buy_nft_dialog bid_nft_dialog"
            open={props.open}
            onClose={props.handleClose}>
            {props.success
                ? <DialogContent className="success_dialog_content success_dialog scroll_bar">
                    <img alt="success" src={successIcon}/>
                    <h2 className="title">{variables[props.lang]['bid_requested_successfully']}</h2>
                    <span>{variables[props.lang]['transaction_hash']}</span>
                    <div className="tx_hash">
                        <div onClick={() => window.open(`${EXPLORER_URL + '/transactions/' + props.hash}`)}>{props.hash}</div>
                        <CopyButton data={EXPLORER_URL + '/transactions/' + props.hash}/>
                    </div>
                    <Info info={props.value && props.value.nftDetails} value={props.value}/>
                    <div className="delist_dialog_action">
                        <Button className="delist_confirm" onClick={props.handleClose}>
                            {variables[props.lang]['close_window']}
                        </Button>
                    </div>
                </DialogContent>
                : props.fail
                    ? <DialogContent className="success_dialog_content success_dialog">
                        <img alt="fail" src={failIcon}/>
                        <h2 className="title">{variables[props.lang]['bid_requested_failed']}</h2>
                        <Info info={props.value && props.value.nftDetails} value={props.value}/>
                        <div className="delist_dialog_action">
                            <Button className="delist_confirm" onClick={props.handleClose}>
                                {variables[props.lang]['close_window']}
                            </Button>
                        </div>
                    </DialogContent>
                    : <>
                        <DialogContent className="dialog_content bid_nft scroll_bar">
                            <h2 className="title">{variables[props.lang].bid}&nbsp;
                                &ldquo;{props.value && props.value.nftDetails &&
                                    props.value.nftDetails.name}&rdquo;</h2>
                            <div className="bid_nft_section">
                                <div className="bid_nft_section1">
                                    <span>{variables[props.lang]['enter_bid_price']}</span>
                                    <span className="balance"> Available = {props.balance && props.balance.length
                                        ? <span>{balance} {displayDenom}</span>
                                        : `0 ${displayDenom}`}</span>
                                </div>
                                <AmountValueTextField
                                    balance={balance || 0}
                                    denom={displayDenom}/>
                                <div className="bid_nft_section2">
                                    <span className="min_bid"> {variables[props.lang]['min_bid_price']}:&nbsp;
                                        <span>{amount} {displayDenom}</span>
                                    </span>
                                </div>
                            </div>
                            <TotalSale deList totalSale={totalSale}/>
                        </DialogContent>
                        <div className="confirm_list_action delist_dialog_action">
                            <Button className="delist_cancel" onClick={props.handleClose}>
                                {variables[props.lang].cancel}
                            </Button>
                            <PlaceBidButton/>
                        </div>
                    </>}
        </Dialog>
    );
};

PlaceBidDialog.propTypes = {
    balance: PropTypes.array.isRequired,
    fail: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    hash: PropTypes.string.isRequired,
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
    }).isRequired,
    ibcTokensList: PropTypes.array.isRequired,
    lang: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    success: PropTypes.bool.isRequired,
    value: PropTypes.object.isRequired,
    amountValue: PropTypes.any,
    // buyNFTSuccessDialog: PropTypes.any,
};

const stateToProps = (state) => {
    return {
        balance: state.account.bc.balance.value,
        fail: state.auctions.placeBidDialog.fail,
        hash: state.auctions.placeBidDialog.hash,
        lang: state.language,
        open: state.auctions.placeBidDialog.open,
        // buyNFTSuccessDialog: state.marketplace.buyNFTSuccessDialog.value,
        amountValue: state.myAccount.amountValue,
        value: state.auctions.placeBidDialog.value,
        ibcTokensList: state.marketplace.ibcTokensList.value,
        success: state.auctions.placeBidDialog.success,
    };
};

const actionToProps = {
    handleClose: hidePlaceBidDialog,
};

export default withRouter(connect(stateToProps, actionToProps)(PlaceBidDialog));
