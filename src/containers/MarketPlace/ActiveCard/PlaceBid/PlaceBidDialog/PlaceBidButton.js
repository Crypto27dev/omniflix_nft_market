import { Button, Tooltip } from '@mui/material';
import React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { buyNFT, fetchNFT, showBuyNFTSuccessDialog } from '../../../../../actions/marketplace';
import { config, DEFAULT_LIMIT, DEFAULT_SKIP, TRANSACTION_SET_TIME_OUT } from '../../../../../config';
import {
    aminoSignTx,
    fetchTxHash,
    gasEstimation,
    protoBufSigning,
    setTxHashInProgressFalse,
    txSignAndBroadCast,
    txSignAndBroadCastAminoSign,
    walletConnectSign,
} from '../../../../../actions/account/wallet';
import { withRouter } from 'react-router';
import { hideActiveCard } from '../../../../../actions/explore';
import { fetchBalance } from '../../../../../actions/account/BCDetails';
import { showMessage } from '../../../../../actions/snackbar';
import variables from '../../../../../utils/variables';
import { customTypes } from '../../../../../registry';
import { fetchCollectionAuctions } from '../../../../../actions/collections';
import { ReactComponent as CopyRight } from '../../../../../assets/copy-right.svg';
import { fetchAuctionsListings, setFailDialog, setSuccessDialog } from '../../../../../actions/auctions';
import { fetchUserNFTs } from '../../../../../actions/myAccount';

