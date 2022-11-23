import React, { Component } from 'react';
import { Button, Dialog } from '@material-ui/core';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchNFT, hideTransferDialog, setConfirmTransfer } from '../../../../actions/marketplace';
import variables from '../../../../utils/variables';
import ReciepentAddressTextField from './ReciepentAddressTextField';
import CopyButton from '../../../../components/CopyButton';
import successIcon from '../../../../assets/collections/success.svg';
import failedIcon from '../../../../assets/collections/failed.svg';
import { config, DEFAULT_LIMIT, DEFAULT_SKIP, EXPLORER_URL, TRANSACTION_SET_TIME_OUT } from '../../../../config';
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
import { fetchBalance } from '../../../../actions/account/BCDetails';
import CircularProgress from '../../../../components/CircularProgress';
import { withRouter } from 'react-router';
import { fetchUserCollections, fetchUserNFTs, transferNFT } from '../../../../actions/myAccount';
import { showMessage } from '../../../../actions/snackbar';
import { decodeFromBech32 } from '../../../../utils/address';
import ImageOnLoad from '../../../../components/ImageOnLoad';
import { customTypes } from '../../../../registry';
import { getAssetType, getAssetTypeExtension } from '../../../../utils/strings';
import thumbnail from '../../../../assets/collections/thumbnail.svg';
import {
    fetchCollectionMyNFTs,
    fetchListedCollectionNFTs,
    fetchNonListedCollectionNFTs,
} from '../../../../actions/collections';

class TransferDialog extends Component {
    constructor (props) {
        super(props);

        this.state = {
            failed: false,
            success: false,
            hash: '',
        };

        this.handleTransfer = this.handleTransfer.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleLedgerTransaction = this.handleLedgerTransaction.bind(this);
        this.handleHash = this.handleHash.bind(this);
        this.handleWalletConnect = this.handleWalletConnect.bind(this);
    }

