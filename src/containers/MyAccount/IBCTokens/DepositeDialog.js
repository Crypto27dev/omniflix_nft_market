import React, { Component } from 'react';
import { Button, Dialog } from '@material-ui/core';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import variables from '../../../utils/variables';
import { fetchUserBalance, hideDepositeDialog } from '../../../actions/myAccount';
import AmountValueTextField from './AmountValueTextField';
import arrowIcon from '../../../assets/explore/Vector.svg';
import {
    aminoSignIBCTx,
    connectIBCAccount,
    fetchIBCBalance,
    fetchTimeoutHeight,
    setIBCTxInProgress,
    walletConnectIBCAccount,
} from '../../../actions/account/IBCTokens';
import DotsLoading from '../../../components/DotsLoading';
import { fetchBalance } from '../../../actions/account/BCDetails';
import Long from 'long';
import { config } from '../../../config';
import { setDepositConfirm } from '../../../actions/account';
import NetworkImages from '../../../components/NetworkImages';
import { showMessage } from '../../../actions/snackbar';
import {
    fetchTxHash,
    gasEstimation,
    ibcTxSignAndBroadCast,
    ibcWalletConnectSign,
    setTxHashInProgressFalse,
} from '../../../actions/account/wallet';

class DepositDialog extends Component {
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

