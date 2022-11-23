import React, { useState } from 'react';
import * as PropTypes from 'prop-types';
import { deListNFT, fetchListings, fetchNFT, hideDelistDialog } from '../../../../actions/marketplace';
import { Dialog } from '@mui/material';
import variables from '../../../../utils/variables';
import './index.css';
import { Button } from '@material-ui/core';
import successIcon from '../../../../assets/collections/success.svg';
import CopyButton from '../../../../components/CopyButton';
import failIcon from '../../../../assets/collections/failed.svg';
import { fetchBalance } from '../../../../actions/account/BCDetails';
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
import { config, DEFAULT_LIMIT, DEFAULT_SKIP, EXPLORER_URL, TRANSACTION_SET_TIME_OUT } from '../../../../config';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { fetchUserCollections, fetchUserNFTs } from '../../../../actions/myAccount';
import { showMessage } from '../../../../actions/snackbar';
import { tokensList } from '../../../../utils/defaultOptions';
import ImageOnLoad from '../../../../components/ImageOnLoad';
import NetworkImages from '../../../../components/NetworkImages';
import { customTypes } from '../../../../registry';
import TotalSale from '../TransferSell/ListDialog/TotalSale';
import thumbnail from '../../../../assets/collections/thumbnail.svg';
import { getAssetType, getAssetTypeExtension } from '../../../../utils/strings';
import {
    fetchCollectionAuctions,
    fetchCollectionMyNFTs,
    fetchListedCollectionNFTs,
    fetchNonListedCollectionNFTs,
} from '../../../../actions/collections';
import moment from 'moment';
import { fetchAuctionsListings } from '../../../../actions/auctions';
import { fetchStats } from '../../../../actions/home';