    handleLedgerTransaction (data, msg, granterInfo, balance, path) {
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
                    this.handleHash(res1, path);
                });
            }
        });
    }

    handleWalletConnect (data, msg, granterInfo, balance, path) {
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

        this.props.gasEstimation(Tx, this.props.keys && this.props.keys.pubKey,
            this.props.address, null, 'TransferONFT', (result) => {
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
                            this.handleHash(res1, path);
                        });
                    }
                });
            });
    }

    handleTransfer () {
        const nft = this.props.value && this.props.value.nftDetails;
        const denom = this.props.value && this.props.value.nftDetails && this.props.value.nftDetails.denom_id;
        const path = this.props.location.pathname && this.props.location.pathname.split('/')[1];

        if (nft && denom && denom.id && nft.id) {
            const data = {
                base_req: {
                    from: this.props.address,
                    memo: '',
                    chain_id: config.CHAIN_ID,
                },
                sender: this.props.address,
                recipient: this.props.recipientAddress,
            };

            let valid = true;
            if (this.props.recipientAddress !== '') {
                valid = this.props.recipientAddress && decodeFromBech32(this.props.recipientAddress) && (this.props.recipientAddress.indexOf(config.PREFIX) > -1);
            }
            if (!valid) {
                this.props.showMessage(variables[this.props.lang]['invalid_address'], 'warning');

                return;
            }

            this.props.transferNFT(data, denom.id, nft.id, (res) => {
                if (res) {
                    let balance = this.props.balance && this.props.balance.length && this.props.balance.find((val) => val.denom === config.COIN_MINIMAL_DENOM);
                    balance = balance && balance.amount && balance.amount / (10 ** config.COIN_DECIMALS);

                    const Tx = {
                        msgs: res.value && res.value.msg,
                        msgType: 'TransferONFT',
                        fee: {
                            amount: [{
                                amount: String(5000),
                                denom: config.COIN_MINIMAL_DENOM,
                            }],
                            gasLimit: String(200000),
                        },
                        memo: '',
                    };

                    const type = customTypes && customTypes.TransferONFT && customTypes.TransferONFT.typeUrl;
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

                    if (this.props.walletConnector && this.props.walletConnector._connected) {
                        this.handleWalletConnect(Tx, res.value && res.value.msg, granterInfo, balance, path);

                        return;
                    }

                    if (this.props.keys && this.props.keys.isNanoLedger) {
                        this.handleLedgerTransaction(Tx, res.value && res.value.msg, granterInfo, balance, path);

                        return;
                    }

                    this.props.sign(Tx, this.props.address, (result, txBytes) => {
                        if (result) {
                            const data = {
                                tx_bytes: txBytes,
                                mode: 'BROADCAST_MODE_SYNC',
                            };
                            this.props.txSignAndBroadCast(data, (res1) => {
                                this.handleHash(res1, path);
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
    }

    handleHash (res1, path) {
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
                            this.props.setTxHashInProgressFalse();
                            clearInterval(time);

                            return;
                        }

                        this.props.fetchBalance(this.props.address);
                        this.props.setTxHashInProgressFalse();
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
                                if (result && result.owner && (result.owner === this.props.address)) {
                                    setTimeout(() => {
                                        this.props.fetchNFT(this.props.match.params.nftID);
                                    }, TRANSACTION_SET_TIME_OUT);
                                }
                            });
                        }
                        this.setState({
                            success: true,
                        });
                        clearInterval(time);
                    }

                    counter++;
                    if (counter === 3) {
                        if (hashResult && hashResult.code !== undefined && hashResult.code !== 0) {
                            this.props.showMessage(hashResult.logs || hashResult.raw_log, 'error', hashResult && hashResult.hash);
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

    handleClose () {
        this.props.handleClose();
        this.setState({
            failed: false,
            success: false,
            hash: '',
        });
    }

    handleClick () {
        let valid = true;
        if (this.props.recipientAddress !== '') {
            valid = this.props.recipientAddress && decodeFromBech32(this.props.recipientAddress) && (this.props.recipientAddress.indexOf(config.PREFIX) > -1);
        }
        if (!valid) {
            this.props.showMessage(variables[this.props.lang]['invalid_address'], 'warning');

            return;
        }

        this.props.setConfirmTransfer(true);
    }

    render () {
        const nftDetails = this.props.value && this.props.value.nftDetails;
        const collectionDetails = this.props.value && this.props.value.collectionDetails;

        const hash = this.state.hash;
        const inProgress = this.props.inProgress || this.props.signInProgress;
        const broadCastInProgress = this.props.broadCastInProgress || this.props.aminoBroadCastInProgress || this.props.txHashInProgress;
        const disable = this.props.recipientAddress === '' || inProgress || broadCastInProgress;

        let royalty = nftDetails && nftDetails.royalty_share && Number(nftDetails.royalty_share);
        royalty = royalty * 100;
        const collection = nftDetails && nftDetails.denom_id && nftDetails.denom_id.id
            ? nftDetails.denom_id
            : collectionDetails;

        let data = {};
        if (nftDetails && nftDetails.data) {
            try {
                data = JSON.parse(nftDetails.data);
            } catch (e) {
                data = {};
            }
        }

        let schema = {};
        if (data && data.schema) {
            schema = data.schema;
        } else if (data && Object.keys(data).length) {
            Object.keys(data).filter((key) => {
                schema[key] = data[key];

                return null;
            });
        }
        const mediaType = nftDetails && nftDetails.media_type;

        return (
            <Dialog
                aria-describedby="verify-twitter-dialog-description"
                aria-labelledby="verify-twitter-dialog-title"
                className="dialog transfer_dialog"
                open={this.props.open}
                onClose={this.handleClose}>
                <div className="transfer_dialog_content">
                    {(inProgress || broadCastInProgress) && <CircularProgress className="full_screen"/>}
                    {this.state.success
                        ? <div className="transfer_dialog_data success_dialog">
                            <img alt="" src={successIcon}/>
                            <h2>{variables[this.props.lang]['asset_transfer_success']}</h2>
                            <span>{variables[this.props.lang]['transaction_hash']}</span>
                            <div className="tx_hash">
                                <div onClick={() => window.open(`${EXPLORER_URL + '/transactions/' + hash}`)}>{hash}</div>
                                <CopyButton data={EXPLORER_URL + '/transactions/' + hash}/>
                            </div>
                            <Button onClick={this.handleClose}>
                                {variables[this.props.lang]['close_window']}
                            </Button>
                        </div>
                        : this.state.failed
                            ? <div className="transfer_dialog_data success_dialog">
                                <img alt="" src={failedIcon}/>
                                <h2>{variables[this.props.lang]['asset_transfer_fail']}</h2>
                                <Button onClick={this.handleClose}>
                                    {variables[this.props.lang]['close_window']}
                                </Button>
                            </div>
                            : this.props.confirmTransfer
                                ? <div className="confirm_transfer_dialog_content">
                                    <h2 className="title">{variables[this.props.lang]['transfer_nft_confirmation']}</h2>
                                    <div className="ledger_note">
                                        <p>{variables[this.props.lang]['ledger_note']}</p>
                                    </div>
                                    <div className="row1">
                                        <div className="left_section">
                                            {mediaType && nftDetails &&
                                            getAssetType(mediaType) === 'image' && getAssetTypeExtension(mediaType) === 'gif'
                                                ? <ImageOnLoad
                                                    preview={nftDetails.preview_uri}
                                                    src={nftDetails.media_uri}
                                                    text={variables[this.props.lang]['asset_preview_not_ready']}/>
                                                : mediaType &&
                                                getAssetType(mediaType) === 'image' && nftDetails
                                                    ? <ImageOnLoad
                                                        cdn={nftDetails.cloudflare_cdn && nftDetails.cloudflare_cdn.variants}
                                                        preview={nftDetails.preview_uri}
                                                        src={nftDetails.media_uri}
                                                        text={variables[this.props.lang]['asset_preview_not_ready']}/>
                                                    : nftDetails
                                                        ? <ImageOnLoad
                                                            preview={nftDetails.preview_uri}
                                                            src={nftDetails.media_uri}
                                                            text={variables[this.props.lang]['asset_preview_not_ready']}/>
                                                        : <ImageOnLoad
                                                            src={thumbnail}
                                                            text={variables[this.props.lang]['asset_preview_not_ready']}/>}
                                            <div className="row">
                                                <span>
                                                    {collection && (collection.name || collection.symbol)}
                                                </span>
                                                <p>{nftDetails && nftDetails.name}</p>
                                            </div>
                                        </div>
                                        <div className="right_section">
                                            <div className="row">
                                                <span>{variables[this.props.lang].message_type}</span>
                                                <div
                                                    className="hash_text address"
                                                    title={customTypes.TransferONFT && customTypes.TransferONFT.typeUrl}>
                                                    <p className="name">{customTypes.TransferONFT && customTypes.TransferONFT.typeUrl}</p>
                                                    {customTypes.TransferONFT && customTypes.TransferONFT.typeUrl &&
                                                        customTypes.TransferONFT.typeUrl.slice(customTypes.TransferONFT.typeUrl.length - 20, customTypes.TransferONFT.typeUrl.length)}
                                                </div>
                                            </div>
                                            <div className="row">
                                                <span>{variables[this.props.lang].from}</span>
                                                <div className="hash_text address" title={this.props.address}>
                                                    <p className="name">{this.props.address}</p>
                                                    {this.props.address &&
                                                        this.props.address.slice(this.props.address.length - 6, this.props.address.length)}
                                                </div>
                                            </div>
                                            <div className="row">
                                                <span>{variables[this.props.lang].to}</span>
                                                <div className="hash_text address" title={this.props.recipientAddress}>
                                                    <p className="name">{this.props.recipientAddress}</p>
                                                    {this.props.recipientAddress &&
                                                        this.props.recipientAddress.slice(this.props.recipientAddress.length - 6, this.props.recipientAddress.length)}
                                                </div>
                                            </div>
                                            <div className="row">
                                                <span>{variables[this.props.lang].denom_symbol}</span>
                                                <p>{collection && (collection.symbol || collection.name)}</p>
                                            </div>
                                            <div className="row">
                                                <span>{variables[this.props.lang].nft_image_url}</span>
                                                <p className="url_css">  {nftDetails && nftDetails.media_uri} </p>
                                            </div>
                                            {royalty > 0 &&
                                                <div className="row">
                                                    <span>{variables[this.props.lang].royalties}</span>
                                                    <p> {royalty}%</p>
                                                </div>}
                                            {nftDetails && nftDetails.nsfw &&
                                                <div className="row">
                                                    <span>{variables[this.props.lang].nsfw}</span>
                                                    <p>True</p>
                                                </div>}
                                            <div className="row">
                                                <span>{variables[this.props.lang].transferability}</span>
                                                <p>{nftDetails && nftDetails.transferable
                                                    ? 'True'
                                                    : 'False'}</p>
                                            </div>
                                            {nftDetails && nftDetails.extensible &&
                                                <div className="row">
                                                    <span>{variables[this.props.lang].extensibility}</span>
                                                    <p>True</p>
                                                </div>}
                                            <div className="row">
                                                <span>{variables[this.props.lang].schema}</span>
                                                <p>{schema && Object.keys(schema).length
                                                    ? 'True'
                                                    : 'False'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="confirm_action transfer_action">
                                        <Button
                                            className="cancel_button"
                                            onClick={this.props.handleClose}>
                                            {variables[this.props.lang].cancel}
                                        </Button>
                                        <Button
                                            className="transfer_confirm"
                                            disabled={disable}
                                            onClick={this.handleTransfer}>
                                            {broadCastInProgress
                                                ? variables[this.props.lang].processing + '...'
                                                : inProgress
                                                    ? variables[this.props.lang]['approval_pending'] + '....'
                                                    : variables[this.props.lang].confirm_transfer}
                                        </Button>
                                    </div>
                                </div>
                                : <div className="transfer_dialog_data">
                                    <h2> {variables[this.props.lang].transfer}&nbsp;
                                        &ldquo;{this.props.value && this.props.value.nftDetails && this.props.value.nftDetails.name}&rdquo; to </h2>
                                    <ReciepentAddressTextField/>
                                    <div className="transfer_action">
                                        <Button className="transfer_cancel" onClick={this.handleClose}>
                                            {variables[this.props.lang].cancel}
                                        </Button>
                                        <Button
                                            className="transfer_confirm"
                                            disabled={disable}
                                            onClick={this.handleClick}>
                                            {variables[this.props.lang].confirm}
                                        </Button>
                                    </div>
                                </div>}
                </div>
            </Dialog>
        );
    }
}

TransferDialog.propTypes = {
    address: PropTypes.string.isRequired,
    allowances: PropTypes.array.isRequired,
    aminoBroadCastInProgress: PropTypes.bool.isRequired,
    aminoSignTx: PropTypes.func.isRequired,
    balance: PropTypes.array.isRequired,
    broadCastInProgress: PropTypes.bool.isRequired,
    collectionsSkip: PropTypes.number.isRequired,
    confirmTransfer: PropTypes.bool.isRequired,
    fetchBalance: PropTypes.func.isRequired,
    fetchCollectionMyNFTs: PropTypes.func.isRequired,
    fetchListedCollectionNFTs: PropTypes.func.isRequired,
    fetchNFT: PropTypes.func.isRequired,
    fetchNonListedCollectionNFTs: PropTypes.func.isRequired,
    fetchTxHash: PropTypes.func.isRequired,
    fetchUserCollections: PropTypes.func.isRequired,
    fetchUserNFTs: PropTypes.func.isRequired,
    gasEstimation: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
    inProgress: PropTypes.bool.isRequired,
    keys: PropTypes.object.isRequired,
    lang: PropTypes.string.isRequired,
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
    }).isRequired,
    nftSSkip: PropTypes.number.isRequired,
    open: PropTypes.bool.isRequired,
    recipientAddress: PropTypes.string.isRequired,
    setConfirmTransfer: PropTypes.func.isRequired,
    setTxHashInProgressFalse: PropTypes.func.isRequired,
    showMessage: PropTypes.func.isRequired,
    sign: PropTypes.func.isRequired,
    signInProgress: PropTypes.bool.isRequired,
    transferNFT: PropTypes.func.isRequired,
    txHashInProgress: PropTypes.bool.isRequired,
    txSignAndBroadCast: PropTypes.func.isRequired,
    txSignAndBroadCastAminoSign: PropTypes.func.isRequired,
    value: PropTypes.object.isRequired,
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
        allowances: state.account.bc.allowances.value,
        aminoBroadCastInProgress: state.account.wallet.connection.inProgress,
        balance: state.account.bc.balance.value,
        broadCastInProgress: state.account.wallet.broadCast.inProgress,
        inProgress: state.myAccount.nftTransfer.inProgress,
        keys: state.account.wallet.connection.keys,
        open: state.marketplace.transferDialog.open,
        value: state.marketplace.transferDialog.value,
        recipientAddress: state.marketplace.recipientAddress,
        lang: state.language,
        txHashInProgress: state.account.bc.txHash.inProgress,
        collectionsSkip: state.myAccount.userCollections.skip,
        nftSSkip: state.myAccount.userNFTs.skip,
        nonListedNFTsTotal: state.collection.nonListedCollectionNFTs.total,
        nonListedNFTsSkip: state.collection.nonListedCollectionNFTs.skip,
        signInProgress: state.account.bc.signTx.inProgress,

        confirmTransfer: state.marketplace.confirmTransfer.open,
        walletConnector: state.account.wallet.connection.walletConnector,
    };
};

const actionToProps = {
    aminoSignTx,
    fetchBalance,
    fetchCollectionMyNFTs,
    fetchTxHash,
    fetchUserCollections,
    fetchUserNFTs,
    fetchListedCollectionNFTs,
    fetchNFT,
    fetchNonListedCollectionNFTs,
    gasEstimation,
    handleClose: hideTransferDialog,
    showMessage,
    sign: protoBufSigning,
    setTxHashInProgressFalse,
    txSignAndBroadCast,
    txSignAndBroadCastAminoSign,
    transferNFT,
    setConfirmTransfer,
    walletConnectSign,
};

export default withRouter(connect(stateToProps, actionToProps)(TransferDialog));