const PlaceBidButton = (props) => {
    const handleLedgerTransaction = (data, value, granterInfo, balance, path) => {
        if (data && data.fee && data.fee.granter && window.keplr) {
            window.keplr.defaultOptions = {
                sign: {
                    disableBalanceCheck: true,
                },
            };
        } else if (window.keplr) {
            window.keplr.defaultOptions = {};
        }

        const Tx = {
            msgs: [{
                type: 'OmniFlix/marketplace/MsgPlaceBid',
                value: value,
            }],
            fee: {
                amount: [{
                    amount: String(5000),
                    denom: config.COIN_MINIMAL_DENOM,
                }],
                gas: String(200000),
            },
            memo: '',
        };

        const amount = props.amountValue * (10 ** decimals);
        props.aminoSignTx(Tx, props.address, (result) => {
            if (result) {
                const data = {
                    tx: result.signed,
                    mode: 'sync',
                };
                if ((granterInfo && granterInfo.granter && !balance) ||
                    (granterInfo && granterInfo.granter && balance && (balance < 0.1))) {
                    data.fee_granter = granterInfo.granter;
                }
                data.tx.msg = result.signed.msgs;
                data.tx.signatures = [result.signature];
                if (data.tx.msgs) {
                    delete data.tx.msgs;
                }
                props.txSignAndBroadCastAminoSign(data, (res1) => {
                    handleHash(res1, path, amount);
                });
            } else {
                props.setFailDialog();
            }
        });
    };

    const handleWalletConnect = (data, value, granterInfo, balance, path) => {
        const Tx = {
            msgs: [{
                type: 'OmniFlix/marketplace/MsgPlaceBid',
                value: value,
            }],
            fee: {
                amount: [{
                    amount: String(0),
                    denom: config.COIN_MINIMAL_DENOM,
                }],
                gas: String(200000),
            },
            memo: '',
        };

        const amount = props.amountValue * (10 ** decimals);
        props.gasEstimation(Tx, props.keys && props.keys.pubKey,
            props.address, null, 'PlaceBid', (result) => {
                if (result && result.gas_used) {
                    let fee = result.gas_used * config.AVG_GAS_STEP;
                    fee = fee.toFixed(0);

                    if (fee) {
                        Tx.fee.amount = [{
                            amount: fee,
                            denom: config.COIN_MINIMAL_DENOM,
                        }];
                    }
                } else {
                    let fee = 5000 * config.AVG_GAS_STEP;
                    fee = fee.toFixed(0);

                    Tx.fee.amount = [{
                        amount: String(fee),
                        denom: config.COIN_MINIMAL_DENOM,
                    }];
                }

                props.walletConnectSign(props.walletConnector, Tx, props.address, (result) => {
                    if (result) {
                        const data = {
                            tx: result.signed,
                            mode: 'sync',
                        };
                        if ((granterInfo && granterInfo.granter && !balance) ||
                            (granterInfo && granterInfo.granter && balance && (balance < 0.1))) {
                            data.fee_granter = granterInfo.granter;
                        }
                        data.tx.msg = result.signed.msgs;
                        data.tx.signatures = [result.signature];
                        if (data.tx.msgs) {
                            delete data.tx.msgs;
                        }
                        props.txSignAndBroadCastAminoSign(data, (res1) => {
                            handleHash(res1, path, amount);
                        });
                    } else {
                        props.setFailDialog();
                    }
                });
            });
    };

    const bidNft = () => {
        const path = props.location.pathname && props.location.pathname.split('/')[1];
        let price = null;
        if (denom === 'uflix') {
            price = {
                denom: denom,
                amount: String(props.amountValue * (10 ** config.COIN_DECIMALS)),
            };
        } else {
            price = {
                denom: denom,
                amount: String(props.amountValue * (10 ** decimals)),
            };
        }

        const auctionID = props.value && props.value.nftDetails && props.value.nftDetails.auction &&
            props.value.nftDetails.auction.id;
        const data = {
            auction_id: auctionID,
            bidder: props.address,
            amount: price,
        };

        let balance = props.balance && props.balance.length && props.balance.find((val) => val.denom === config.COIN_MINIMAL_DENOM);
        balance = balance && balance.amount && balance.amount / (10 ** config.COIN_DECIMALS);

        const Tx = {
            msgs: [{
                type: customTypes && customTypes.PlaceBid && customTypes.PlaceBid.typeUrl,
                value: data,
            }],
            msgType: 'PlaceBid',
            fee: {
                amount: [{
                    amount: String(5000),
                    denom: config.COIN_MINIMAL_DENOM,
                }],
                gasLimit: String(200000),
            },
            memo: '',
        };

        const type = customTypes && customTypes.CancelAuction && customTypes.CancelAuction.typeUrl;
        const granterInfo = {};
        if (props.allowances && props.allowances.length) {
            props.allowances.map((val) => {
                if (val && val.allowance && val.allowance.spend_limit && val.allowance.spend_limit.length) {
                    const amount = val.allowance.spend_limit.find((val1) => (val1.denom === config.COIN_MINIMAL_DENOM) &&
                        val1.amount && (val1.amount > 0.1 * (10 ** config.COIN_DECIMALS)));
                    if (amount && amount.amount) {
                        granterInfo.granter = val.granter;
                        granterInfo.amount = amount.amount / 10 ** config.COIN_DECIMALS;
                    }
                } else if (val && val.allowance && val.allowance.allowed_messages &&
                    type && val.allowance.allowed_messages.indexOf(type) > -1) {
                    if (val && val.allowance && val.allowance.allowance &&
                        val.allowance.allowance.spend_limit && val.allowance.allowance.spend_limit.length) {
                        const amount = val.allowance.allowance.spend_limit.find((val1) => (val1.denom === config.COIN_MINIMAL_DENOM) &&
                            val1.amount && (val1.amount > 0.1 * (10 ** config.COIN_DECIMALS)));
                        if (amount && amount.amount) {
                            granterInfo.granter = val.granter;
                            granterInfo.amount = amount.amount / 10 ** config.COIN_DECIMALS;
                        }
                    }
                }

                return null;
            });
        }

        if ((granterInfo && granterInfo.granter && !balance) ||
            (granterInfo && granterInfo.granter && balance && (balance < 0.1))) {
            Tx.fee.granter = granterInfo.granter;
        }

        if (props.walletConnector && props.walletConnector._connected) {
            handleWalletConnect(data, data, granterInfo, balance, path);

            return;
        }

        if (props.keys && props.keys.isNanoLedger) {
            handleLedgerTransaction(data, data, granterInfo, balance, path);

            return;
        }

        const amount = props.amountValue * (10 ** decimals);
        props.sign(Tx, props.address, (result, txBytes) => {
            if (result) {
                const data = {
                    tx_bytes: txBytes,
                    mode: 'BROADCAST_MODE_SYNC',
                };
                props.txSignAndBroadCast(data, (res1) => {
                    handleHash(res1, path, amount);
                });
            } else {
                props.setFailDialog();
            }
        });
    };

    const handleHash = (res1, path, amount) => {
        if (res1 && res1.txhash) {
            let counter = 0;
            const time = setInterval(() => {
                props.fetchTxHash(res1.txhash, (hashResult) => {
                    if (hashResult) {
                        if (hashResult && hashResult.code !== undefined && hashResult.code !== 0) {
                            props.showMessage(hashResult.logs || hashResult.raw_log, 'error', hashResult && hashResult.hash);
                            props.setTxHashInProgressFalse();
                            clearInterval(time);

                            return;
                        }

                        props.setSuccessDialog(res1.txhash);
                        if ((path === 'collection') &&
                            props.match && props.match.params && props.match.params.id) {
                            setTimeout(() => {
                                props.fetchCollectionAuctions(props.match.params.id, DEFAULT_SKIP, props.auctionsSkip + DEFAULT_LIMIT);
                            }, TRANSACTION_SET_TIME_OUT);
                            props.hideActiveCard();
                            props.setTxHashInProgressFalse();
                            clearInterval(time);

                            return;
                        } else if ((path === 'nft') &&
                            props.match && props.match.params && props.match.params.nftID) {
                            props.fetchNFT(props.match.params.nftID, (result) => {
                                if (result && result.auction && result.auction.price && result.auction.price.amount &&
                                    (result.auction.price.amount !== amount)) {
                                    setTimeout(() => {
                                        props.fetchNFT(props.match.params.nftID);
                                    }, TRANSACTION_SET_TIME_OUT);
                                }
                            });
                            props.hideActiveCard();
                            props.setTxHashInProgressFalse();
                            clearInterval(time);

                            return;
                        } else if (props.match && props.match.params && props.match.params.address) {
                            setTimeout(() => {
                                props.fetchUserNFTs(props.match.params.address, DEFAULT_SKIP, props.nftSSkip + DEFAULT_LIMIT);
                            }, TRANSACTION_SET_TIME_OUT);
                            props.hideActiveCard();
                            props.setTxHashInProgressFalse();
                            clearInterval(time);

                            return;
                        }
                        setTimeout(() => {
                            props.fetchAuctionsListings(DEFAULT_SKIP, props.auctionListingsSkip + DEFAULT_LIMIT);
                        }, TRANSACTION_SET_TIME_OUT);
                        props.fetchBalance(props.address);
                        props.hideActiveCard();
                        props.setTxHashInProgressFalse();
                        clearInterval(time);
                    }

                    counter++;
                    if (counter === 3) {
                        if (hashResult && hashResult.code !== undefined && hashResult.code !== 0) {
                            props.showMessage(hashResult.logs || hashResult.raw_log, 'error', hashResult && hashResult.hash);
                            props.setTxHashInProgressFalse();
                            clearInterval(time);

                            return;
                        }

                        props.showMessage(variables[props.lang]['check_later']);
                        props.setTxHashInProgressFalse();
                        clearInterval(time);
                    }
                });
            }, 5000);
        } else {
            props.setFailDialog();
        }
    };

    const coryRight = props.value && props.value.nftDetails &&
        props.value.nftDetails.denom_id && props.value.nftDetails.denom_id.IP_infringement;
    const denom = props.value && props.value.nftDetails && props.value.nftDetails.auction &&
        props.value.nftDetails.auction.price && props.value.nftDetails.auction.price.denom;
    const ibcToken = denom && props.ibcTokensList && props.ibcTokensList.length &&
        props.ibcTokensList.find((val) => val && val.ibc_denom_hash && (val.ibc_denom_hash === denom));
    const decimals = ibcToken && ibcToken.network && ibcToken.network.decimals
        ? ibcToken.network.decimals
        : config.COIN_DECIMALS;
    let amount = props.value && props.value.nftDetails && props.value.nftDetails.auction &&
        props.value.nftDetails.auction.price && props.value.nftDetails.auction.price.amount;
    if (props.value && props.value.nftDetails && props.value.nftDetails.auction &&
        props.value.nftDetails.auction.last_bid) {
        amount = (amount) + ((props.value && props.value.nftDetails && props.value.nftDetails.auction &&
            props.value.nftDetails.auction.increment_percentage) * amount);
    }

    amount = amount / (10 ** decimals);

    const disable = props.amountValue < amount;
    const inProgress = props.inProgressBuyNFT || props.inProgressTxSign;
    const broadCastInProgress = props.inProgressBroadCast || props.aminoBroadCastInProgress || props.inProgressTxHash;

    return (
        inProgress || broadCastInProgress
            ? <Button
                className="delist_confirm"
                disabled={true}
                onClick={() => buyNFT()}>
                {broadCastInProgress
                    ? variables[props.lang].processing + '...'
                    : variables[props.lang]['approval_pending'] + '...'}
            </Button>
            : <Tooltip
                classes={{ popper: 'warning_ibc_tooltip collect_tooltip' }}
                title={coryRight
                    ? <div className="text_content">
                        <CopyRight/>
                        {variables[props.lang]['copy_right']}
                    </div> : ''}>
                <Button
                    className={coryRight ? 'purchase_license warning' : 'delist_confirm'}
                    disabled={disable}
                    onClick={() => bidNft()}>
                    {coryRight ? <CopyRight/> : null}
                    {variables[props.lang]['place_bid']}
                </Button>
            </Tooltip>
    );
};

