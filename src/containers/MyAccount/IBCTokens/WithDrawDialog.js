import React, { Component } from 'react';
import { Button, Dialog } from '@material-ui/core';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import variables from '../../../utils/variables';
import { fetchUserBalance, hideWithdrawDialog } from '../../../actions/myAccount';
import AmountValueTextField from './AmountValueTextField';
import arrowIcon from '../../../assets/explore/Vector.svg';
import {
    connectIBCAccount,
    fetchIBCBalance,
    fetchTimeoutHeight,
    walletConnectIBCAccount,
} from '../../../actions/account/IBCTokens';
import DotsLoading from '../../../components/DotsLoading';
import Long from 'long';
import { fetchBalance } from '../../../actions/account/BCDetails';
import { config } from '../../../config';
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
import { showMessage } from '../../../actions/snackbar';
import { setWithdrawConfirm } from '../../../actions/account';
import NetworkImages from '../../../components/NetworkImages';

class WithDrawDialog extends Component {
    constructor (props) {
        super(props);

        this.state = {
            config: {},
        };
    }

    componentDidUpdate (pp, ps, ss) {
        if ((pp.open !== this.props.open) && this.props.open) {
            const config = {
                RPC_URL: this.props.value && this.props.value.network && this.props.value.network.rpc_address,
                REST_URL: this.props.value && this.props.value.network && this.props.value.network.api_address,
                CHAIN_ID: this.props.value && this.props.value.network && this.props.value.network.chain_id,
                CHAIN_NAME: this.props.value && this.props.value.network && this.props.value.network.name,
                COIN_DENOM: this.props.value && this.props.value.network && this.props.value.network.display_denom,
                COIN_MINIMAL_DENOM: this.props.value && this.props.value.network && this.props.value.network.denom,
                COIN_DECIMALS: this.props.value && this.props.value.network && this.props.value.network.decimals,
                PREFIX: this.props.value && this.props.value.network && this.props.value.network.address_prefix,
            };

            this.setState({
                config: config,
            });
            this.initKeplr(config);
        }
    }

    initKeplr (config) {
        if (this.props.walletConnector && this.props.walletConnector._connected) {
            this.props.walletConnectIBCAccount(this.props.walletConnector, config, (address) => {
                this.props.fetchIBCBalance(config.REST_URL, address[0].bech32Address);
            });

            return;
        }

        this.props.connectIBCAccount(config, (address) => {
            this.props.fetchIBCBalance(config.REST_URL, address[0].address);
        });
    }