    handleDeposit (decimals) {
        this.props.fetchTimeoutHeight(config.REST_URL, this.props.value && this.props.value.channel, (result) => {
            const revisionNumber = result && result.proof_height && result.proof_height.revision_number &&
                Long.fromNumber(result.proof_height.revision_number);
            const revisionHeight = result && result.proof_height && result.proof_height.revision_height;

            const data = {
                msg: {
                    typeUrl: '/ibc.applications.transfer.v1.MsgTransfer',
                    value: {
                        source_port: 'transfer',
                        source_channel: this.props.value && this.props.value.destination_channel,
                        token: {
                            denom: this.props.value && this.props.value.network && this.props.value.network.denom,
                            amount: String(this.props.amountValue * (10 ** decimals)),
                        },
                        sender: this.props.ibcAddress,
                        receiver: this.props.address,
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
                        denom: this.props.value && this.props.value.network && this.props.value.network.denom,
                    }],
                    gas: String(450000),
                },
                memo: '',
            };

            const denom = this.props.value && this.props.value.ibc_denom_hash;
            let balance = this.props.mainBalance && this.props.mainBalance.length && denom &&
                this.props.mainBalance.find((val) => val.denom === denom);
            balance = balance && balance.amount;
            const explorer = this.props.value && this.props.value.network && this.props.value.network.explorer;
            const gas = this.props.value && this.props.value.network && this.props.value.network.gas_price_step;

            if (this.props.walletConnector && this.props.walletConnector._connected) {
                const Tx = {
                    msg: {
                        type: 'cosmos-sdk/MsgTransfer',
                        value: {
                            source_port: 'transfer',
                            source_channel: this.props.value && this.props.value.destination_channel,
                            token: {
                                denom: this.props.value && this.props.value.network && this.props.value.network.denom,
                                amount: String(this.props.amountValue * (10 ** decimals)),
                            },
                            sender: this.props.ibcAddress,
                            receiver: this.props.address,
                            timeout_height: {
                                revision_height: String(revisionNumber) || undefined,
                                revision_number: String(Long.fromNumber(parseInt(revisionHeight) + 150)) || undefined,
                            },
                        },
                    },
                    fee: {
                        amount: [{
                            amount: String(0),
                            denom: this.props.value && this.props.value.network && this.props.value.network.denom,
                        }],
                        gas: String(450000),
                    },
                    memo: '',
                };

                this.props.gasEstimation(Tx, this.props.keys && this.props.keys.pubKey,
                    this.props.ibcAddress, this.state.config, null, (result) => {
                        if (result && result.gas_used) {
                            let fee = result.gas_used * ((gas && gas.average) || (gas && gas.high) || 0.15);
                            fee = fee.toFixed(0);

                            if (fee) {
                                Tx.fee.amount = [{
                                    amount: fee,
                                    denom: this.props.value && this.props.value.network && this.props.value.network.denom,
                                }];
                            }
                        } else {
                            let fee = 225000 * ((gas && gas.average) || (gas && gas.high) || 0.15);
                            fee = fee.toFixed(0);

                            Tx.fee.amount = [{
                                amount: String(fee),
                                denom: this.props.value && this.props.value.network && this.props.value.network.denom,
                            }];
                        }

                        this.props.ibcWalletConnectSign(this.props.walletConnector, this.state.config, Tx,
                            this.props.ibcAddress, (result, txBytes) => {
                                if (result) {
                                    const resData = {
                                        tx_bytes: txBytes,
                                        mode: 'BROADCAST_MODE_SYNC',
                                    };
                                    this.props.ibcTxSignAndBroadCast(resData, this.state.config, explorer, (res1) => {
                                        this.handleHash(res1, balance, denom, explorer);
                                    });
                                }
                            });
                    });

                return;
            }

            this.props.sign(this.state.config, data, (result) => {
                if (result) {
                    this.props.setIBCTxInProgress(true);
                    this.props.fetchIBCBalance(this.props.value && this.props.value.network && this.props.value.network.api_address,
                        this.props.ibcAddress);
                    this.props.fetchBalance(this.props.address);
                    this.props.fetchUserBalance(this.props.address);
                    const time = setInterval(() => {
                        this.props.fetchUserBalance(this.props.address, (resBalance) => {
                            let resultBalance = resBalance && resBalance.length && denom &&
                                resBalance.find((val) => val.denom === denom);
                            resultBalance = resultBalance && resultBalance.amount;
                            if (resultBalance !== balance) {
                                this.props.setIBCTxInProgress(false);
                                this.props.showMessage('Transaction Successful', 'success', result && result.transactionHash, explorer);
                                this.props.fetchBalance(this.props.address);
                                clearInterval(time);
                            }
                        });
                    }, 5000);
                    this.props.handleClose();
                }
            });
        });
    }

    handleHash (res1, balance, denom, explorer) {
        if (res1 && res1.txhash) {
            let counter = 0;
            const time = setInterval(() => {
                this.props.fetchTxHash(res1.txhash, (hashResult) => {
                    if (hashResult) {
                        if (hashResult && hashResult.code !== undefined && hashResult.code !== 0) {
                            this.props.showMessage(hashResult.logs || hashResult.raw_log, 'error', hashResult && hashResult.hash, explorer);
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
                            this.props.showMessage(hashResult.logs || hashResult.raw_log, 'error', hashResult && hashResult.hash, explorer);
                            this.props.setTxHashInProgressFalse();
                            clearInterval(time);

                            return;
                        }

                        this.props.showMessage('Transaction Success. Token Transfer in progress...', 'success');
                        this.props.setTxHashInProgressFalse();
                        clearInterval(time);
                        this.props.setIBCTxInProgress(true);
                        const fetchTime = setInterval(() => {
                            this.props.fetchUserBalance(this.props.address, (resBalance) => {
                                let resultBalance = resBalance && resBalance.length && denom &&
                                    resBalance.find((val) => val.denom === denom);
                                resultBalance = resultBalance && resultBalance.amount;
                                if (resultBalance !== balance) {
                                    this.props.setIBCTxInProgress(false);
                                    this.props.showMessage('Transaction Successful', 'success', res1.txhash, explorer);
                                    this.props.fetchBalance(this.props.address);
                                    clearInterval(fetchTime);
                                }
                            });
                        }, 5000);
                        this.props.handleClose();
                    }
                });
            }, 5000);
        }
    }

    render () {
        const decimals = this.props.value && this.props.value.network && this.props.value.network.decimals;

        let balance = this.props.balance && this.props.balance.length &&
            this.props.value && this.props.value.network && this.props.value.network.denom &&
            this.props.balance.find((val) => val.denom === this.props.value.network.denom);
        balance = balance && balance.amount && balance.amount / (10 ** decimals);

        const amountWithDecimals = this.props.amountValue && (this.props.amountValue * (10 ** decimals));
        const inProgress = this.props.accountInProgress || this.props.timeoutHeightInProgress ||
            this.props.signInProgress || this.props.inProgressSign;
        const broadCastInProgress = this.props.broadCastInProgress || this.props.inProgressTxHash;
        const disable = amountWithDecimals < 1 || this.props.amountValue > balance || inProgress || broadCastInProgress;
        const denom = this.props.value && this.props.value.network && this.props.value.network.display_denom;

        return (
            <Dialog
                aria-describedby="verify-twitter-dialog-description"
                aria-labelledby="verify-twitter-dialog-title"
                className="dialog deposite_dialog"
                open={this.props.open}
                onClose={this.props.handleClose}>
                {this.props.confirmDeposit
                    ? <div className="confirm_ibc_dialog">
                        <h2>{variables[this.props.lang].confirm_ibc_deposit_details}</h2>
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
                                    <NetworkImages alt={denom} name={denom}/>
                                    {denom}</p>
                            </div>
                            <div className="row">
                                <span className="label">{variables[this.props.lang].amount_deposit}</span>
                                <p className="value">{this.props.amountValue}</p>
                            </div>
                            <div className="row">
                                <span className="label">{variables[this.props.lang].from}</span>
                                <div className="hash_text address" title={this.props.ibcAddress}>
                                    <p className="name">{this.props.ibcAddress}</p>
                                    {this.props.ibcAddress &&
                                        this.props.ibcAddress.slice(this.props.ibcAddress.length - 6, this.props.ibcAddress.length)}
                                </div>

                            </div>
                            <div className="row">
                                <span className="label">{variables[this.props.lang].to}</span>
                                <div className="hash_text address" title={this.props.address}>
                                    <p className="name">{this.props.address}</p>
                                    {this.props.address &&
                                        this.props.address.slice(this.props.address.length - 6, this.props.address.length)}
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
                                onClick={() => this.handleDeposit(decimals)}>
                                {broadCastInProgress
                                    ? variables[this.props.lang].processing + '...'
                                    : inProgress
                                        ? variables[this.props.lang]['approval_pending'] + '...'
                                        : variables[this.props.lang].confirm}
                            </Button>
                        </div>
                    </div>
                    : <div className="deposite_dialog_content">
                        <h2>{variables[this.props.lang]['deposit_ibc_asset']}</h2>
                        <div className="deposite_section1">
                            <span>{variables[this.props.lang]['ibc_transfer']}</span>
                            <div className="ibc_transfer_section">
                                <div>
                                    <span>{variables[this.props.lang].from}</span>
                                    {this.props.inProgress
                                        ? <DotsLoading/>
                                        : <div className="hash_text" title={this.props.ibcAddress}>
                                            <p className="name">{this.props.ibcAddress}</p>
                                            {this.props.ibcAddress.slice(this.props.ibcAddress.length - 4, this.props.ibcAddress.length)}
                                        </div>}
                                </div>
                                <img alt="icon" src={arrowIcon}/>
                                <div>
                                    <span>{variables[this.props.lang].to}</span>
                                    <div className="hash_text" title={this.props.address}>
                                        <p className="name">{this.props.address}</p>
                                        {this.props.address.slice(this.props.address.length - 4, this.props.address.length)}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="deposite_section2">
                            <div className="deposite_section2_header">
                                <span>{variables[this.props.lang]['amount_deposit']}</span>
                                <span className="balance"> Available = {this.props.balanceInProgress
                                    ? <DotsLoading/>
                                    : balance
                                        ? <span>{balance} {this.state.config && this.state.config.COIN_DENOM}</span>
                                        : `0 ${this.props.value && this.props.value.network && this.props.value.network.display_denom}`}</span>
                            </div>
                            <AmountValueTextField
                                balance={balance || 0}
                                denom={this.props.value && this.props.value.network && this.props.value.network.display_denom}/>
                        </div>
                        <Button
                            className="deposite_button primary_button"
                            disabled={disable}
                            onClick={() => this.props.setDepositConfirm(true)}>
                            {variables[this.props.lang].deposit}
                        </Button>
                    </div>}
            </Dialog>
        );
    }
}

