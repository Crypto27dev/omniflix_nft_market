import React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './index.css';
import { Button, Dialog, DialogContent, Tooltip } from '@material-ui/core';
import variables from '../../../../../utils/variables';
import ListingTabs from './ListingTabs';
import ChoosePrice from './ChoosePrice';
import {
    fetchNFT,
    hideSellDialog,
    listNFT,
    setConfirmListing,
    setListType,
    showDelistDialog,
} from '../../../../../actions/marketplace';
import Info from './Info';
import successIcon from '../../../../../assets/collections/success.svg';
import CopyButton from '../../../../../components/CopyButton';
import failIcon from '../../../../../assets/collections/failed.svg';
import { config, DEFAULT_LIMIT, DEFAULT_SKIP, EXPLORER_URL, TRANSACTION_SET_TIME_OUT } from '../../../../../config';
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
import { fetchBalance } from '../../../../../actions/account/BCDetails';
import { fetchUserCollections, fetchUserNFTs } from '../../../../../actions/myAccount';
import { withRouter } from 'react-router';
import { showMessage } from '../../../../../actions/snackbar';
import SplitInfoSwitch from './SplitInfoSwitch';
import SplitInfo from './SplitInfo';
import TotalSale from './TotalSale';
import { decodeFromBech32 } from '../../../../../utils/address';
import ConfirmListingDialog from './ConfirmListingDialog';
import { customTypes } from '../../../../../registry';
import {
    fetchCollectionAuctions,
    fetchCollectionMyNFTs,
    fetchListedCollectionNFTs,
    fetchNonListedCollectionNFTs,
} from '../../../../../actions/collections';
import MinBidPrice from './TimedAuction/MinBidPrice';
import BidPercentageTextField from './TimedAuction/MinBidPrice/BidPercentageTextField';
import WhiteListSwitch from './TimedAuction/WhiteListSwitch';
import StartDateTextField from './TimedAuction/StartDateTextField';
import EndDateTextField from './TimedAuction/EndDateTextField';
import WhiteListTags from './TimedAuction/WhiteListTags';
import InfoIcon from '../../../../../assets/info.svg';
import moment from 'moment';
import { fetchAuctionsListings } from '../../../../../actions/auctions';
import { fetchStats } from '../../../../../actions/home';
import { noExponent } from '../../../../../utils/numbers';

