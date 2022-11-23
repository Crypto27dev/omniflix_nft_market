import variables from '../../../utils/variables';
import { Button } from '@material-ui/core';
import React, { useState } from 'react';
import * as PropTypes from 'prop-types';
import { fetchNFT, hideBurnDialog, setBurnDialogFailed, setBurnDialogSuccess } from '../../../actions/marketplace';
import { connect } from 'react-redux';
import BurnIDTextField from './BurnIDTextField';
import successIcon from '../../../assets/success_gradient.svg';
import CopyButton from '../../../components/CopyButton';
import failedIcon from '../../../assets/failed.svg';
import { showMessage } from '../../../actions/snackbar';
import {
    aminoSignTx,
    fetchTxHash,
    gasEstimation,
    protoBufSigning,
    setTxHashInProgressFalse,
    txSignAndBroadCast,
    txSignAndBroadCastAminoSign,
    walletConnectSign,
} from '../../../actions/account/wallet';

import ImageOnLoad from '../../../components/ImageOnLoad';
import { customTypes } from '../../../registry';
import { getAssetType, getAssetTypeExtension } from '../../../utils/strings';
import { config, DEFAULT_LIMIT, DEFAULT_SKIP, TRANSACTION_SET_TIME_OUT } from '../../../config';
import { withRouter } from 'react-router';
import { fetchUserCollections, fetchUserNFTs } from '../../../actions/myAccount';
import { fetchCollectionMyNFTs, fetchNonListedCollectionNFTs } from '../../../actions/collections';
import CircularProgress from '../../../components/CircularProgress';