const DeListDialog = (props) => {
    const [fail, setFail] = useState(false);
    const [success, setSuccess] = useState(false);
    const [hash, setHash] = useState('');

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
                    handleDeListHash(res1, path);
                });
            } else {
                setFail(true);
            }
        });
    };

    const handleDeListWalletConnect = (data, msg, granterInfo, balance, path) => {
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
            props.address, null, 'DeListNFT', (result) => {
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
                            handleDeListHash(res1, path);
                        });
                    } else {
                        setFail(true);
                    }
                });
            });
    };

    const handleDelist = () => {
        const path = props.location.pathname && props.location.pathname.split('/')[1];

        const data = {
            base_req: {
                from: props.address,
                chain_id: config.CHAIN_ID,
            },
            owner: props.address,
        };

        props.deListNFT(data, props.value && props.value.nftDetails && props.value.nftDetails.list &&
            props.value.nftDetails.list.id, (res) => {
            if (res) {
                let balance = props.balance && props.balance.length && props.balance.find((val) => val.denom === config.COIN_MINIMAL_DENOM);
                balance = balance && balance.amount && balance.amount / (10 ** config.COIN_DECIMALS);

                const Tx = {
                    msgs: res.value && res.value.msg,
                    msgType: 'DeListNFT',
                    fee: {
                        amount: [{
                            amount: String(5000),
                            denom: config.COIN_MINIMAL_DENOM,
                        }],
                        gasLimit: String(200000),
                    },
                    memo: '',
                };

                const type = customTypes && customTypes.DeListNFT && customTypes.DeListNFT.typeUrl;
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
                    handleDeListWalletConnect(Tx, res.value && res.value.msg, granterInfo, balance, path);

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
                            handleDeListHash(res1, path);
                        });
                    } else {
                        setFail(true);
                    }
                });
            }
        });
    };

    const handleDeListHash = (res1, path) => {
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

                        props.fetchBalance(props.address);
                        setSuccess(true);
                        props.setTxHashInProgressFalse();
                        if (path === 'nfts') {
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
                        } else if ((path === 'account') &&
                            props.match && props.match.params && props.match.params.address) {
                            props.fetchUserCollections(props.match.params.address, DEFAULT_SKIP, props.collectionsSkip + DEFAULT_LIMIT);
                            props.fetchUserNFTs(props.match.params.address, DEFAULT_SKIP, props.nftSSkip + DEFAULT_LIMIT, () => {
                                setTimeout(() => {
                                    props.fetchUserNFTs(props.match.params.address, DEFAULT_SKIP, props.nftSSkip + DEFAULT_LIMIT);
                                }, TRANSACTION_SET_TIME_OUT);
                            });
                        } else if ((path === 'collection') &&
                            props.match && props.match.params && props.match.params.id) {
                            props.fetchCollectionMyNFTs(props.match.params.id, props.address, DEFAULT_SKIP, DEFAULT_LIMIT);
                            props.fetchListedCollectionNFTs(props.match.params.id, DEFAULT_SKIP, props.listedNFTsSkip + DEFAULT_LIMIT, null, null, null, null, null, null, (result, total) => {
                                if (total === props.listedNFTsTotal) {
                                    setTimeout(() => {
                                        props.fetchCollectionMyNFTs(props.match.params.id, props.address, DEFAULT_SKIP, DEFAULT_LIMIT);
                                        props.fetchListedCollectionNFTs(props.match.params.id, DEFAULT_SKIP, props.listedNFTsSkip + DEFAULT_LIMIT);
                                        props.fetchNonListedCollectionNFTs(props.match.params.id, DEFAULT_SKIP, DEFAULT_LIMIT);
                                    }, TRANSACTION_SET_TIME_OUT);
                                } else {
                                    props.fetchNonListedCollectionNFTs(props.match.params.id, DEFAULT_SKIP, DEFAULT_LIMIT);
                                }
                            });
                        } else if ((path === 'nft') &&
                            props.match && props.match.params && props.match.params.nftID) {
                            props.fetchNFT(props.match.params.nftID, (result) => {
                                if (result && result.list) {
                                    setTimeout(() => {
                                        props.fetchNFT(props.match.params.nftID);
                                    }, TRANSACTION_SET_TIME_OUT);
                                }
                            });
                        }
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
                        props.handleClose();
                        props.setTxHashInProgressFalse();
                        clearInterval(time);
                    }
                });
            }, 5000);
        } else {
            setFail(true);
        }
    };

    const handleCancelAuctionLedgerTransaction = (data, path) => {
        let balance = props.balance && props.balance.length && props.balance.find((val) => val.denom === config.COIN_MINIMAL_DENOM);
        balance = balance && balance.amount && balance.amount / (10 ** config.COIN_DECIMALS);

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
                type: 'OmniFlix/marketplace/MsgCancelAuction',
                value: data,
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
                    handleCancelAuctionHash(res1, path);
                });
            } else {
                setFail(true);
            }
        });
    };

    const handleCancelAuctionWalletConnect = (data, path) => {
        let balance = props.balance && props.balance.length && props.balance.find((val) => val.denom === config.COIN_MINIMAL_DENOM);
        balance = balance && balance.amount && balance.amount / (10 ** config.COIN_DECIMALS);

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

        const Tx = {
            msgs: [{
                type: 'OmniFlix/marketplace/MsgCancelAuction',
                value: data,
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

        props.gasEstimation(Tx, props.keys && props.keys.pubKey,
            props.address, null, 'CancelAuction', (result) => {
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
                            handleCancelAuctionHash(res1, path);
                        });
                    } else {
                        setFail(true);
                    }
                });
            });
    };

    const handleCancelAuction = () => {
        const path = props.location.pathname && props.location.pathname.split('/')[1];

        const data = {
            auction_id: auction && auction.id,
            owner: props.address,
        };

        if (props.walletConnector && props.walletConnector._connected) {
            handleCancelAuctionWalletConnect(data, path);

            return;
        }

        if (props.keys && props.keys.isNanoLedger) {
            handleCancelAuctionLedgerTransaction(data, path);

            return;
        }

        let balance = props.balance && props.balance.length && props.balance.find((val) => val.denom === config.COIN_MINIMAL_DENOM);
        balance = balance && balance.amount && balance.amount / (10 ** config.COIN_DECIMALS);

        const Tx = {
            msgs: [{
                type: customTypes && customTypes.CancelAuction && customTypes.CancelAuction.typeUrl,
                value: data,
            }],
            msgType: 'CancelAuction',
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

        props.sign(Tx, props.address, (result, txBytes) => {
            if (result) {
                const resData = {
                    tx_bytes: txBytes,
                    mode: 'BROADCAST_MODE_SYNC',
                };
                props.txSignAndBroadCast(resData, (res1) => {
                    handleCancelAuctionHash(res1, path);
                });
            } else {
                setFail(true);
            }
        });
    };

    const handleCancelAuctionHash = (res1, path) => {
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

                        props.fetchBalance(props.address);
                        setSuccess(true);
                        props.setTxHashInProgressFalse();
                        if (path === 'nfts') {
                            props.fetchAuctionsListings(DEFAULT_SKIP, props.auctionListingsSkip + DEFAULT_LIMIT, null, null, null, null, null, null, null, null, (result, total) => {
                                if (total === props.auctionListingsTotal) {
                                    setTimeout(() => {
                                        props.fetchAuctionsListings(DEFAULT_SKIP, props.auctionListingsSkip + DEFAULT_LIMIT);
                                        props.fetchStats();
                                    }, TRANSACTION_SET_TIME_OUT);
                                } else {
                                    props.fetchStats();
                                }
                            });
                        } else if ((path === 'account') &&
                            props.match && props.match.params && props.match.params.address) {
                            props.fetchUserCollections(props.match.params.address, DEFAULT_SKIP, props.collectionsSkip + DEFAULT_LIMIT);
                            props.fetchUserNFTs(props.match.params.address, DEFAULT_SKIP, props.nftSSkip + DEFAULT_LIMIT, () => {
                                setTimeout(() => {
                                    props.fetchUserNFTs(props.match.params.address, DEFAULT_SKIP, props.nftSSkip + DEFAULT_LIMIT);
                                }, TRANSACTION_SET_TIME_OUT);
                            });
                        } else if ((path === 'collection') &&
                            props.match && props.match.params && props.match.params.id) {
                            props.fetchCollectionAuctions(props.match.params.id, DEFAULT_SKIP, props.collectionAuctionsSkip + DEFAULT_LIMIT, null, null, null, null, null, null, null, null, (result, total) => {
                                if (total === props.collectionAuctionsTotal) {
                                    setTimeout(() => {
                                        props.fetchCollectionMyNFTs(props.match.params.id, props.address, DEFAULT_SKIP, DEFAULT_LIMIT);
                                        props.fetchCollectionAuctions(props.match.params.id, DEFAULT_SKIP, props.collectionAuctionsSkip + DEFAULT_LIMIT);
                                        props.fetchNonListedCollectionNFTs(props.match.params.id, DEFAULT_SKIP, DEFAULT_LIMIT);
                                    }, TRANSACTION_SET_TIME_OUT);
                                } else {
                                    props.fetchCollectionMyNFTs(props.match.params.id, props.address, DEFAULT_SKIP, DEFAULT_LIMIT);
                                    props.fetchNonListedCollectionNFTs(props.match.params.id, DEFAULT_SKIP, DEFAULT_LIMIT);
                                }
                            });
                        } else if ((path === 'nft') &&
                            props.match && props.match.params && props.match.params.nftID) {
                            props.fetchNFT(props.match.params.nftID, (result) => {
                                if (result && result.list) {
                                    setTimeout(() => {
                                        props.fetchNFT(props.match.params.nftID);
                                    }, TRANSACTION_SET_TIME_OUT);
                                }
                            });
                        }
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
                        props.handleClose();
                        props.setTxHashInProgressFalse();
                        clearInterval(time);
                    }
                });
            }, 5000);
        } else {
            setFail(true);
        }
    };

    const handleClose = () => {
        setFail(false);
        setSuccess(false);
        setHash('');
        props.handleClose();
    };

    const inProgress = props.inProgress || props.signInProgress;
    const broadCastInProgress = props.broadCastInProgress || props.aminoBroadCastInProgress || props.txHashInProgress;

    const auction = props.value && props.value.nftDetails && props.value.nftDetails.auction;
    let price = auction && auction.price && auction.price.amount
        ? auction.price.amount
        : props.value && props.value.nftDetails && props.value.nftDetails.list &&
        props.value.nftDetails.list.price && props.value.nftDetails.list.price.amount;
    let denom = auction && auction.price && auction.price.denom
        ? auction.price.denom
        : props.value && props.value.nftDetails && props.value.nftDetails.list &&
        props.value.nftDetails.list.price && props.value.nftDetails.list.price.denom;
    const tokenType = denom && tokensList.find((val) => val.value === denom);
    const ibcToken = denom && props.ibcTokensList && props.ibcTokensList.length &&
        props.ibcTokensList.find((val) => val && val.ibc_denom_hash && (val.ibc_denom_hash === denom));
    denom = ibcToken && ibcToken.network && ibcToken.network.display_denom
        ? ibcToken.network.display_denom : config.COIN_DENOM;
    const decimals = ibcToken && ibcToken.network && ibcToken.network.decimals
        ? ibcToken.network.decimals
        : config.COIN_DECIMALS;
    price = price / (10 ** decimals);

    const collection = props.value && props.value.nftDetails && props.value.nftDetails.denom_id;
    const nft = props.value && props.value.nftDetails;
    const splitInfo = props.value && props.value.nftDetails && props.value.nftDetails.list &&
        props.value.nftDetails.list.split_shares;
    const mediaType = nft && nft.media_type;

    const totalSale = {
        tokenPrice: price,
        tokenValue: ibcToken && ibcToken.network ? ibcToken : tokenType,
        details: props.value && props.value.nftDetails,
        splitInfo: splitInfo,
    };

    return (
        <Dialog
            aria-describedby="preview-dialog-description"
            aria-labelledby="preview-dialog-title"
            className="dialog delist_dialog"
            open={props.open}
            onClose={handleClose}>
            {success
                ? <div className="delist_dialog_content delist_success">
                    <img alt="" src={successIcon}/>
                    {auction
                        ? <h2 className="title">{variables[props.lang]['auctions_cancelled_successfully']}</h2>
                        : <h2 className="title">{variables[props.lang]['asset_successfully_removed_from_list']}</h2>}
                    <span>{variables[props.lang]['transaction_hash']}</span>
                    <div className="tx_hash">
                        <div onClick={() => window.open(`${EXPLORER_URL + '/transactions/' + hash}`)}>{hash}</div>
                        <CopyButton data={EXPLORER_URL + '/transactions/' + hash}/>
                    </div>
                    <div className="delist_dialog_action">
                        <Button className="delist_confirm" onClick={handleClose}>
                            {variables[props.lang]['close_window']}
                        </Button>
                    </div>
                </div>
                : fail
                    ? <div className="delist_dialog_content delist_success">
                        <img alt="" src={failIcon}/>
                        <h2 className="title">{variables[props.lang]['failed_to_remove_asset']}</h2>
                        <div className="delist_dialog_action">
                            <Button className="delist_confirm" onClick={handleClose}>
                                {variables[props.lang]['close_window']}
                            </Button>
                        </div>
                    </div>
                    : <div className="delist_dialog_content confirm_listing scroll_bar">
                        {auction
                            ? <h2>{variables[props.lang]['cancel_auction_confirmation']}</h2>
                            : <h2>{variables[props.lang]['de_listing_nft_confirmation']}</h2>}
                        <div className="ledger_note">
                            <p>{variables[props.lang]['ledger_note']}</p>
                        </div>
                        <div className="row1">
                            <div className="left_section">
                                {mediaType &&
                                getAssetType(mediaType) === 'image' && getAssetTypeExtension(mediaType) === 'gif'
                                    ? <ImageOnLoad
                                        preview={nft.preview_uri}
                                        src={nft.media_uri}
                                        text={variables[props.lang]['asset_preview_not_ready']}/>
                                    : mediaType &&
                                    getAssetType(mediaType) === 'image' && nft
                                        ? <ImageOnLoad
                                            cdn={nft && nft.cloudflare_cdn && nft.cloudflare_cdn.variants}
                                            preview={nft.preview_uri}
                                            src={nft.media_uri}
                                            text={variables[props.lang]['asset_preview_not_ready']}/>
                                        : nft
                                            ? <ImageOnLoad
                                                preview={nft.preview_uri}
                                                src={nft.media_uri}
                                                text={variables[props.lang]['asset_preview_not_ready']}/>
                                            : <ImageOnLoad
                                                src={thumbnail}
                                                text={variables[props.lang]['asset_preview_not_ready']}/>}
                                <div className="row">
                                    <div className="names">
                                        <span>
                                            {collection && (collection.name || collection.symbol)}
                                        </span>
                                        <p>{nft && nft.name}</p>
                                    </div>
                                    <div className="price">
                                        <span>List price</span>
                                        <p>
                                            <NetworkImages name={denom}/>
                                            {price}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="right_section">
                                <div className="row">
                                    <span>{variables[props.lang].message_type}</span>
                                    {customTypes.DeListNFT && customTypes.DeListNFT.typeUrl && customTypes.DeListNFT.typeUrl.length > 20
                                        ? <div className="hash_text hash_text_content">
                                            <p className="name">{customTypes.DeListNFT && customTypes.DeListNFT.typeUrl}</p>
                                            {customTypes.DeListNFT && customTypes.DeListNFT.typeUrl &&
                                                customTypes.DeListNFT.typeUrl.slice(customTypes.DeListNFT.typeUrl.length - 10, customTypes.DeListNFT.typeUrl.length)}
                                        </div>
                                        : <p>{customTypes.DeListNFT && customTypes.DeListNFT.typeUrl}</p>}
                                </div>
                                <div className="row">
                                    <span>{variables[props.lang].nft_id}</span>
                                    {nft && nft.id && nft.id.length > 20
                                        ? <div className="hash_text hash_text_content">
                                            <p className="name">{nft.id}</p>
                                            {nft.id && nft.id.slice(nft.id.length - 6, nft.id.length)}
                                        </div>
                                        : <p>
                                            {nft && nft.id}
                                        </p>}
                                </div>
                                <div className="row">
                                    <span>{variables[props.lang].denom_id}</span>
                                    {collection && collection.id && collection.id.length > 20
                                        ? <div className="hash_text hash_text_content">
                                            <p className="name">{collection && collection.id}</p>
                                            {collection.id &&
                                                collection.id.slice(collection.id.length - 6, collection.id.length)}
                                        </div>
                                        : <p>{collection && collection.id}</p>}
                                </div>
                                <div className="row">
                                    <span>{variables[props.lang].listed_type}</span>
                                    <p>{auction
                                        ? variables[props.lang]['timed_auction']
                                        : variables[props.lang]['fixed_price']}</p>
                                </div>
                                <div className="row">
                                    <span>{variables[props.lang].price}</span>
                                    <p>{price} {denom}</p>
                                </div>
                                {auction &&
                                    <div className="row">
                                        <span>{variables[props.lang].bid_increment_per}</span>
                                        <p>{auction.increment_percentage} {' %'}</p>
                                    </div>}
                                {auction &&
                                    <div className="row">
                                        <span>{variables[props.lang]['start_time']}</span>
                                        <p>{auction.start_time && moment(auction.start_time).format('MMM Do \'YY LT')}</p>
                                    </div>}
                                {auction &&
                                    <div className="row">
                                        <span>{variables[props.lang]['end_time']}</span>
                                        <p>{auction.end_time && moment(auction.end_time).format('MMM Do \'YY LT')}</p>
                                    </div>}
                                {auction && auction.whitelist_accounts && auction.whitelist_accounts.length
                                    ? <div className="row">
                                        <span>{variables[props.lang].whitelist}</span>
                                        <p>Yes</p>
                                    </div> : null}
                                <TotalSale deList totalSale={totalSale}/>
                            </div>
                        </div>
                        <div className="confirm_list_action delist_dialog_action">
                            <Button className="delist_cancel" onClick={handleClose}>
                                {variables[props.lang].cancel}
                            </Button>
                            {auction
                                ? <Button
                                    className="delist_confirm"
                                    disabled={inProgress || broadCastInProgress}
                                    onClick={handleCancelAuction}>
                                    {broadCastInProgress
                                        ? variables[props.lang].processing + '...'
                                        : inProgress
                                            ? variables[props.lang]['approval_pending'] + '...'
                                            : variables[props.lang]['cancel_auction']}
                                </Button>
                                : <Button
                                    className="delist_confirm"
                                    disabled={inProgress || broadCastInProgress}
                                    onClick={handleDelist}>
                                    {broadCastInProgress
                                        ? variables[props.lang].processing + '...'
                                        : inProgress
                                            ? variables[props.lang]['approval_pending'] + '...'
                                            : variables[props.lang]['confirm_de_listing']}
                                </Button>}
                        </div>
                    </div>
            }
        </Dialog>
    );
};