DepositDialog.propTypes = {
    accountInProgress: PropTypes.bool.isRequired,
    address: PropTypes.string.isRequired,
    allowances: PropTypes.array.isRequired,
    balance: PropTypes.array.isRequired,
    balanceInProgress: PropTypes.bool.isRequired,
    broadCastInProgress: PropTypes.bool.isRequired,
    confirmDeposit: PropTypes.bool.isRequired,
    connectIBCAccount: PropTypes.func.isRequired,
    fetchBalance: PropTypes.func.isRequired,
    fetchIBCBalance: PropTypes.func.isRequired,
    fetchTimeoutHeight: PropTypes.func.isRequired,
    fetchTxHash: PropTypes.func.isRequired,
    fetchUserBalance: PropTypes.func.isRequired,
    gasEstimation: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
    ibcAddress: PropTypes.string.isRequired,
    ibcTxInProgress: PropTypes.bool.isRequired,
    ibcTxSignAndBroadCast: PropTypes.func.isRequired,
    ibcWalletConnectSign: PropTypes.func.isRequired,
    inProgress: PropTypes.bool.isRequired,
    inProgressSign: PropTypes.bool.isRequired,
    inProgressTxHash: PropTypes.bool.isRequired,
    keys: PropTypes.object.isRequired,
    lang: PropTypes.string.isRequired,
    mainBalance: PropTypes.array.isRequired,
    open: PropTypes.bool.isRequired,
    setDepositConfirm: PropTypes.func.isRequired,
    setIBCTxInProgress: PropTypes.func.isRequired,
    setTxHashInProgressFalse: PropTypes.func.isRequired,
    showMessage: PropTypes.func.isRequired,
    sign: PropTypes.func.isRequired,
    signInProgress: PropTypes.bool.isRequired,
    timeoutHeightInProgress: PropTypes.bool.isRequired,
    value: PropTypes.object.isRequired,
    walletConnectIBCAccount: PropTypes.func.isRequired,
    amountValue: PropTypes.any,
    walletConnector: PropTypes.object,
};