    handleWithdraw (decimals, denom) {
        this.props.fetchTimeoutHeight(this.state.config && this.state.config.REST_URL, this.props.value && this.props.value.destination_channel, (result) => {
            const revisionNumber = result && result.proof_height && result.proof_height.revision_number &&
                Long.fromNumber(result.proof_height.revision_number);
            const revisionHeight = result && result.proof_height && result.proof_height.revision_height;

            let balance = this.props.balance && this.props.balance.length && this.props.balance.find((val) => val.denom === config.COIN_MINIMAL_DENOM);
            balance = balance && balance.amount && balance.amount / (10 ** config.COIN_DECIMALS);

            const data = {
                msg: {
                    typeUrl: '/ibc.applications.transfer.v1.MsgTransfer',
                    value: {
                        source_port: 'transfer',
                        source_channel: this.props.value && this.props.value.channel,
                        token: {
                            denom: denom,
                            amount: String(this.props.amountValue * (10 ** decimals)),
                        },
                        sender: this.props.address,
                        receiver: this.props.ibcAddress,
                        timeout_height: {
                            revisionNumber: revisionNumber || undefined,
                            revisionHeight: Long.fromNumber(parseInt(revisionHeight) + 150) || undefined,
                        },
                        timeout_timestamp: undefined,
                    },
                },
                fee: {
                    amount: [{
                        amount: String(225000),
                        denom: config.COIN_MINIMAL_DENOM,
                    }],
                    gasLimit: String(450000),
                },
                memo: '',
            };

            const type = '/ibc.applications.transfer.v1.MsgTransfer';
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
                data.fee.granter = granterInfo.granter;
            }

            if (this.props.walletConnector && this.props.walletConnector._connected) {
                const Tx = {
                    msg: {
                        type: 'cosmos-sdk/MsgTransfer',
                        value: {
                            source_port: 'transfer',
                            source_channel: this.props.value && this.props.value.channel,
                            token: {
                                denom: denom,
                                amount: String(this.props.amountValue * (10 ** decimals)),
                            },
                            sender: this.props.address,
                            receiver: this.props.ibcAddress,
                            timeout_height: {
                                revision_height: String(revisionNumber) || undefined,
                                revision_number: String(Long.fromNumber(parseInt(revisionHeight) + 150)) || undefined,
                            },
                            timeout_timestamp: undefined,
                        },
                    },
                    fee: {
                        amount: [{
                            amount: String(0),
                            denom: config.COIN_MINIMAL_DENOM,
                        }],
                        gas: String(450000),
                    },
                    memo: '',
                };

                this.props.gasEstimation(Tx, this.props.keys && this.props.keys.pubKey,
                    this.props.address, null, null, (result) => {
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
                            let fee = 225000 * config.AVG_GAS_STEP;
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
                                    this.handleHash(res1);
                                });
                            }
                        });
                    });

                return;
            }

            if (this.props.keys && this.props.keys.isNanoLedger) {
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
                    msg: {
                        type: 'cosmos-sdk/MsgTransfer',
                        value: {
                            source_port: 'transfer',
                            source_channel: this.props.value && this.props.value.channel,
                            token: {
                                denom: denom,
                                amount: String(this.props.amountValue * (10 ** decimals)),
                            },
                            sender: this.props.address,
                            receiver: this.props.ibcAddress,
                            timeout_height: {
                                revision_height: String(revisionNumber) || undefined,
                                revision_number: String(Long.fromNumber(parseInt(revisionHeight) + 150)) || undefined,
                            },
                            timeout_timestamp: undefined,
                        },
                    },
                    fee: {
                        amount: [{
                            amount: String(225000),
                            denom: config.COIN_MINIMAL_DENOM,
                        }],
                        gas: String(450000),
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
                            this.handleHash(res1);
                        });
                    }
                });

                return;
            }

            this.props.sign(data, this.props.address, (result, txBytes) => {
                if (result) {
                    const txData = {
                        tx_bytes: txBytes,
                        mode: 'BROADCAST_MODE_SYNC',
                    };
                    this.props.txSignAndBroadCast(txData, (res1) => {
                        this.handleHash(res1);
                    });
                }
            });
        });
    }

    handleHash (res1) {
        if (res1 && res1.txhash) {
            let counter = 0;
            const time = setInterval(() => {
                this.props.fetchTxHash(res1.txhash, (hashResult) => {
                    if (hashResult) {
                        if (window.keplr) {
                            window.keplr.defaultOptions = {};
                        }

                        if (hashResult && hashResult.code !== undefined && hashResult.code !== 0) {
                            this.props.showMessage(hashResult.logs || hashResult.raw_log, 'error', hashResult && hashResult.hash);
                            this.props.setTxHashInProgressFalse();
                            clearInterval(time);

                            return;
                        }

                        this.props.fetchIBCBalance(this.props.value && this.props.value.network && this.props.value.network.api_address,
                            this.props.ibcAddress);
                        this.props.fetchBalance(this.props.address);
                        this.props.fetchUserBalance(this.props.address);
                        this.props.handleClose();
                        this.props.setTxHashInProgressFalse();
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
                        this.props.setTxHashInProgressFalse();
                        clearInterval(time);
                    }
                });
            }, 5000);
        }
    }

    render () {
        const denom = this.props.value && this.props.value.ibc_denom_hash;
        const decimals = this.props.value && this.props.value.network && this.props.value.network.decimals;

        let balance = this.props.balance && this.props.balance.length && this.props.balance.find((val) => val.denom === denom);
        balance = balance && balance.amount && balance.amount / (10 ** decimals);

        const amountWithDecimals = this.props.amountValue && (this.props.amountValue * (10 ** decimals));
        const inProgress = this.props.accountInProgress || this.props.timeoutHeightInProgress ||
            this.props.ibcSignInProgress || this.props.signInProgress;
        const broadCastInProgress = this.props.inProgressTxHash || this.props.broadCastInProgress;
        const disable = amountWithDecimals < 1 || this.props.amountValue > balance || inProgress || broadCastInProgress;
        const denomValue = this.props.value && this.props.value.network && this.props.value.network.display_denom;

        return (
            <Dialog
                aria-describedby="verify-twitter-dialog-description"
                aria-labelledby="verify-twitter-dialog-title"
                className="dialog deposite_dialog"
                open={this.props.open}
                onClose={this.props.handleClose}>
                {this.props.confirmWithdraw
                    ? <div className="confirm_ibc_dialog">
                        <h2>{variables[this.props.lang].confirm_ibc_withdraw_details}</h2>
                        <div className="ledger_note">
                            <p>{variables[this.props.lang]['ledger_note']}</p>
                        </div>
                        <div>
                            <div className="row">
                                <span className="label">{variables[this.props.lang].message_type}</span>
                                <p className="value">/ibc.applications.transfer.v1.MsgTransfer</p>
                            </div>
                            <div className="row">
                                <span className="label">{variables[this.props.lang].selected_token}</span>
                                <p className="value token_info">
                                    <NetworkImages alt={denomValue} name={denomValue}/>
                                    {denomValue}</p>
                            </div>
                            <div className="row">
                                <span className="label">{variables[this.props.lang].amount_deposit}</span>
                                <p className="value">{this.props.amountValue}</p>
                            </div>
                            <div className="row">
                                <span className="label">{variables[this.props.lang].from}</span>
                                <div className="hash_text address" title={this.props.address}>
                                    <p className="name">{this.props.address}</p>
                                    {this.props.address &&
                                        this.props.address.slice(this.props.address.length - 6, this.props.address.length)}
                                </div>
                            </div>
                            <div className="row">
                                <span className="label">{variables[this.props.lang].to}</span>
                                <div className="hash_text address" title={this.props.ibcAddress}>
                                    <p className="name">{this.props.ibcAddress}</p>
                                    {this.props.ibcAddress &&
                                        this.props.ibcAddress.slice(this.props.ibcAddress.length - 6, this.props.ibcAddress.length)}
                                </div>
                            </div>
                        </div>
                        <div className="confirm_actions">
                            <Button
                                className="cancel_button"
                                onClick={this.props.handleClose}>
                                {variables[this.props.lang].cancel}
                            </Button>
                            <Button
                                className="deposite_button"
                                disabled={disable}
                                onClick={() => this.handleWithdraw(decimals, denom)}>
                                {broadCastInProgress
                                    ? variables[this.props.lang].processing + '...'
                                    : inProgress
                                        ? variables[this.props.lang]['approval_pending'] + '...'
                                        : variables[this.props.lang].confirm}
                            </Button>
                        </div>
                    </div>
                    : <div className="deposite_dialog_content">
                        <h2>{variables[this.props.lang]['withdraw_ibc_asset']}</h2>
                        <div className="deposite_section1">
                            <span>{variables[this.props.lang]['ibc_withdraw']}</span>
                            <div className="ibc_transfer_section">
                                <div>
                                    <span>{variables[this.props.lang].from}</span>
                                    <div className="hash_text" title={this.props.address}>
                                        <p className="name">{this.props.address}</p>
                                        {this.props.address.slice(this.props.address.length - 4, this.props.address.length)}
                                    </div>
                                </div>
                                <img alt="icon" src={arrowIcon}/>
                                <div>
                                    <span>{variables[this.props.lang].to}</span>
                                    {this.props.inProgress
                                        ? <DotsLoading/>
                                        : <div className="hash_text" title={this.props.ibcAddress}>
                                            <p className="name">{this.props.ibcAddress}</p>
                                            {this.props.ibcAddress.slice(this.props.ibcAddress.length - 4, this.props.ibcAddress.length)}
                                        </div>}
                                </div>
                            </div>
                        </div>
                        <div className="deposite_section2">
                            <div className="deposite_section2_header">
                                <span>{variables[this.props.lang]['amount_withdraw']}</span>
                                <span className="balance"> Available = {this.props.balance && this.props.balance.length
                                    ? <span>{balance} {this.props.value && this.props.value.network && this.props.value.network.display_denom}</span>
                                    : `0 ${this.props.value && this.props.value.network && this.props.value.network.display_denom}`}</span>
                            </div>
                            <AmountValueTextField
                                balance={balance || 0}
                                denom={this.props.value && this.props.value.network && this.props.value.network.display_denom}/>
                        </div>
                        <Button
                            className="deposite_button primary_button"
                            disabled={disable}
                            onClick={() => this.props.setWithdrawConfirm(true)}>
                            {variables[this.props.lang].withdraw}
                        </Button>
                    </div>}
            </Dialog>
        );
    }
}