class ListDialog extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            failed: false,
            success: false,
            hash: '',
            list: {},
        };

        this.handleSuccess = this.handleSuccess.bind(this);
        this.handleDeList = this.handleDeList.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleLedgerTransaction = this.handleLedgerTransaction.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleAuctionLedgerTransaction = this.handleAuctionLedgerTransaction.bind(this);
        this.handleCreateAuction = this.handleCreateAuction.bind(this);
        this.handleListHash = this.handleListHash.bind(this);
        this.handleWalletConnect = this.handleWalletConnect.bind(this);
        this.handleAuctionHash = this.handleAuctionHash.bind(this);
        this.handleAuctionWalletConnect = this.handleAuctionWalletConnect.bind(this);
    }

    handleChange (value) {
        this.props.setListType(value);
    }

    handleLedgerTransaction (data, path) {
        let balance = this.props.balance && this.props.balance.length && this.props.balance.find((val) => val.denom === config.COIN_MINIMAL_DENOM);
        balance = balance && balance.amount && balance.amount / (10 ** config.COIN_DECIMALS);

        const type = customTypes && customTypes.ListNFT && customTypes.ListNFT.typeUrl;
        const granterInfo = {};
        if (this.props.allowances && this.props.allowances.length) {
            this.props.allowances.map((val) => {
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

        if (granterInfo && granterInfo.granter && window.keplr && (!balance || (balance && (balance < 0.1)))) {
            window.keplr.defaultOptions = {
                sign: {
                    disableBalanceCheck: true,
                },
            };
        } else if (window.keplr) {
            window.keplr.defaultOptions = {};
        }

        this.props.listNFT(data, (res) => {
            if (res) {
                const data = {
                    msgs: res.value && res.value.msg,
                    fee: {
                        amount: [{
                            amount: String(5000),
                            denom: config.COIN_MINIMAL_DENOM,
                        }],
                        gas: String(200000),
                    },
                    memo: '',
                };

                this.props.aminoSignTx(data, this.props.address, (result) => {
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
                        this.props.txSignAndBroadCastAminoSign(data, (res1) => {
                            this.handleListHash(res, res1, path);
                        });
                    }
                });
            }
        });
    }

    handleWalletConnect (data, path) {
        let balance = this.props.balance && this.props.balance.length && this.props.balance.find((val) => val.denom === config.COIN_MINIMAL_DENOM);
        balance = balance && balance.amount && balance.amount / (10 ** config.COIN_DECIMALS);

        const type = customTypes && customTypes.ListNFT && customTypes.ListNFT.typeUrl;
        const granterInfo = {};
        if (this.props.allowances && this.props.allowances.length) {
            this.props.allowances.map((val) => {
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

        this.props.listNFT(data, (res) => {
            if (res) {
                const data = {
                    msgs: res.value && res.value.msg,
                    fee: {
                        amount: [{
                            amount: String(0),
                            denom: config.COIN_MINIMAL_DENOM,
                        }],
                        gas: String(200000),
                    },
                    memo: '',
                };

                this.props.gasEstimation(data, this.props.keys && this.props.keys.pubKey,
                    this.props.address, null, 'ListNFT', (result) => {
                        if (result && result.gas_used) {
                            let fee = result.gas_used * config.AVG_GAS_STEP;
                            fee = fee.toFixed(0);

                            if (fee) {
                                data.fee.amount = [{
                                    amount: fee,
                                    denom: config.COIN_MINIMAL_DENOM,
                                }];
                            }
                        } else {
                            let fee = 5000 * config.AVG_GAS_STEP;
                            fee = fee.toFixed(0);

                            data.fee.amount = [{
                                amount: String(fee),
                                denom: config.COIN_MINIMAL_DENOM,
                            }];
                        }

                        this.props.walletConnectSign(this.props.walletConnector, data, this.props.address, (result) => {
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
                                this.props.txSignAndBroadCastAminoSign(data, (res1) => {
                                    this.handleListHash(res, res1, path);
                                });
                            }
                        });
                    });
            }
        });
    }

    handleSuccess () {
        let price = null;
        if (this.props.sellTokenValue && (this.props.sellTokenValue.value === 'uflix')) {
            price = (this.props.sellTokenPrice * (10 ** config.COIN_DECIMALS)) + (this.props.sellTokenValue && this.props.sellTokenValue.value);
        } else {
            const decimals = this.props.sellTokenValue && this.props.sellTokenValue.network && this.props.sellTokenValue.network.decimals;
            const denom = this.props.sellTokenValue && this.props.sellTokenValue.ibc_denom_hash;
            price = (this.props.sellTokenPrice * (10 ** decimals)) + (denom);
        }
        const path = this.props.location.pathname && this.props.location.pathname.split('/')[1];

        const data = {
            base_req: {
                from: this.props.address,
                chain_id: config.CHAIN_ID,
            },
            owner: this.props.value && this.props.value.nftDetails && this.props.value.nftDetails.owner,
            denom_id: this.props.value && this.props.value.nftDetails && this.props.value.nftDetails.denom_id &&
                this.props.value.nftDetails.denom_id.id,
            nft_id: this.props.value && this.props.value.nftDetails && this.props.value.nftDetails.id,
            price: price,
            split_shares: [],
        };

        let valid = true;
        if (this.props.splitInfoStatus) {
            const array = [];
            this.props.splitInfo.map((val) => {
                const obj = {};
                obj.address = val.address;
                obj.weight = String(val.weight / 100);
                if (val.address === '' || val.weight === '') {
                    return null;
                } else if (val.address !== '') {
                    const validity = val.address && decodeFromBech32(val.address) && (val.address.indexOf(config.PREFIX) > -1);
                    if (!validity && valid) {
                        valid = false;
                    }
                }

                array.push(obj);
                return null;
            });
            data.split_shares = array;
        }

        if (!valid) {
            this.props.showMessage(variables[this.props.lang]['invalid_address'], 'warning');

            return;
        }

        if (this.props.walletConnector && this.props.walletConnector._connected) {
            this.handleWalletConnect(data, path);

            return;
        }

        if (this.props.keys && this.props.keys.isNanoLedger) {
            this.handleLedgerTransaction(data, path);

            return;
        }

        this.props.listNFT(data, (res) => {
            if (res) {
                let balance = this.props.balance && this.props.balance.length && this.props.balance.find((val) => val.denom === config.COIN_MINIMAL_DENOM);
                balance = balance && balance.amount && balance.amount / (10 ** config.COIN_DECIMALS);
                const msg = res.value && res.value.msg;
                if (msg.length && msg[0] && msg[0].value) {
                    if (!msg[0].value.split_shares) {
                        msg[0].value.split_shares = [];
                    } else {
                        if (this.props.splitInfoStatus) {
                            const array = [];
                            this.props.splitInfo.map((val) => {
                                const obj = {};
                                obj.address = val.address;
                                obj.weight = val.weight / 100;
                                obj.weight = (10 ** 18) * obj.weight;
                                obj.weight = String(obj.weight);
                                if (val.address === '' || val.weight === '') {
                                    return null;
                                }

                                array.push(obj);
                                return null;
                            });
                            msg[0].value.split_shares = array;
                        }
                    }
                }

                const Tx = {
                    msgs: res.value && res.value.msg,
                    msgType: 'ListNFT',
                    fee: {
                        amount: [{
                            amount: String(5000),
                            denom: config.COIN_MINIMAL_DENOM,
                        }],
                        gasLimit: String(200000),
                    },
                    memo: '',
                };

                const type = customTypes && customTypes.ListNFT && customTypes.ListNFT.typeUrl;
                const granterInfo = {};
                if (this.props.allowances && this.props.allowances.length) {
                    this.props.allowances.map((val) => {
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

                this.props.sign(Tx, this.props.address, (result, txBytes) => {
                    if (result) {
                        const data = {
                            tx_bytes: txBytes,
                            mode: 'BROADCAST_MODE_SYNC',
                        };
                        this.props.txSignAndBroadCast(data, (res1) => {
                            this.handleListHash(res, res1, path);
                        });
                    } else {
                        this.setState({
                            failed: true,
                        });
                    }
                });
            }
        });
    }

    handleListHash (res, res1, path) {
        if (res1 && res1.txhash) {
            this.setState({
                hash: res1.txhash,
            });
            let counter = 0;
            const time = setInterval(() => {
                this.props.fetchTxHash(res1.txhash, (hashResult) => {
                    if (hashResult) {
                        if (hashResult && hashResult.code !== undefined && hashResult.code !== 0) {
                            this.props.showMessage(hashResult.logs || hashResult.raw_log, 'error', hashResult && hashResult.hash);
                            this.setState({
                                failed: true,
                            });
                            this.props.setTxHashInProgressFalse();
                            clearInterval(time);

                            return;
                        }

                        this.props.fetchBalance(this.props.address);
                        this.setState({
                            success: true,
                            list: res.value && res.value.msg && res.value.msg.length &&
                                res.value.msg[0] && res.value.msg[0].value,
                        });
                        if ((path === 'account') &&
                            this.props.match && this.props.match.params && this.props.match.params.address) {
                            this.props.fetchUserCollections(this.props.match.params.address, DEFAULT_SKIP, this.props.collectionsSkip + DEFAULT_LIMIT);
                            this.props.fetchUserNFTs(this.props.match.params.address, DEFAULT_SKIP, this.props.nftSSkip + DEFAULT_LIMIT, () => {
                                setTimeout(() => {
                                    this.props.fetchUserNFTs(this.props.match.params.address, DEFAULT_SKIP, this.props.nftSSkip + DEFAULT_LIMIT);
                                }, TRANSACTION_SET_TIME_OUT);
                            });
                        } else if ((path === 'collection') &&
                            this.props.match && this.props.match.params && this.props.match.params.id) {
                            this.props.fetchCollectionMyNFTs(this.props.match.params.id, this.props.address, DEFAULT_SKIP, DEFAULT_LIMIT);
                            this.props.fetchNonListedCollectionNFTs(this.props.match.params.id, DEFAULT_SKIP, this.props.nonListedNFTsSkip + DEFAULT_LIMIT, null, (result, total) => {
                                if (total === this.props.nonListedNFTsTotal) {
                                    setTimeout(() => {
                                        this.props.fetchCollectionMyNFTs(this.props.match.params.id, this.props.address, DEFAULT_SKIP, DEFAULT_LIMIT);
                                        this.props.fetchNonListedCollectionNFTs(this.props.match.params.id, DEFAULT_SKIP, this.props.nonListedNFTsSkip + DEFAULT_LIMIT);
                                        this.props.fetchListedCollectionNFTs(this.props.match.params.id, DEFAULT_SKIP, DEFAULT_LIMIT);
                                    }, TRANSACTION_SET_TIME_OUT);
                                } else {
                                    this.props.fetchListedCollectionNFTs(this.props.match.params.id, DEFAULT_SKIP, DEFAULT_LIMIT);
                                }
                            });
                        } else if ((path === 'nft') &&
                            this.props.match && this.props.match.params && this.props.match.params.nftID) {
                            this.props.fetchNFT(this.props.match.params.nftID, (result) => {
                                if (result && !result.list) {
                                    setTimeout(() => {
                                        this.props.fetchNFT(this.props.match.params.nftID);
                                    }, TRANSACTION_SET_TIME_OUT);
                                }
                            });
                        }
                        this.props.setTxHashInProgressFalse();
                        clearInterval(time);
                    }

                    counter++;
                    if (counter === 3) {
                        if (hashResult && hashResult.code !== undefined && hashResult.code !== 0) {
                            this.props.showMessage(hashResult.logs || hashResult.raw_log, 'error', hashResult && hashResult.hash);
                            this.setState({
                                failed: true,
                            });
                            this.props.setTxHashInProgressFalse();
                            clearInterval(time);

                            return;
                        }

                        this.props.showMessage(variables[this.props.lang]['check_later']);
                        this.props.handleClose();
                        this.props.setTxHashInProgressFalse();
                        clearInterval(time);
                    }
                });
            }, 5000);
        } else {
            this.setState({
                failed: true,
            });
        }
    }

    handleDeList () {
        this.props.handleClose();
        const value = this.props.value;

        if (this.props.tabValue === 'timed-auction') {
            value.nftDetails = { ...this.state.list };
        } else {
            value.nftDetails = {
                ...value.nftDetails,
                list: this.state.list,
            };
        }

        this.props.showDelistDialog(value);
    }

    handleClose () {
        this.props.handleClose();
        this.setState({
            failed: false,
            success: false,
            hash: '',
            list: {},
        });
    }

    handleAuctionLedgerTransaction (resData, path, nftID) {
        let balance = this.props.balance && this.props.balance.length && this.props.balance.find((val) => val.denom === config.COIN_MINIMAL_DENOM);
        balance = balance && balance.amount && balance.amount / (10 ** config.COIN_DECIMALS);

        const type = customTypes && customTypes.CreateAuction && customTypes.CreateAuction.typeUrl;
        const granterInfo = {};
        if (this.props.allowances && this.props.allowances.length) {
            this.props.allowances.map((val) => {
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

        if (granterInfo && granterInfo.granter && window.keplr && (!balance || (balance && (balance < 0.1)))) {
            window.keplr.defaultOptions = {
                sign: {
                    disableBalanceCheck: true,
                },
            };
        } else if (window.keplr) {
            window.keplr.defaultOptions = {};
        }

        if (resData.duration) {
            let duration = moment(this.props.endDate).diff(this.props.startDate, 'seconds');
            duration = duration * (10 ** 9);
            duration = noExponent(duration);
            resData.duration = duration;
        }
        if (resData.increment_percentage) {
            const percentage = this.props.bidPercentage / 100;
            resData.increment_percentage = percentage.toFixed(18);
        }
        if (resData.start_time) {
            resData.start_time = moment.utc(this.props.startDate).format();
        }
        if (this.props.splitInfoStatus) {
            const array = [];
            this.props.splitInfo.map((val) => {
                const obj = {};
                obj.address = val.address;
                obj.weight = val.weight / 100;
                obj.weight = obj.weight.toFixed(18);
                if (val.address === '' || val.weight === '') {
                    return null;
                }

                array.push(obj);
                return null;
            });

            if (array && array.length) {
                resData.split_shares = array;
            } else {
                resData.split_shares = null;
            }
        } else {
            resData.split_shares = null;
        }

        const Tx = {
            msgs: [{
                type: 'OmniFlix/marketplace/MsgCreateAuction',
                value: resData,
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

        this.props.aminoSignTx(Tx, this.props.address, (result) => {
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
                this.props.txSignAndBroadCastAminoSign(data, (res1) => {
                    this.handleAuctionHash(data, res1, path, nftID);
                });
            }
        });
    }

    handleAuctionWalletConnect (resData, path, nftID) {
        let balance = this.props.balance && this.props.balance.length && this.props.balance.find((val) => val.denom === config.COIN_MINIMAL_DENOM);
        balance = balance && balance.amount && balance.amount / (10 ** config.COIN_DECIMALS);

        const type = customTypes && customTypes.CreateAuction && customTypes.CreateAuction.typeUrl;
        const granterInfo = {};
        if (this.props.allowances && this.props.allowances.length) {
            this.props.allowances.map((val) => {
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

        if (resData.duration) {
            let duration = moment(this.props.endDate).diff(this.props.startDate, 'seconds');
            duration = duration * (10 ** 9);
            duration = noExponent(duration);
            resData.duration = duration;
        }
        if (resData.increment_percentage) {
            const percentage = this.props.bidPercentage / 100;
            resData.increment_percentage = percentage.toFixed(18);
        }
        if (resData.start_time) {
            resData.start_time = moment.utc(this.props.startDate).format();
        }
        if (this.props.splitInfoStatus) {
            const array = [];
            this.props.splitInfo.map((val) => {
                const obj = {};
                obj.address = val.address;
                obj.weight = val.weight / 100;
                obj.weight = obj.weight.toFixed(18);
                if (val.address === '' || val.weight === '') {
                    return null;
                }

                array.push(obj);
                return null;
            });

            if (array && array.length) {
                resData.split_shares = array;
            } else {
                resData.split_shares = null;
            }
        }

        const Tx = {
            msgs: [{
                type: 'OmniFlix/marketplace/MsgCreateAuction',
                value: resData,
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

        this.props.gasEstimation(Tx, this.props.keys && this.props.keys.pubKey,
            this.props.address, null, 'CreateAuction', (result) => {
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

                this.props.walletConnectSign(this.props.walletConnector, Tx, this.props.address, (result) => {
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
                        this.props.txSignAndBroadCastAminoSign(data, (res1) => {
                            this.handleAuctionHash(data, res1, path, nftID);
                        });
                    }
                });
            });
    }

    handleCreateAuction () {
        let price = null;
        if (this.props.sellTokenValue && (this.props.sellTokenValue.value === 'uflix')) {
            price = {
                denom: this.props.sellTokenValue && this.props.sellTokenValue.value,
                amount: String(this.props.sellTokenPrice * (10 ** config.COIN_DECIMALS)),
            };
        } else {
            const decimals = this.props.sellTokenValue && this.props.sellTokenValue.network && this.props.sellTokenValue.network.decimals;
            const denom = this.props.sellTokenValue && this.props.sellTokenValue.ibc_denom_hash;
            price = {
                denom: denom,
                amount: String(this.props.sellTokenPrice * (10 ** decimals)),
            };
        }

        const path = this.props.location.pathname && this.props.location.pathname.split('/')[1];

        let percentage = this.props.bidPercentage / 100;
        percentage = (10 ** 18) * percentage;
        percentage = String(percentage);

        const nftID = this.props.value && this.props.value.nftDetails && this.props.value.nftDetails.id;
        const data = {
            owner: this.props.value && this.props.value.nftDetails && this.props.value.nftDetails.owner,
            denom_id: this.props.value && this.props.value.nftDetails && this.props.value.nftDetails.denom_id &&
                this.props.value.nftDetails.denom_id.id,
            nft_id: this.props.value && this.props.value.nftDetails && this.props.value.nftDetails.id,
            start_price: price,
            split_shares: [],
            start_time: new Date(this.props.startDate).toUTCString(),
            increment_percentage: percentage,
        };

        if (this.props.endDate) {
            data.duration = {
                seconds: moment(this.props.endDate).diff(this.props.startDate, 'seconds'),
            };
        }
        if (this.props.whiteListSwitch && this.props.whiteListValue) {
            data.whitelist_accounts = this.props.whiteListValue;
        }

        let valid = true;
        if (this.props.splitInfoStatus) {
            const array = [];
            this.props.splitInfo.map((val) => {
                const obj = {};
                obj.address = val.address;
                obj.weight = val.weight / 100;
                obj.weight = (10 ** 18) * obj.weight;
                obj.weight = String(obj.weight);
                if (val.address === '' || val.weight === '') {
                    return null;
                } else if (val.address !== '') {
                    const validity = val.address && decodeFromBech32(val.address) && (val.address.indexOf(config.PREFIX) > -1);
                    if (!validity && valid) {
                        valid = false;
                    }
                }

                array.push(obj);
                return null;
            });

            if (array && array.length) {
                data.split_shares = array;
            }
        }

        if (!valid) {
            this.props.showMessage(variables[this.props.lang]['invalid_address'], 'warning');

            return;
        }

        if (this.props.walletConnector && this.props.walletConnector._connected) {
            this.handleAuctionWalletConnect(data, path, nftID);

            return;
        }

        if (this.props.keys && this.props.keys.isNanoLedger) {
            this.handleAuctionLedgerTransaction(data, path, nftID);

            return;
        }

        let balance = this.props.balance && this.props.balance.length && this.props.balance.find((val) => val.denom === config.COIN_MINIMAL_DENOM);
        balance = balance && balance.amount && balance.amount / (10 ** config.COIN_DECIMALS);

        const Tx = {
            msgs: [{
                type: customTypes && customTypes.CreateAuction && customTypes.CreateAuction.typeUrl,
                value: data,
            }],
            msgType: 'CreateAuction',
            fee: {
                amount: [{
                    amount: String(5000),
                    denom: config.COIN_MINIMAL_DENOM,
                }],
                gasLimit: String(200000),
            },
            memo: '',
        };

        const type = customTypes && customTypes.CreateAuction && customTypes.CreateAuction.typeUrl;
        const granterInfo = {};
        if (this.props.allowances && this.props.allowances.length) {
            this.props.allowances.map((val) => {
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

        this.props.sign(Tx, this.props.address, (result, txBytes) => {
            if (result) {
                const txData = {
                    tx_bytes: txBytes,
                    mode: 'BROADCAST_MODE_SYNC',
                };
                this.props.txSignAndBroadCast(txData, (res1) => {
                    this.handleAuctionHash(data, res1, path, nftID);
                });
            }
        });
    }

    handleAuctionHash (data, res1, path, nftID) {
        if (res1 && res1.txhash) {
            this.setState({
                hash: res1.txhash,
            });
            let counter = 0;
            const time = setInterval(() => {
                this.props.fetchTxHash(res1.txhash, (hashResult) => {
                    if (hashResult) {
                        if (hashResult && hashResult.code !== undefined && hashResult.code !== 0) {
                            this.props.showMessage(hashResult.logs || hashResult.raw_log, 'error', hashResult && hashResult.hash);
                            this.setState({
                                failed: true,
                            });
                            this.props.setTxHashInProgressFalse();
                            clearInterval(time);

                            return;
                        }

                        this.props.fetchBalance(this.props.address);
                        this.setState({
                            success: true,
                            list: data,
                        });
                        if ((path === 'account') &&
                            this.props.match && this.props.match.params && this.props.match.params.address) {
                            this.props.fetchUserCollections(this.props.match.params.address, DEFAULT_SKIP, this.props.collectionsSkip + DEFAULT_LIMIT);
                            this.props.fetchUserNFTs(this.props.match.params.address, DEFAULT_SKIP, this.props.nftSSkip + DEFAULT_LIMIT);
                        } else if ((path === 'collection') &&
                            this.props.match && this.props.match.params && this.props.match.params.id) {
                            this.props.fetchNonListedCollectionNFTs(this.props.match.params.id, DEFAULT_SKIP, this.props.nonListedNFTsSkip + DEFAULT_LIMIT, null, (result, total) => {
                                if (total === this.props.nonListedNFTsTotal) {
                                    setTimeout(() => {
                                        this.props.fetchCollectionMyNFTs(this.props.match.params.id, this.props.address, DEFAULT_SKIP, DEFAULT_LIMIT);
                                        this.props.fetchNonListedCollectionNFTs(this.props.match.params.id, DEFAULT_SKIP, this.props.nonListedNFTsSkip + DEFAULT_LIMIT);
                                        this.props.fetchCollectionAuctions(this.props.match.params.id, DEFAULT_SKIP, DEFAULT_LIMIT);
                                    }, TRANSACTION_SET_TIME_OUT);
                                } else {
                                    this.props.fetchCollectionMyNFTs(this.props.match.params.id, this.props.address, DEFAULT_SKIP, DEFAULT_LIMIT);
                                    this.props.fetchCollectionAuctions(this.props.match.params.id, DEFAULT_SKIP, DEFAULT_LIMIT);
                                }
                            });
                        } else if ((path === 'nft') &&
                            this.props.match && this.props.match.params && this.props.match.params.nftID) {
                            this.props.fetchNFT(this.props.match.params.nftID, (result) => {
                                if (result && !result.auction) {
                                    setTimeout(() => {
                                        this.props.fetchNFT(this.props.match.params.nftID, (result) => {
                                            this.setState({
                                                list: result,
                                            });
                                        });
                                    }, TRANSACTION_SET_TIME_OUT);
                                } else {
                                    this.setState({
                                        list: result,
                                    });
                                }
                            });
                        }
                        if (nftID) {
                            this.props.fetchNFT(nftID, (result) => {
                                if (result && !result.auction) {
                                    setTimeout(() => {
                                        this.props.fetchNFT(nftID, (result) => {
                                            this.setState({
                                                list: result,
                                            });
                                        });
                                    }, TRANSACTION_SET_TIME_OUT);
                                } else {
                                    this.setState({
                                        list: result,
                                    });
                                }
                            });
                        }
                        this.props.fetchAuctionsListings(DEFAULT_SKIP, this.props.auctionListingsSkip + DEFAULT_LIMIT, null, null, null, null, null, null, null, null, (result, total) => {
                            if (total === this.props.auctionListingsTotal) {
                                setTimeout(() => {
                                    this.props.fetchAuctionsListings(DEFAULT_SKIP, this.props.auctionListingsSkip + DEFAULT_LIMIT);
                                    this.props.fetchStats();
                                }, TRANSACTION_SET_TIME_OUT);
                            } else {
                                this.props.fetchStats();
                            }
                        });
                        this.props.setTxHashInProgressFalse();
                        clearInterval(time);
                    }

                    counter++;
                    if (counter === 3) {
                        if (hashResult && hashResult.code !== undefined && hashResult.code !== 0) {
                            this.props.showMessage(hashResult.logs || hashResult.raw_log, 'error', hashResult && hashResult.hash);
                            this.setState({
                                failed: true,
                            });
                            this.props.setTxHashInProgressFalse();
                            clearInterval(time);

                            return;
                        }

                        this.props.showMessage(variables[this.props.lang]['check_later']);
                        this.props.handleClose();
                        this.props.setTxHashInProgressFalse();
                        clearInterval(time);
                    }
                });
            }, 5000);
        }
    }

    render () {
        const inProgress = this.props.inProgress || this.props.signInProgress;
        const broadCastInProgress = this.props.broadCastInProgress || this.props.aminoBroadCastInProgress || this.props.txHashInProgress;

        let disable = this.props.sellTokenPrice === '' || Number(this.props.sellTokenPrice) < 0 ||
            Number(this.props.sellTokenPrice) === 0 || !(this.props.sellTokenValue &&
                (this.props.sellTokenValue.value || this.props.sellTokenValue.ibc_denom_hash)) || inProgress || broadCastInProgress;

        if (this.props.tabValue === 'timed-auction') {
            disable = disable || this.props.bidPercentage === '' || !this.props.startDate;
        }

        const data = {
            info: this.props.value && this.props.value.nftDetails,
            splitInfo: this.props.splitInfo,
            splitInfoStatus: this.props.splitInfoStatus,
        };
        const totalSale = {
            tokenPrice: this.props.sellTokenPrice,
            tokenValue: this.props.sellTokenValue,
            details: this.props.value && this.props.value.nftDetails,
            splitInfo: this.props.splitInfo,
        };

        return (
            <Dialog
                disableEnforceFocus
                aria-describedby="preview-dialog-description"
                aria-labelledby="preview-dialog-title"
                className="dialog listing_dialog"
                open={this.props.open}
                onClose={this.handleClose}>
                {this.state.failed
                    ? <DialogContent className="success_dialog_content success_dialog">
                        <img alt="" src={failIcon}/>
                        <h2 className="title">{variables[this.props.lang]['asset_not_listed']}</h2>
                        <Info value={this.props.value}/>
                        <div className="transfer_action">
                            <Button
                                className="transfer_confirm"
                                variant="contained"
                                onClick={this.handleClose}>
                                {variables[this.props.lang]['close_window']}
                            </Button>
                        </div>
                    </DialogContent>
                    : this.state.success
                        ? <DialogContent className="success_dialog_content success_dialog scroll_bar">
                            <img alt="" src={successIcon}/>
                            <h2 className="title">{variables[this.props.lang]['asset_listed_successfully']}</h2>
                            <span>{variables[this.props.lang]['transaction_hash']}</span>
                            <div className="tx_hash">
                                <div
                                    onClick={() => window.open(`${EXPLORER_URL + '/transactions/' + this.state.hash}`)}>{this.state.hash}</div>
                                <CopyButton data={EXPLORER_URL + '/transactions/' + this.state.hash}/>
                            </div>
                            <Info info={this.state.list} value={this.props.value}/>
                            <div className="transfer_action">
                                <Button
                                    className="transfer_cancel"
                                    onClick={() => this.handleDeList()}>
                                    {variables[this.props.lang]['cancel_listing']}
                                </Button>
                                <Button
                                    className="transfer_confirm"
                                    variant="contained"
                                    onClick={this.handleClose}>
                                    {variables[this.props.lang]['close_window']}
                                </Button>
                            </div>
                        </DialogContent>
                        : this.props.confirmList
                            ? <ConfirmListingDialog
                                broadCastInProgress={broadCastInProgress} disable={disable}
                                handleCreateAuction={this.handleCreateAuction}
                                handleSuccess={this.handleSuccess}
                                inProgress={inProgress}/>
                            : <DialogContent className="dialog_content scroll_bar">
                                <h2 className="title">{variables[this.props.lang].list}&nbsp;
                                    &ldquo;{this.props.value && this.props.value.nftDetails &&
                                        this.props.value.nftDetails.name}&rdquo;</h2>
                                <div className="row">
                                    <div className="label_info">
                                        <p className="title">
                                            {variables[this.props.lang]['listing_type']}
                                            <Tooltip title={variables[this.props.lang]['helper_text']}>
                                                <img
                                                    alt="info"
                                                    className="info_tooltip"
                                                    src={InfoIcon}/>
                                            </Tooltip>
                                        </p>
                                    </div>
                                    <ListingTabs handleChange={this.handleChange} tabValue={this.props.tabValue}/>
                                </div>
                                {this.props.tabValue === 'fixed-price'
                                    ? <div className="row">
                                        <div className="label_info">
                                            <p className="title">
                                                {variables[this.props.lang]['listing_price']}
                                                <Tooltip title={variables[this.props.lang]['helper_text']}>
                                                    <img
                                                        alt="info"
                                                        className="info_tooltip"
                                                        src={InfoIcon}/>
                                                </Tooltip>
                                            </p>
                                        </div>
                                        <ChoosePrice/>
                                    </div>
                                    : <div className="min_bid_section">
                                        <div className="row">
                                            <div className="label_info">
                                                <p className="title">
                                                    {variables[this.props.lang]['min_bid_price']}
                                                    <Tooltip title={variables[this.props.lang]['helper_text']}>
                                                        <img
                                                            alt="info"
                                                            className="info_tooltip"
                                                            src={InfoIcon}/>
                                                    </Tooltip>
                                                </p>
                                            </div>
                                            <MinBidPrice/>
                                        </div>
                                        <div className="row bid_field">
                                            <div className="label_info">
                                                <p className="title">
                                                    {variables[this.props.lang]['bid_increment_per']}
                                                    <Tooltip title={variables[this.props.lang]['helper_text']}>
                                                        <img
                                                            alt="info"
                                                            className="info_tooltip"
                                                            src={InfoIcon}/>
                                                    </Tooltip>
                                                </p>
                                            </div>
                                            <BidPercentageTextField/>
                                        </div>
                                    </div>}
                                {this.props.tabValue === 'timed-auction' &&
                                    <div className="date_section">
                                        <div className="row">
                                            <div className="label_info">
                                                <p className="title">
                                                    {variables[this.props.lang]['auction_start_time']}
                                                    <Tooltip title={variables[this.props.lang]['helper_text']}>
                                                        <img
                                                            alt="info"
                                                            className="info_tooltip"
                                                            src={InfoIcon}/>
                                                    </Tooltip>
                                                </p>
                                            </div>
                                            <StartDateTextField/>
                                        </div>
                                        <div className="row">
                                            <div className="label_info">
                                                <p className="title">
                                                    {variables[this.props.lang]['auction_end_time']}
                                                    {' ('}{variables[this.props.lang].optional}{')'}
                                                    <Tooltip title={variables[this.props.lang]['helper_text']}>
                                                        <img
                                                            alt="info"
                                                            className="info_tooltip"
                                                            src={InfoIcon}/>
                                                    </Tooltip>
                                                </p>
                                            </div>
                                            <EndDateTextField/>
                                        </div>
                                    </div>}
                                <div className="row split_info">
                                    <div className="label_info">
                                        <p className="title">
                                            {variables[this.props.lang]['split_info']}
                                            <Tooltip title={variables[this.props.lang]['helper_text']}>
                                                <img
                                                    alt="info"
                                                    className="info_tooltip"
                                                    src={InfoIcon}/>
                                            </Tooltip>
                                        </p>
                                        <p className="title_info">{variables[this.props.lang]['split_info_info']}</p>
                                    </div>
                                    <SplitInfoSwitch/>
                                </div>
                                {this.props.splitInfoStatus &&
                                    <SplitInfo details={this.props.value}/>}
                                {this.props.tabValue === 'timed-auction' &&
                                    <div className="row split_info white_list_content">
                                        <div className="label_info">
                                            <p className="title">
                                                {variables[this.props.lang].whitelist}
                                                <Tooltip title={variables[this.props.lang]['helper_text']}>
                                                    <img
                                                        alt="info"
                                                        className="info_tooltip"
                                                        src={InfoIcon}/>
                                                </Tooltip></p>
                                        </div>
                                        <WhiteListSwitch/>
                                    </div>}
                                {(this.props.tabValue === 'timed-auction') && this.props.whiteListSwitch &&
                                    <WhiteListTags/>}
                                <TotalSale totalSale={totalSale}/>
                                <div className="transfer_action">
                                    <Button className="transfer_cancel" onClick={this.handleClose}>
                                        {variables[this.props.lang].cancel}
                                    </Button>
                                    <Button
                                        className="transfer_confirm"
                                        disabled={disable}
                                        variant="contained"
                                        onClick={() => this.props.setConfirmListing(true, data)}>
                                        {this.props.tabValue === 'timed-auction'
                                            ? variables[this.props.lang]['create_auction']
                                            : variables[this.props.lang]['create_listing']}
                                    </Button>
                                </div>
                            </DialogContent>}
            </Dialog>
        );
    }
}

ListDialog.propTypes = {
    address: PropTypes.string.isRequired,
    allowances: PropTypes.array.isRequired,
    aminoBroadCastInProgress: PropTypes.bool.isRequired,
    aminoSignTx: PropTypes.func.isRequired,
    balance: PropTypes.array.isRequired,
    bidPercentage: PropTypes.string.isRequired,
    broadCastInProgress: PropTypes.bool.isRequired,
    collectionsSkip: PropTypes.number.isRequired,
    confirmList: PropTypes.bool.isRequired,
    fetchAuctionsListings: PropTypes.func.isRequired,
    fetchBalance: PropTypes.func.isRequired,
    fetchCollectionAuctions: PropTypes.func.isRequired,
    fetchCollectionMyNFTs: PropTypes.func.isRequired,
    fetchListedCollectionNFTs: PropTypes.func.isRequired,
    fetchNFT: PropTypes.func.isRequired,
    fetchNonListedCollectionNFTs: PropTypes.func.isRequired,
    fetchStats: PropTypes.func.isRequired,
    fetchTxHash: PropTypes.func.isRequired,
    fetchUserCollections: PropTypes.func.isRequired,
    fetchUserNFTs: PropTypes.func.isRequired,
    gasEstimation: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
    inProgress: PropTypes.bool.isRequired,
    keys: PropTypes.object.isRequired,
    lang: PropTypes.string.isRequired,
    listNFT: PropTypes.func.isRequired,
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
    }).isRequired,
    nftSSkip: PropTypes.number.isRequired,
    open: PropTypes.bool.isRequired,
    sellTokenPrice: PropTypes.string.isRequired,
    setConfirmListing: PropTypes.func.isRequired,
    setListType: PropTypes.func.isRequired,
    setTxHashInProgressFalse: PropTypes.func.isRequired,
    showDelistDialog: PropTypes.func.isRequired,
    showMessage: PropTypes.func.isRequired,
    sign: PropTypes.func.isRequired,
    signInProgress: PropTypes.bool.isRequired,
    splitInfo: PropTypes.array.isRequired,
    splitInfoStatus: PropTypes.bool.isRequired,
    tabValue: PropTypes.string.isRequired,
    txHashInProgress: PropTypes.bool.isRequired,
    txSignAndBroadCast: PropTypes.func.isRequired,
    txSignAndBroadCastAminoSign: PropTypes.func.isRequired,
    value: PropTypes.object.isRequired,
    walletConnectSign: PropTypes.func.isRequired,
    whiteListSwitch: PropTypes.bool.isRequired,
    whiteListValue: PropTypes.array.isRequired,
    auctionListingsSkip: PropTypes.number,
    auctionListingsTotal: PropTypes.number,
    endDate: PropTypes.string,
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
    sellTokenValue: PropTypes.object,
    startDate: PropTypes.string,
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
        bidPercentage: state.marketplace.bidPercentage,
        broadCastInProgress: state.account.wallet.broadCast.inProgress,
        endDate: state.marketplace.endDate,
        inProgress: state.marketplace.newListNFT.inProgress,
        keys: state.account.wallet.connection.keys,
        open: state.marketplace.sellDialog.open,
        value: state.marketplace.sellDialog.value,
        signInProgress: state.account.bc.signTx.inProgress,
        sellTokenValue: state.marketplace.sellTokenValue.value,
        sellTokenPrice: state.marketplace.sellTokenPrice,
        splitInfo: state.marketplace.splitInfo.value,
        splitInfoStatus: state.marketplace.splitInfo.status,
        startDate: state.marketplace.startDate,
        lang: state.language,
        txHashInProgress: state.account.bc.txHash.inProgress,
        collectionsSkip: state.myAccount.userCollections.skip,
        nftSSkip: state.myAccount.userNFTs.skip,
        nonListedNFTsTotal: state.collection.nonListedCollectionNFTs.total,
        nonListedNFTsSkip: state.collection.nonListedCollectionNFTs.skip,

        confirmList: state.marketplace.confirmListing.open,
        whiteListSwitch: state.marketplace.whiteListSwitch,
        whiteListValue: state.marketplace.whiteListValue,
        tabValue: state.marketplace.listType,
        walletConnector: state.account.wallet.connection.walletConnector,
    };
};

const actionToProps = {
    aminoSignTx,
    fetchAuctionsListings,
    fetchBalance,
    fetchCollectionAuctions,
    fetchCollectionMyNFTs,
    fetchTxHash,
    fetchUserCollections,
    fetchUserNFTs,
    fetchListedCollectionNFTs,
    fetchNFT,
    fetchNonListedCollectionNFTs,
    fetchStats,
    gasEstimation,
    handleClose: hideSellDialog,
    listNFT,
    showMessage,
    sign: protoBufSigning,
    setTxHashInProgressFalse,
    txSignAndBroadCast,
    txSignAndBroadCastAminoSign,
    showDelistDialog,
    setConfirmListing,
    setListType,
    walletConnectSign,
};

export default withRouter(connect(stateToProps, actionToProps)(ListDialog));