PlaceBidButton.propTypes = {
    address: PropTypes.string.isRequired,
    allowances: PropTypes.array.isRequired,
    aminoBroadCastInProgress: PropTypes.bool.isRequired,
    aminoSignTx: PropTypes.func.isRequired,
    balance: PropTypes.array.isRequired,
    buyNFT: PropTypes.func.isRequired,
    fetchAuctionsListings: PropTypes.func.isRequired,
    fetchBalance: PropTypes.func.isRequired,
    fetchCollectionAuctions: PropTypes.func.isRequired,
    fetchNFT: PropTypes.func.isRequired,
    fetchTxHash: PropTypes.func.isRequired,
    fetchUserNFTs: PropTypes.func.isRequired,
    gasEstimation: PropTypes.func.isRequired,
    hideActiveCard: PropTypes.func.isRequired,
    ibcTokensList: PropTypes.array.isRequired,
    inProgressBroadCast: PropTypes.bool.isRequired,
    inProgressBuyNFT: PropTypes.bool.isRequired,
    inProgressTxHash: PropTypes.bool.isRequired,
    inProgressTxSign: PropTypes.bool.isRequired,
    keys: PropTypes.object.isRequired,
    lang: PropTypes.string.isRequired,
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
    }).isRequired,
    setFailDialog: PropTypes.func.isRequired,
    setSuccessDialog: PropTypes.func.isRequired,
    setTxHashInProgressFalse: PropTypes.func.isRequired,
    showBuyNFTSuccessDialog: PropTypes.func.isRequired,
    showMessage: PropTypes.func.isRequired,
    sign: PropTypes.func.isRequired,
    txSignAndBroadCast: PropTypes.func.isRequired,
    txSignAndBroadCastAminoSign: PropTypes.func.isRequired,
    value: PropTypes.object.isRequired,
    walletConnectSign: PropTypes.func.isRequired,
    amountValue: PropTypes.any,
    auctionListingsSkip: PropTypes.number,
    auctionsSkip: PropTypes.number,
    match: PropTypes.shape({
        params: PropTypes.shape({
            address: PropTypes.string,
            tab: PropTypes.string,
            id: PropTypes.string,
            nftID: PropTypes.string,
        }),
    }),
    nftSSkip: PropTypes.number,
    walletConnector: PropTypes.object,
};