const Burn = (props) => {
    const [hash, setHash] = useState('');
    const path = props.location.pathname && props.location.pathname.split('/')[1];

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && props.burnID !== '' && !disable) {
            handleBurn();
        }
    };

    const handleLedgerTransaction = (data, msg, granterInfo, balance) => {
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
            } else {
                props.setBurnDialogFailed();
            }
        });
    };

    const handleWalletConnect = (data, msg, granterInfo, balance) => {
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
            props.address, null, 'BurnONFT', (result) => {
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
                    } else {
                        props.setBurnDialogFailed();
                    }
                });
            });
    };

    const handleBurn = () => {
        const denomID = props.asset && props.asset.denom_id && (props.asset.denom_id.id || props.asset.denom_id);

        if (denomID && props.asset && props.asset.id) {
            let balance = props.balance && props.balance.length && props.balance.find((val) => val.denom === config.COIN_MINIMAL_DENOM);
            balance = balance && balance.amount && balance.amount / (10 ** config.COIN_DECIMALS);
            const messages = [{
                type: 'OmniFlix/onft/MsgBurnONFT',
                value: {
                    id: props.asset && props.asset.id,
                    denom_id: denomID,
                    sender: props.asset && props.asset.owner,
                },
            }];

            const Tx = {
                msgs: messages,
                msgType: 'BurnONFT',
                fee: {
                    amount: [{
                        amount: String(5000),
                        denom: config.COIN_MINIMAL_DENOM,
                    }],
                    gasLimit: String(200000),
                },
                memo: '',
            };

            const type = customTypes && customTypes.BurnONFT && customTypes.BurnONFT.typeUrl;
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
                handleWalletConnect(Tx, messages, granterInfo, balance);

                return;
            }

            if (props.keys && props.keys.isNanoLedger) {
                handleLedgerTransaction(Tx, messages, granterInfo, balance);

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
                    props.setBurnDialogFailed();
                }
            });
        } else {
            props.handleClose();
            props.showMessage('Something went wrong!', 'error');
        }
    };

    const handleHash = (res1, path) => {
        if (res1 && res1.txhash) {
            setHash(res1.txhash);
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

                        props.handleClose();
                        props.setBurnDialogSuccess();
                        if ((path === 'account') &&
                            props.match && props.match.params && props.match.params.address) {
                            props.fetchUserCollections(props.match.params.address, DEFAULT_SKIP, props.collectionsSkip + DEFAULT_LIMIT);
                            props.fetchUserNFTs(props.match.params.address, DEFAULT_SKIP, props.nftSSkip + DEFAULT_LIMIT, () => {
                                setTimeout(() => {
                                    props.fetchUserNFTs(props.match.params.address, DEFAULT_SKIP, props.nftSSkip + DEFAULT_LIMIT);
                                }, TRANSACTION_SET_TIME_OUT);
                            });
                        } else if ((path === 'collection') &&
                            props.match && props.match.params && props.match.params.id) {
                            props.fetchNonListedCollectionNFTs(props.match.params.id, DEFAULT_SKIP, props.nonListedNFTsSkip + DEFAULT_LIMIT, null, (result, total) => {
                                if (total === props.nonListedNFTsTotal) {
                                    setTimeout(() => {
                                        props.fetchCollectionMyNFTs(props.match.params.id, props.address, DEFAULT_SKIP, DEFAULT_LIMIT);
                                        props.fetchNonListedCollectionNFTs(props.match.params.id, DEFAULT_SKIP, DEFAULT_LIMIT);
                                    }, TRANSACTION_SET_TIME_OUT);
                                } else {
                                    props.fetchCollectionMyNFTs(props.match.params.id, props.address, DEFAULT_SKIP, DEFAULT_LIMIT);
                                }
                            });
                        } else if ((path === 'nft') &&
                            props.match && props.match.params && props.match.params.nftID) {
                            props.fetchNFT(props.match.params.nftID, (result) => {
                                if (result && result.status && result.status !== 'BURNED') {
                                    setTimeout(() => {
                                        props.fetchNFT(props.match.params.nftID);
                                    }, TRANSACTION_SET_TIME_OUT);
                                }
                            });
                        }
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

                        props.setTxHashInProgressFalse();
                        clearInterval(time);
                    }
                });
            }, 5000);
        } else {
            props.setBurnDialogFailed();
        }
    };

    const nftData = props.asset;
    const denom = props.asset && props.asset.denom_id;
    const id = nftData && nftData.id && nftData.id.substring(nftData.id.length - 4);
    const inProgress = props.signInProgress;
    const broadCastInProgress = props.broadCastInProgress || props.aminoBroadCastInProgress || props.txHashInProgress;
    const disable = (props.burnID !== id) || inProgress || broadCastInProgress;
    const type = nftData && nftData.media_type && getAssetType(nftData['media_type']);
    const extension = nftData && nftData.media_type && getAssetTypeExtension(nftData['media_type']);

    return (
        props.success
            ? <div className="burn_dialog success_burn">
                <img alt="logo" src={successIcon}/>
                <h2>{variables[props.lang]['asset_deleted']}</h2>
                <div className="tx_hash">
                    <span>{variables[props.lang]['transaction_hash']}</span>
                    <div>
                        <p>{hash}</p>
                        <CopyButton data={hash}/>
                    </div>
                </div>
                <Button onClick={props.handleClose}>
                    <p>{variables[props.lang].okay}</p>
                </Button>
            </div>
            : props.failed
                ? <div className="burn_dialog success_burn">
                    <img alt="logo" src={failedIcon}/>
                    <h2>{variables[props.lang]['asset_burn_failed']}</h2>
                    <div className="burn_info image_burn">
                        {type === 'image' && extension === 'gif' && nftData
                            ? <ImageOnLoad
                                preview={nftData && nftData.preview_uri}
                                src={nftData && nftData.media_uri}
                                text={variables[props.lang]['asset_preview_not_ready']}/>
                            : type === 'image' && nftData
                                ? <ImageOnLoad
                                    cdn={nftData && nftData.cloudflare_cdn && nftData && nftData.cloudflare_cdn.variants}
                                    preview={nftData && nftData.preview_uri}
                                    src={nftData && nftData.media_uri}
                                    text={variables[props.lang]['asset_preview_not_ready']}/>
                                : nftData &&
                                <ImageOnLoad
                                    preview={nftData && nftData.preview_uri}
                                    src={nftData && nftData.media_uri}
                                    text={variables[props.lang]['asset_preview_not_ready']}/>}
                        <div>
                            <div className="row">
                                <p>{denom && (denom.name || denom.symbol)}</p>
                                <p>{nftData && nftData.name}</p>
                            </div>
                            <div className="row hash">
                                <p>{variables[props.lang]['nft_id']}:</p>
                                <div className="hash_text" title={nftData && nftData.id}>
                                    <p className="name">{nftData && nftData.id}</p>
                                    {nftData && nftData.id &&
                                        nftData.id.slice(nftData.id.length - 6, nftData.id.length)}
                                </div>
                            </div>
                        </div>
                    </div>
                    <Button onClick={props.handleClose}>
                        <p>{variables[props.lang]['close_window']}</p>
                    </Button>
                </div>
                : <div className="burn_dialog">
                    <h2>{variables[props.lang]['agree_to_delete']}</h2>
                    <div className="burn_info image_burn">
                        {type === 'image' && extension === 'gif' && nftData
                            ? <ImageOnLoad
                                preview={nftData && nftData.preview_uri}
                                src={nftData && nftData.media_uri}
                                text={variables[props.lang]['asset_preview_not_ready']}/>
                            : type === 'image' && nftData
                                ? <ImageOnLoad
                                    cdn={nftData && nftData.cloudflare_cdn && nftData && nftData.cloudflare_cdn.variants}
                                    preview={nftData && nftData.preview_uri}
                                    src={nftData && nftData.media_uri}
                                    text={variables[props.lang]['asset_preview_not_ready']}/>
                                : nftData &&
                                <ImageOnLoad
                                    preview={nftData && nftData.preview_uri}
                                    src={nftData && nftData.media_uri}
                                    text={variables[props.lang]['asset_preview_not_ready']}/>}
                        <div>
                            <div className="row">
                                <p>{denom && (denom.name || denom.symbol)}</p>
                                <p>{nftData && nftData.name}</p>
                            </div>
                            <div className="row hash">
                                <p>{variables[props.lang]['nft_id']}:</p>
                                <div className="hash_text" title={nftData && nftData.id}>
                                    <p className="name">{nftData && nftData.id}</p>
                                    {nftData && nftData.id &&
                                        nftData.id.slice(nftData.id.length - 6, nftData.id.length)}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="burn_text">
                        {variables[props.lang]['enter_last_characters']}
                    </div>
                    <form
                        noValidate
                        autoComplete="off"
                        className="burn_text_field"
                        onKeyPress={handleKeyPress}
                        onSubmit={(e) => {
                            e.preventDefault();
                        }}>
                        <BurnIDTextField/>
                    </form>
                    <div className="burn_actions">
                        <Button
                            className="cancel_button"
                            onClick={props.handleClose}>
                            {variables[props.lang].cancel}
                        </Button>
                        <Button
                            className="primary_button"
                            disabled={disable} onClick={handleBurn}>
                            {broadCastInProgress
                                ? variables[props.lang].processing + '...'
                                : inProgress
                                    ? variables[props.lang]['approval_pending'] + '...'
                                    : variables[props.lang].burn}
                        </Button>
                    </div>
                    {(inProgress || broadCastInProgress) && <CircularProgress className="full_screen"/>}
                </div>
    );
};

