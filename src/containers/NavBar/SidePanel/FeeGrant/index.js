import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React from 'react';
import './index.css';
import variables from '../../../../utils/variables';
import { Button } from '@mui/material';
import feeGrant from '../../../../assets/feeGrant/gas-station.svg';
import { feeGrantAllowanceClaim } from '../../../../actions/campaign';
import { fetchAllowances } from '../../../../actions/account/BCDetails';
import { aminoSignTx, initializeChain, walletConnectSign } from '../../../../actions/account/wallet';
import { connectBCAccount, verifyAccount } from '../../../../actions/account';
import { config } from '../../../../config';
import DotsLoading from '../../../../components/DotsLoading';
import moment from 'moment';

const FeeGrant = (props) => {
    const handleWalletConnect = () => {
        const data = {
            bcAccountAddress: props.address,
        };

        props.connectBCAccount(data, (res) => {
            if (res) {
                const tx = {
                    msg: {
                        type: 'omniflix/MsgSign',
                        value: {
                            address: props.address,
                        },
                    },
                    fee: {
                        amount: [{
                            amount: String(0),
                            denom: config.COIN_MINIMAL_DENOM,
                        }],
                        gas: String(1),
                    },
                    preferNoSetFee: true,
                    memo: res['auth_code'],
                };

                props.walletConnectSign(props.walletConnector, tx, props.address, (result) => {
                    if (result) {
                        const data = {
                            authCode: res['auth_code'],
                            sign: result.signature,
                        };

                        props.verifyAccount(res._id, data, (error) => {
                            if (!error) {
                                localStorage.setItem('address_of_nucleus', props.address);
                                if (window.keplr) {
                                    window.keplr.defaultOptions = {};
                                }

                                props.feeGrantAllowanceClaim((data) => {
                                    if (data) {
                                        props.fetchAllowances(props.address);
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    };

    const onClick = () => {
        if (props.walletConnector && props.walletConnector._connected) {
            handleWalletConnect();

            return;
        }

        props.initializeChain((address) => {
            if (address.length && address[0] && address[0].address) {
                const data = {
                    bcAccountAddress: address[0].address,
                };
                props.connectBCAccount(data, (res) => {
                    if (res) {
                        if (window.keplr) {
                            window.keplr.defaultOptions = {
                                sign: {
                                    preferNoSetFee: true,
                                    preferNoSetMemo: true,
                                },
                            };
                        }
                        const tx = {
                            msg: {
                                type: 'omniflix/MsgSign',
                                value: {
                                    address: address[0].address,
                                },
                            },
                            fee: {
                                amount: [{
                                    amount: String(0),
                                    denom: config.COIN_MINIMAL_DENOM,
                                }],
                                gas: String(1),
                            },
                            preferNoSetFee: true,
                            memo: res['auth_code'],
                        };

                        props.aminoSignTx(tx, address[0].address, (result) => {
                            if (result) {
                                const data = {
                                    authCode: res['auth_code'],
                                    sign: result.signature,
                                };

                                props.verifyAccount(res._id, data, (error) => {
                                    if (!error) {
                                        localStorage.setItem('address_of_nucleus', address[0].address);
                                        if (window.keplr) {
                                            window.keplr.defaultOptions = {};
                                        }

                                        props.feeGrantAllowanceClaim((data) => {
                                            if (data) {
                                                props.fetchAllowances(props.address);
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    };

    const granterInfo = {};
    if (props.allowances && props.allowances.length) {
        props.allowances.map((val) => {
            if (val && val.allowance && val.allowance.spend_limit && val.allowance.spend_limit.length) {
                const amount = val.allowance.spend_limit.find((val1) => (val1.denom === config.COIN_MINIMAL_DENOM) &&
                    val1.amount && (val1.amount > 0.1 * (10 ** config.COIN_DECIMALS)));
                if (amount && amount.amount) {
                    granterInfo.granter = val.granter;
                    granterInfo.amount = amount.amount / 10 ** config.COIN_DECIMALS;
                    granterInfo.expiration = val.allowance.expiration;
                }
            } else if (val && val.allowance && val.allowance.allowed_messages &&
                val.allowance.allowed_messages.length) {
                if (val && val.allowance && val.allowance.allowance &&
                    val.allowance.allowance.spend_limit && val.allowance.allowance.spend_limit.length) {
                    const amount = val.allowance.allowance.spend_limit.find((val1) => (val1.denom === config.COIN_MINIMAL_DENOM) &&
                        val1.amount && (val1.amount > 0.1 * (10 ** config.COIN_DECIMALS)));
                    if (amount && amount.amount) {
                        granterInfo.granter = val.granter;
                        granterInfo.amount = amount.amount / 10 ** config.COIN_DECIMALS;
                        granterInfo.expiration = val && val.allowance && val.allowance.allowance &&
                            val.allowance.allowance.expiration;
                    }
                }
            }

            return null;
        });
    }

    const inProgress = props.inProgress || props.connectionInProgress || props.allowancesInProgress || props.signInProgress;

    return (
        <div className="fee_grant">
            <div>
                <img alt="gas" src={feeGrant}/>
                <span>{variables[props.lang]['fee_grant_allowance']}</span>
            </div>
            <p>{variables[props.lang]['fee_grant_content']}</p>
            {inProgress
                ? <Button className="secondary_button" disabled={true}>
                    {variables[props.lang].processing + '...'}
                </Button>
                : granterInfo && granterInfo.amount && (granterInfo.amount > 0) &&
                granterInfo.expiration && moment().diff(granterInfo && granterInfo.expiration) < 0
                    ? <Button className="secondary_button" disabled={true}>
                        {variables[props.lang]['allowance_received']}
                    </Button>
                    : <Button
                        className="secondary_button"
                        onClick={onClick}>
                        {variables[props.lang]['request_fee_grant']}
                    </Button>}
            {inProgress
                ? null
                : (granterInfo && granterInfo.expiration) &&
                moment().diff(granterInfo && granterInfo.expiration) > 0
                    ? <div className="allowance_amount">
                        <div>
                            <p>{variables[props.lang]['fee_grant_expired']}</p>
                        </div>
                    </div>
                    : granterInfo && granterInfo.amount && <div className="allowance_amount">
                        <div>
                            <span>{variables[props.lang].allowance}:</span>
                            {props.allowancesInProgress
                                ? <DotsLoading/>
                                : <p>{granterInfo && granterInfo.amount} {config.COIN_DENOM}</p>}
                        </div>
                        <div>
                            <span>{variables[props.lang].expiry}:</span>
                            {props.allowancesInProgress
                                ? <DotsLoading/>
                                : <p>{moment(granterInfo && granterInfo.expiration).endOf('day').fromNow()}</p>}
                        </div>
                    </div>}
        </div>
    );
};

FeeGrant.propTypes = {
    address: PropTypes.string.isRequired,
    allowances: PropTypes.array.isRequired,
    allowancesInProgress: PropTypes.bool.isRequired,
    aminoSignTx: PropTypes.func.isRequired,
    connectBCAccount: PropTypes.func.isRequired,
    connectionInProgress: PropTypes.bool.isRequired,
    feeGrantAllowanceClaim: PropTypes.func.isRequired,
    fetchAllowances: PropTypes.func.isRequired,
    inProgress: PropTypes.bool.isRequired,
    initializeChain: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    signInProgress: PropTypes.bool.isRequired,
    verifyAccount: PropTypes.func.isRequired,
    walletConnectSign: PropTypes.func.isRequired,
    walletConnector: PropTypes.object,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        address: state.account.wallet.connection.address,
        inProgress: state.campaign.feeGrant.inProgress,
        connectionInProgress: state.account.wallet.connection.inProgress,
        allowances: state.account.bc.allowances.value,
        allowancesInProgress: state.account.bc.allowances.inProgress,
        signInProgress: state.account.bc.signTx.inProgress,
        walletConnector: state.account.wallet.connection.walletConnector,
    };
};

const actionToProps = {
    fetchAllowances,
    feeGrantAllowanceClaim,
    initializeChain,
    connectBCAccount,
    aminoSignTx,
    verifyAccount,
    walletConnectSign,
};

export default connect(stateToProps, actionToProps)(FeeGrant);