const stateToProps = (state) => {
    return {
        address: state.account.wallet.connection.address,
        allowances: state.account.bc.allowances.value,
        amountValue: state.myAccount.amountValue,
        aminoBroadCastInProgress: state.account.wallet.connection.inProgress,
        auctionListingsSkip: state.auctions.auctionListings.skip,
        balance: state.account.bc.balance.value,
        lang: state.language,
        auctionsSkip: state.collection.auctions.skip,
        ibcTokensList: state.marketplace.ibcTokensList.value,
        inProgressBroadCast: state.account.wallet.broadCast.inProgress,
        inProgressBuyNFT: state.marketplace.buyNFT.inProgress,
        inProgressTxHash: state.account.bc.txHash.inProgress,
        inProgressTxSign: state.account.bc.signTx.inProgress,
        keys: state.account.wallet.connection.keys,
        value: state.auctions.placeBidDialog.value,
        nftSSkip: state.myAccount.userNFTs.skip,
        walletConnector: state.account.wallet.connection.walletConnector,
    };
};

const actionToProps = {
    aminoSignTx,
    buyNFT,
    sign: protoBufSigning,
    txSignAndBroadCast,
    txSignAndBroadCastAminoSign,
    fetchAuctionsListings,
    fetchBalance,
    fetchCollectionAuctions,
    fetchUserNFTs,
    fetchTxHash,
    fetchNFT,
    gasEstimation,
    showMessage,
    setFailDialog,
    setSuccessDialog,
    setTxHashInProgressFalse,
    hideActiveCard,
    showBuyNFTSuccessDialog,
    walletConnectSign,
};

export default withRouter(connect(stateToProps, actionToProps)(PlaceBidButton));
