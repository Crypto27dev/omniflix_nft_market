import { Button, Tooltip } from '@mui/material';
import React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { buyNFT, fetchListings, showBuyNFTSuccessDialog } from '../../../../actions/marketplace';
import { config, DEFAULT_LIMIT, DEFAULT_SKIP, TRANSACTION_SET_TIME_OUT } from '../../../../config';
import {
    aminoSignTx,
    fetchTxHash,
    gasEstimation,
    protoBufSigning,
    setTxHashInProgressFalse,
    txSignAndBroadCast,
    txSignAndBroadCastAminoSign,
    walletConnectSign,
} from '../../../../actions/account/wallet';
import { withRouter } from 'react-router';
import { hideActiveCard } from '../../../../actions/explore';
import { fetchBalance } from '../../../../actions/account/BCDetails';
import { fetchOwnerCollections, fetchOwnerNFTs } from '../../../../actions/myAccount';
import { showMessage } from '../../../../actions/snackbar';
import variables from '../../../../utils/variables';
import { customTypes } from '../../../../registry';
import { fetchListedCollectionNFTs, fetchNonListedCollectionNFTs } from '../../../../actions/collections';
import { ReactComponent as CopyRight } from '../../../../assets/copy-right.svg';
import { fetchStats } from '../../../../actions/home';

const BuyNFTButton = (props) => {
    const handleLedgerTransaction = (data, msg, granterInfo, balance, path) => {
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
            msgs: msg,
            fee: {
                amount: [{
                    amount: String(5000),
                    denom: config.COIN_MINIMAL_DENOM,
                }],
                gas: String(200000),
            },
            memo: '',
        };

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
                    handleHash(res1, path);
                });
            }
        });
    };

    const handleWalletConnect = (data, msg, granterInfo, balance, path) => {
        const Tx = {
            msgs: msg,
            fee: {
                amount: [{
                    amount: String(0),
                    denom: config.COIN_MINIMAL_DENOM,
                }],
                gas: String(200000),
            },
            memo: '',
        };

        props.gasEstimation(Tx, props.keys && props.keys.pubKey,
            props.address, null, 'BuyNFT', (result) => {
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
                            handleHash(res1, path);
                        });
                    }
                });
            });
    };

    const buyNFT = () => {
        const path = props.location.pathname && props.location.pathname.split('/')[1];
        const amount = props.value && props.value.nftDetails && props.value.nftDetails.list &&
            props.value.nftDetails.list.price && props.value.nftDetails.list.price.amount;
        const denom = props.value && props.value.nftDetails && props.value.nftDetails.list &&
            props.value.nftDetails.list.price && props.value.nftDetails.list.price.denom;
        const balance = props.balance && props.balance.length &&
            props.balance.find((val) => val.denom === denom);

        if ((balance && balance.amount && (amount > balance.amount)) || !balance) {
            props.showMessage('Not Enough balance', 'warning');

            return;
        }

        const data = {
            base_req: {
                from: props.address,
                chain_id: config.CHAIN_ID,
            },
            price: amount + denom,
            buyer: props.address,
        };
        const listID = props.value && props.value.nftDetails && props.value.nftDetails.list && props.value.nftDetails.list.id;
        props.buyNFT(data, listID, (res) => {
            if (res) {
                let balance = props.balance && props.balance.length && props.balance.find((val) => val.denom === config.COIN_MINIMAL_DENOM);
                balance = balance && balance.amount && balance.amount / (10 ** config.COIN_DECIMALS);

                const Tx = {
                    msgs: res.value && res.value.msg,
                    msgType: 'BuyNFT',
                    fee: {
                        amount: [{
                            amount: String(5000),
                            denom: config.COIN_MINIMAL_DENOM,
                        }],
                        gasLimit: String(200000),
                    },
                    memo: '',
                };

                const type = customTypes && customTypes.BuyNFT && customTypes.BuyNFT.typeUrl;
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
                    handleWalletConnect(Tx, res.value && res.value.msg, granterInfo, balance, path);

                    return;
                }

                if (props.keys && props.keys.isNanoLedger) {
                    handleLedgerTransaction(Tx, res.value && res.value.msg, granterInfo, balance, path);

                    return;
                }

                props.sign(Tx, props.address, (result, txBytes) => {
                    if (result) {
                        const data = {
                            tx_bytes: txBytes,
                            mode: 'BROADCAST_MODE_SYNC',
                        };
                        props.txSignAndBroadCast(data, (res1) => {
                            handleHash(res1, path);
                        });
                    } else {
                        // props.showBuyNFTSuccessDialog('fail');
                    }
                });
            }
        });
    };

    const handleHash = (res1, path) => {
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

                        props.showBuyNFTSuccessDialog('success', props.value, res1.txhash);
                        if ((path === 'collection') &&
                            props.match && props.match.params && props.match.params.id) {
                            props.fetchListedCollectionNFTs(props.match.params.id, DEFAULT_SKIP, props.listedNFTsSkip + DEFAULT_LIMIT, null, null, null, null, null, null, (result, total) => {
                                if (total === props.listedNFTsTotal) {
                                    setTimeout(() => {
                                        props.fetchListedCollectionNFTs(props.match.params.id, DEFAULT_SKIP, props.listedNFTsSkip + DEFAULT_LIMIT);
                                        props.fetchNonListedCollectionNFTs(props.match.params.id, DEFAULT_SKIP, DEFAULT_LIMIT);
                                    }, TRANSACTION_SET_TIME_OUT);
                                } else {
                                    props.fetchNonListedCollectionNFTs(props.match.params.id, DEFAULT_SKIP, DEFAULT_LIMIT);
                                }
                            });
                            props.hideActiveCard();
                            props.setTxHashInProgressFalse();
                            clearInterval(time);

                            return;
                        }
                        props.fetchListings(DEFAULT_SKIP, props.listingsSkip + DEFAULT_LIMIT, null, null, null, null, null, null, (result, total) => {
                            if (total === props.listingsTotal) {
                                setTimeout(() => {
                                    props.fetchListings(DEFAULT_SKIP, props.listingsSkip + DEFAULT_LIMIT);
                                    props.fetchStats();
                                }, TRANSACTION_SET_TIME_OUT);
                            } else {
                                props.fetchStats();
                            }
                        });
                        props.fetchOwnerNFTs(props.address);
                        props.fetchOwnerCollections(props.address);
                        props.history.push('/nfts');
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
            // props.showBuyNFTSuccessDialog('fail');
        }
    };

    const coryRight = props.value && props.value.nftDetails &&
        props.value.nftDetails.denom_id && props.value.nftDetails.denom_id.IP_infringement;
    const inProgress = props.inProgressBuyNFT || props.inProgressTxSign;
    const broadCastInProgress = props.inProgressBroadCast || props.aminoBroadCastInProgress || props.inProgressTxHash;

    return (
        inProgress || broadCastInProgress
            ? <Button
                className="purchase_license"
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
                    className={coryRight ? 'purchase_license warning' : 'purchase_license'}
                    onClick={() => buyNFT()}>
                    {coryRight ? <CopyRight/> : null}
                    {variables[props.lang].collect}
                </Button>
            </Tooltip>
    );
};