WithDrawDialog.propTypes = {
    accountInProgress: PropTypes.bool.isRequired,
    address: PropTypes.string.isRequired,
    allowances: PropTypes.array.isRequired,
    aminoSignTx: PropTypes.func.isRequired,
    balance: PropTypes.array.isRequired,
    broadCastInProgress: PropTypes.bool.isRequired,
    confirmWithdraw: PropTypes.bool.isRequired,
    connectIBCAccount: PropTypes.func.isRequired,
    fetchBalance: PropTypes.func.isRequired,
    fetchIBCBalance: PropTypes.func.isRequired,
    fetchTimeoutHeight: PropTypes.func.isRequired,
    fetchTxHash: PropTypes.func.isRequired,
    fetchUserBalance: PropTypes.func.isRequired,
    gasEstimation: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
    ibcAddress: PropTypes.string.isRequired,
    ibcSignInProgress: PropTypes.bool.isRequired,
    inProgress: PropTypes.bool.isRequired,
    inProgressTxHash: PropTypes.bool.isRequired,
    keys: PropTypes.object.isRequired,
    lang: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    setTxHashInProgressFalse: PropTypes.func.isRequired,
    setWithdrawConfirm: PropTypes.func.isRequired,
    showMessage: PropTypes.func.isRequired,
    sign: PropTypes.func.isRequired,
    signInProgress: PropTypes.bool.isRequired,
    timeoutHeightInProgress: PropTypes.bool.isRequired,
    txSignAndBroadCast: PropTypes.func.isRequired,
    txSignAndBroadCastAminoSign: PropTypes.func.isRequired,
    value: PropTypes.object.isRequired,
    walletConnectIBCAccount: PropTypes.func.isRequired,
    walletConnectSign: PropTypes.func.isRequired,
    amountValue: PropTypes.any,
    walletConnector: PropTypes.object,
};

