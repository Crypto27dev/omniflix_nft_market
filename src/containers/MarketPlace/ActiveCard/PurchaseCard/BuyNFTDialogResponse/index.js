import React, { useEffect } from 'react';
import * as PropTypes from 'prop-types';
import { Button, Dialog } from '@material-ui/core';
import variables from '../../../../../utils/variables';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import './index.css';
import { hideBuyNFTSuccessDialog } from '../../../../../actions/marketplace';
import successIcon from '../../../../../assets/collections/success.svg';
import CopyButton from '../../../../../components/CopyButton';
import Info from './Info';
import { EXPLORER_URL } from '../../../../../config';
import confetti from 'canvas-confetti';

const BuyNFTDialogResponse = (props) => {
    const { open } = props;

    useEffect(() => {
        if (open) {
            const duration = 3000;
            const animationEnd = Date.now() + duration;
            const defaults = {
                startVelocity: 30,
                spread: 360,
                ticks: 60,
                zIndex: 2000,
            };

            const randomInRange = (min, max) => {
                return Math.random() * (max - min) + min;
            };

            const interval = setInterval(function () {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);
                confetti(Object.assign({}, defaults, {
                    particleCount,
                    origin: {
                        x: randomInRange(0.1, 0.3),
                        y: Math.random() - 0.2,
                    },
                }));
                confetti(Object.assign({}, defaults, {
                    particleCount,
                    origin: {
                        x: randomInRange(0.7, 0.9),
                        y: Math.random() - 0.2,
                    },
                }));
            }, 250);
        }
    }, [open]);

    const handleRedirect = () => {
        props.history.push(`/nft/${props.value && props.value.nftDetails && props.value.nftDetails.id}`);
    };

    return (
        <Dialog
            aria-describedby="verify-twitter-dialog-description"
            aria-labelledby="verify-twitter-dialog-title"
            className="dialog buy_nft_dialog"
            open={props.open}
            onClose={props.handleClose}>
            {props.buyNFTSuccessDialog && props.buyNFTSuccessDialog === 'success' &&
                <div className="buy_nft_dialog_content buy_nft_success">
                    <img alt="" src={successIcon}/>
                    <h2 className="title">{variables[props.lang]['nft_purchase_success']}</h2>
                    <span>{variables[props.lang]['transaction_hash']}</span>
                    <div className="tx_hash">
                        <div onClick={() => window.open(`${EXPLORER_URL + '/transactions/' + props.hash}`)}>{props.hash}</div>
                        <CopyButton data={EXPLORER_URL + '/transactions/' + props.hash}/>
                    </div>
                    <Info/>
                    <div className="buy_nft_dialog_action" onClick={() => handleRedirect()}>
                        <Button className="buy_nft_confirm" onClick={props.handleClose}>
                            {variables[props.lang]['view_nft']}
                        </Button>
                    </div>
                </div>}
        </Dialog>
    );
};

BuyNFTDialogResponse.propTypes = {
    handleClose: PropTypes.func.isRequired,
    hash: PropTypes.string.isRequired,
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
    }).isRequired,
    lang: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    value: PropTypes.object.isRequired,
    buyNFTSuccessDialog: PropTypes.any,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        open: state.marketplace.buyNFTSuccessDialog.open,
        buyNFTSuccessDialog: state.marketplace.buyNFTSuccessDialog.value,
        hash: state.marketplace.buyNFTSuccessDialog.hash,
        value: state.marketplace.buyNFTSuccessDialog.info,
    };
};

const actionToProps = {
    handleClose: hideBuyNFTSuccessDialog,
};

export default withRouter(connect(stateToProps, actionToProps)(BuyNFTDialogResponse));