const stateToProps = (state) => {
    return {
        address: state.account.wallet.connection.address,
        accountInProgress: state.account.wallet.connection.inProgress,
        allowances: state.account.bc.allowances.value,
        ibcAddress: state.account.ibc.connection.address,
        amountValue: state.myAccount.amountValue,
        balance: state.account.ibc.balance.value,
        balanceInProgress: state.account.ibc.balance.inProgress,
        broadCastInProgress: state.account.wallet.broadCast.inProgress,
        inProgress: state.account.ibc.connection.inProgress,
        inProgressSign: state.account.bc.signTx.inProgress,
        inProgressTxHash: state.account.bc.txHash.inProgress,
        signInProgress: state.account.ibc.connection.signInProgress,
        lang: state.language,
        mainBalance: state.account.bc.balance.value,
        open: state.myAccount.depositeDialog.open,
        value: state.myAccount.depositeDialog.value,
        timeoutHeightInProgress: state.account.ibc.timeoutHeight.inProgress,

        confirmDeposit: state.account.confirmDeposit,
        ibcTxInProgress: state.account.ibc.ibcTxInProgress,
        walletConnector: state.account.wallet.connection.walletConnector,
        keys: state.account.wallet.connection.keys,
    };
};

const actionToProps = {
    connectIBCAccount,
    fetchBalance,
    fetchIBCBalance,
    fetchUserBalance,
    fetchTimeoutHeight,
    fetchTxHash,
    gasEstimation,
    handleClose: hideDepositeDialog,
    ibcTxSignAndBroadCast,
    sign: aminoSignIBCTx,
    showMessage,
    setDepositConfirm,
    setIBCTxInProgress,
    setTxHashInProgressFalse,
    walletConnectIBCAccount,
    ibcWalletConnectSign,
};

export default connect(stateToProps, actionToProps)(DepositDialog);