const stateToProps = (state) => {
    return {
        address: state.account.wallet.connection.address,
        accountInProgress: state.account.wallet.connection.inProgress,
        allowances: state.account.bc.allowances.value,
        broadCastInProgress: state.account.wallet.broadCast.inProgress,
        ibcAddress: state.account.ibc.connection.address,
        amountValue: state.myAccount.amountValue,
        balance: state.account.bc.balance.value,
        inProgress: state.account.ibc.connection.inProgress,
        ibcSignInProgress: state.account.ibc.connection.signInProgress,
        inProgressTxHash: state.account.bc.txHash.inProgress,
        signInProgress: state.account.bc.signTx.inProgress,
        keys: state.account.wallet.connection.keys,
        lang: state.language,
        open: state.myAccount.withDrawDialog.open,
        value: state.myAccount.withDrawDialog.value,
        timeoutHeightInProgress: state.account.ibc.timeoutHeight.inProgress,

        confirmWithdraw: state.account.confirmWithdraw,
        walletConnector: state.account.wallet.connection.walletConnector,
    };
};

const actionToProps = {
    aminoSignTx,
    connectIBCAccount,
    fetchBalance,
    fetchUserBalance,
    fetchTxHash,
    showMessage,
    setTxHashInProgressFalse,
    fetchIBCBalance,
    fetchTimeoutHeight,
    gasEstimation,
    handleClose: hideWithdrawDialog,
    sign: protoBufSigning,
    txSignAndBroadCast,
    txSignAndBroadCastAminoSign,
    setWithdrawConfirm,
    walletConnectIBCAccount,
    walletConnectSign,
};

export default connect(stateToProps, actionToProps)(WithDrawDialog);