DeListDialog.propTypes = {
    address: PropTypes.string.isRequired,
    allowances: PropTypes.array.isRequired,
    aminoBroadCastInProgress: PropTypes.bool.isRequired,
    aminoSignTx: PropTypes.func.isRequired,
    balance: PropTypes.array.isRequired,
    broadCastInProgress: PropTypes.bool.isRequired,
    collectionsSkip: PropTypes.number.isRequired,
    deListNFT: PropTypes.func.isRequired,
    fetchAuctionsListings: PropTypes.func.isRequired,
    fetchBalance: PropTypes.func.isRequired,
    fetchCollectionAuctions: PropTypes.func.isRequired,
    fetchCollectionMyNFTs: PropTypes.func.isRequired,
    fetchListedCollectionNFTs: PropTypes.func.isRequired,
    fetchListings: PropTypes.func.isRequired,
    fetchNFT: PropTypes.func.isRequired,
    fetchNonListedCollectionNFTs: PropTypes.func.isRequired,
    fetchStats: PropTypes.func.isRequired,
    fetchTxHash: PropTypes.func.isRequired,
    fetchUserCollections: PropTypes.func.isRequired,
    fetchUserNFTs: PropTypes.func.isRequired,
    gasEstimation: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
    ibcTokensList: PropTypes.array.isRequired,
    inProgress: PropTypes.bool.isRequired,
    keys: PropTypes.object.isRequired,
    lang: PropTypes.string.isRequired,
    listingsSkip: PropTypes.number.isRequired,
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
    }).isRequired,
    nftSSkip: PropTypes.number.isRequired,
    open: PropTypes.bool.isRequired,
    setTxHashInProgressFalse: PropTypes.func.isRequired,
    showMessage: PropTypes.func.isRequired,
    sign: PropTypes.func.isRequired,
    signInProgress: PropTypes.bool.isRequired,
    txHashInProgress: PropTypes.bool.isRequired,
    txSignAndBroadCast: PropTypes.func.isRequired,
    txSignAndBroadCastAminoSign: PropTypes.func.isRequired,
    value: PropTypes.object.isRequired,
    walletConnectSign: PropTypes.func.isRequired,
    auctionListingsSkip: PropTypes.number,
    auctionListingsTotal: PropTypes.number,
    collectionAuctionsSkip: PropTypes.number,
    collectionAuctionsTotal: PropTypes.number,
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
        auctionListingsTotal: state.auctions.auctionListings.total,
        auctionListingsSkip: state.auctions.auctionListings.skip,
        balance: state.account.bc.balance.value,
        broadCastInProgress: state.account.wallet.broadCast.inProgress,
        collectionAuctionsTotal: state.collection.auctions.total,
        collectionAuctionsSkip: state.collection.auctions.skip,
        inProgress: state.marketplace.newListNFT.inProgress,
        keys: state.account.wallet.connection.keys,
        open: state.marketplace.delistDialog.open,
        value: state.marketplace.delistDialog.value,
        signInProgress: state.account.bc.signTx.inProgress,
        lang: state.language,
        txHashInProgress: state.account.bc.txHash.inProgress,
        listedNFTsTotal: state.collection.listedCollectionNFTs.total,
        listedNFTsSkip: state.collection.listedCollectionNFTs.skip,
        listingsSkip: state.marketplace.listings.skip,
        listingsTotal: state.marketplace.listings.total,
        collectionsSkip: state.myAccount.userCollections.skip,
        nftSSkip: state.myAccount.userNFTs.skip,

        ibcTokensList: state.marketplace.ibcTokensList.value,
        walletConnector: state.account.wallet.connection.walletConnector,
    };
};

const actionToProps = {
    aminoSignTx,
    deListNFT,
    fetchAuctionsListings,
    fetchBalance,
    fetchCollectionAuctions,
    fetchCollectionMyNFTs,
    fetchTxHash,
    fetchListings,
    fetchUserCollections,
    fetchUserNFTs,
    fetchNFT,
    fetchListedCollectionNFTs,
    fetchNonListedCollectionNFTs,
    fetchStats,
    gasEstimation,
    handleClose: hideDelistDialog,
    showMessage,
    sign: protoBufSigning,
    setTxHashInProgressFalse,
    txSignAndBroadCast,
    txSignAndBroadCastAminoSign,
    walletConnectSign,
};

export default withRouter(connect(stateToProps, actionToProps)(DeListDialog));