BuyNFTButton.propTypes = {
    address: PropTypes.string.isRequired,
    allowances: PropTypes.array.isRequired,
    aminoBroadCastInProgress: PropTypes.bool.isRequired,
    aminoSignTx: PropTypes.func.isRequired,
    balance: PropTypes.array.isRequired,
    buyNFT: PropTypes.func.isRequired,
    fetchBalance: PropTypes.func.isRequired,
    fetchListedCollectionNFTs: PropTypes.func.isRequired,
    fetchListings: PropTypes.func.isRequired,
    fetchNonListedCollectionNFTs: PropTypes.func.isRequired,
    fetchOwnerCollections: PropTypes.func.isRequired,
    fetchOwnerNFTs: PropTypes.func.isRequired,
    fetchStats: PropTypes.func.isRequired,
    fetchTxHash: PropTypes.func.isRequired,
    gasEstimation: PropTypes.func.isRequired,
    hideActiveCard: PropTypes.func.isRequired,
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
    }).isRequired,
    inProgressBroadCast: PropTypes.bool.isRequired,
    inProgressBuyNFT: PropTypes.bool.isRequired,
    inProgressTxHash: PropTypes.bool.isRequired,
    inProgressTxSign: PropTypes.bool.isRequired,
    keys: PropTypes.object.isRequired,
    lang: PropTypes.string.isRequired,
    listingsSkip: PropTypes.number.isRequired,
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
    }).isRequired,
    setTxHashInProgressFalse: PropTypes.func.isRequired,
    showBuyNFTSuccessDialog: PropTypes.func.isRequired,
    showMessage: PropTypes.func.isRequired,
    sign: PropTypes.func.isRequired,
    txSignAndBroadCast: PropTypes.func.isRequired,
    txSignAndBroadCastAminoSign: PropTypes.func.isRequired,
    value: PropTypes.object.isRequired,
    walletConnectSign: PropTypes.func.isRequired,
    listedNFTsSkip: PropTypes.number,
    listedNFTsTotal: PropTypes.number,
    listingsTotal: PropTypes.number,
    match: PropTypes.shape({
        params: PropTypes.shape({
            address: PropTypes.string,
            tab: PropTypes.string,
            id: PropTypes.string,
            nftID: PropTypes.string,
        }),
    }),
    walletConnector: PropTypes.object,
};

const stateToProps = (state) => {
    return {
        address: state.account.wallet.connection.address,
        allowances: state.account.bc.allowances.value,
        aminoBroadCastInProgress: state.account.wallet.connection.inProgress,
        balance: state.account.bc.balance.value,
        lang: state.language,
        listedNFTsTotal: state.collection.listedCollectionNFTs.total,
        listedNFTsSkip: state.collection.listedCollectionNFTs.skip,
        listingsSkip: state.marketplace.listings.skip,
        listingsTotal: state.marketplace.listings.total,
        inProgressBroadCast: state.account.wallet.broadCast.inProgress,
        inProgressBuyNFT: state.marketplace.buyNFT.inProgress,
        inProgressTxHash: state.account.bc.txHash.inProgress,
        inProgressTxSign: state.account.bc.signTx.inProgress,
        keys: state.account.wallet.connection.keys,
        walletConnector: state.account.wallet.connection.walletConnector,
    };
};

const actionToProps = {
    aminoSignTx,
    buyNFT,
    sign: protoBufSigning,
    txSignAndBroadCast,
    txSignAndBroadCastAminoSign,
    fetchBalance,
    fetchTxHash,
    fetchListedCollectionNFTs,
    fetchNonListedCollectionNFTs,
    showMessage,
    setTxHashInProgressFalse,
    gasEstimation,
    hideActiveCard,
    fetchListings,
    showBuyNFTSuccessDialog,
    fetchOwnerNFTs,
    fetchOwnerCollections,
    fetchStats,
    walletConnectSign,
};

export default withRouter(connect(stateToProps, actionToProps)(BuyNFTButton));