Burn.propTypes = {
    address: PropTypes.string.isRequired,
    allowances: PropTypes.array.isRequired,
    allowancesInProgress: PropTypes.bool.isRequired,
    aminoBroadCastInProgress: PropTypes.bool.isRequired,
    aminoSignTx: PropTypes.func.isRequired,
    asset: PropTypes.object.isRequired,
    balance: PropTypes.array.isRequired,
    broadCastInProgress: PropTypes.bool.isRequired,
    burnID: PropTypes.string.isRequired,
    collectionsSkip: PropTypes.number.isRequired,
    failed: PropTypes.bool.isRequired,
    fetchCollectionMyNFTs: PropTypes.func.isRequired,
    fetchNFT: PropTypes.func.isRequired,
    fetchNonListedCollectionNFTs: PropTypes.func.isRequired,
    fetchTxHash: PropTypes.func.isRequired,
    fetchUserCollections: PropTypes.func.isRequired,
    fetchUserNFTs: PropTypes.func.isRequired,
    gasEstimation: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
    keys: PropTypes.object.isRequired,
    lang: PropTypes.string.isRequired,
    listingsSkip: PropTypes.number.isRequired,
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
    }).isRequired,
    nftSSkip: PropTypes.number.isRequired,
    setBurnDialogFailed: PropTypes.func.isRequired,
    setBurnDialogSuccess: PropTypes.func.isRequired,
    setTxHashInProgressFalse: PropTypes.func.isRequired,
    showMessage: PropTypes.func.isRequired,
    sign: PropTypes.func.isRequired,
    signInProgress: PropTypes.bool.isRequired,
    success: PropTypes.bool.isRequired,
    txHashInProgress: PropTypes.bool.isRequired,
    txSignAndBroadCast: PropTypes.func.isRequired,
    txSignAndBroadCastAminoSign: PropTypes.func.isRequired,
    walletConnectSign: PropTypes.func.isRequired,
    match: PropTypes.shape({
        params: PropTypes.shape({
            address: PropTypes.string,
            tab: PropTypes.string,
            id: PropTypes.string,
            nftID: PropTypes.string,
        }),
    }),
    nonListedNFTsSkip: PropTypes.number,
    nonListedNFTsTotal: PropTypes.number,
    walletConnector: PropTypes.object,
};

const stateToProps = (state) => {
    return {
        address: state.account.wallet.connection.address,
        lang: state.language,
        burnID: state.marketplace.burnID,
        failed: state.marketplace.burnDialog.failed,
        inProgress: state.marketplace.newListNFT.inProgress,
        allowances: state.account.bc.allowances.value,
        allowancesInProgress: state.account.bc.allowances.inProgress,
        balance: state.account.bc.balance.value,
        broadCastInProgress: state.account.wallet.broadCast.inProgress,
        keys: state.account.wallet.connection.keys,
        signInProgress: state.account.bc.signTx.inProgress,
        txHashInProgress: state.account.bc.txHash.inProgress,
        nonListedNFTsTotal: state.collection.nonListedCollectionNFTs.total,
        nonListedNFTsSkip: state.collection.nonListedCollectionNFTs.skip,
        collectionsSkip: state.myAccount.userCollections.skip,
        nftSSkip: state.myAccount.userNFTs.skip,
        success: state.marketplace.burnDialog.success,
        walletConnector: state.account.wallet.connection.walletConnector,
    };
};

const actionToProps = {
    handleClose: hideBurnDialog,
    showMessage,
    aminoSignTx,
    fetchTxHash: fetchTxHash,
    setTxHashInProgressFalse: setTxHashInProgressFalse,
    sign: protoBufSigning,
    setBurnDialogFailed,
    setBurnDialogSuccess,
    txSignAndBroadCast: txSignAndBroadCast,
    txSignAndBroadCastAminoSign: txSignAndBroadCastAminoSign,
    fetchUserCollections,
    fetchUserNFTs,
    fetchCollectionMyNFTs,
    fetchNonListedCollectionNFTs,
    fetchNFT,
    gasEstimation,
    walletConnectSign,
};

export default withRouter(connect(stateToProps, actionToProps)(Burn));
