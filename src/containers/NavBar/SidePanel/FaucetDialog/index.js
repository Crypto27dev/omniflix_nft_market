import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import './index.css';
import { Button, Dialog, DialogContent } from '@material-ui/core';
import variables from '../../../../utils/variables';
import { addFaucetBalance, fetchFaucetClaim, hideFaucetDialog, setFaucetSuccess } from '../../../../actions/faucet';
import { coinDenom, config, FaucetList } from '../../../../config';
import { connectIBCAccount, fetchIBCBalance } from '../../../../actions/account/IBCTokens';
import { fetchBalance } from '../../../../actions/account/BCDetails';
import DotsLoading from '../../../../components/DotsLoading';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

class FaucetDialog extends Component {
    constructor (props) {
        super(props);

        this.state = {
            name: null,
            address: null,
        };
    }

    claimTokens (value) {
        this.setState({
            name: value.name,
        });

        if (value.name === coinDenom) {
            const data = {
                address: this.props.address,
            };

            this.props.addFaucetBalance(value.chain, data, (error) => {
                if (!error) {
                    setTimeout(() => {
                        this.props.fetchBalance(this.props.address);
                        this.props.fetchFaucetClaim(this.props.address);
                    }, 5000);
                    this.props.setFaucetSuccess();
                }
            });

            return;
        }

        const config = {
            RPC_URL: value && value.network && value.network.rpc_address,
            REST_URL: value && value.network && value.network.api_address,
            CHAIN_ID: value && value.network && value.network.chain_id,
            CHAIN_NAME: value && value.network && value.network.name,
            COIN_DENOM: value && value.network && value.network.display_denom,
            COIN_MINIMAL_DENOM: value && value.network && value.network.denom,
            COIN_DECIMALS: value && value.network && value.network.decimals,
            PREFIX: value && value.network && value.network.address_prefix,
        };

        this.initKeplr(config, value);
    }

    initKeplr (config, value) {
        this.props.connectIBCAccount(config, (address) => {
            this.setState({
                address: address[0].address,
            });
            const data = {
                address: address[0].address,
            };

            this.props.addFaucetBalance(value.chain, data, (error) => {
                if (!error) {
                    setTimeout(() => {
                        this.props.fetchIBCBalance(config.REST_URL, address[0].address);
                    }, 5000);
                    this.props.setFaucetSuccess();
                }
            });
        });
    }

    render () {
        const {
            name,
            address,
        } = this.state;

        const inProgress = this.props.inProgress;
        const selected = name && FaucetList && FaucetList.length && FaucetList.find((val) => val.name === name);
        const addressDisplay = address || this.props.address;

        return (
            <Dialog
                aria-describedby="verify-twitter-dialog-description"
                aria-labelledby="verify-twitter-dialog-title"
                className="dialog faucet_dialog"
                open={this.props.open}
                onClose={this.props.handleClose}>
                {this.props.success
                    ? <DialogContent
                        className="faucet_dialog_content claimed_dialog">
                        <div className="claimed_tokens">
                            <span>{variables[this.props.lang].congrats}</span>
                            <div className="tokens_list">
                                <div className="token_details">
                                    <div className="token_left">
                                        <img alt="icon" src={selected.icon}/>
                                        <div className="token_name">
                                            <span>{variables[this.props.lang].chain}{' : '}{selected && selected.chain_id}</span>
                                            <div className="stream_value hash_text" title={addressDisplay}>
                                                <p className="name">{addressDisplay}</p>
                                                {addressDisplay && addressDisplay.slice(addressDisplay.length - 6, addressDisplay.length)}
                                            </div>
                                        </div>
                                    </div>
                                    <Button disabled className="secondary_button">
                                        {variables[this.props.lang].claimed +
                                            (name === 'JUNOX' ? ' 10 ' : ' 100 ') + name}
                                    </Button>
                                </div>
                            </div>
                            {name === coinDenom
                                ? <span>{variables[this.props.lang]['claimed_tokens']}</span>
                                : name
                                    ? <span>{variables[this.props.lang]['claimed_tokens'] + ', ' +
                                        ' ' + variables[this.props.lang]['deposit_ibc']}</span>
                                    : <span>{variables[this.props.lang]['claimed_tokens']}</span>}
                        </div>
                    </DialogContent>
                    : <DialogContent
                        className="faucet_dialog_content">
                        <h2> {variables[this.props.lang].faucet}</h2>
                        <div className="tokens_list">
                            {FaucetList && FaucetList.length &&
                                FaucetList.map((item, index) => {
                                    let denom = item.denom;
                                    let balance;

                                    if (item.name !== config.COIN_DENOM) {
                                        const decimals = item && item.network && item.network.decimals;
                                        denom = item && item.network && item.network.denom;
                                        balance = this.props.balanceList && this.props.balanceList.length && this.props.balanceList.find((val) => val.denom === denom);
                                        balance = balance && balance.amount && balance.amount / (10 ** decimals);
                                    } else {
                                        balance = this.props.balance && this.props.balance.length && this.props.balance.find((val) => val.denom === denom);
                                        balance = balance && balance.amount && balance.amount / (10 ** config.COIN_DECIMALS);
                                        // if (this.props.faucetClaim && !this.props.faucetClaim.claim) {
                                        //     balance = 0;
                                        // }
                                    }

                                    return (
                                        <div
                                            key={index}
                                            className="token_details">
                                            <div className="token_left">
                                                <img alt="icon" src={item.icon}/>
                                                <div className="token_name">
                                                    <span>{item.name}</span>
                                                    <span>{variables[this.props.lang].chain}{' : '}{item.chain_id}</span>
                                                </div>
                                            </div>
                                            {this.props.balanceListInProgress || this.props.addressInProgress
                                                ? <DotsLoading/>
                                                : balance && balance > 0
                                                    ? <Button disabled className="secondary_button">
                                                        {variables[this.props.lang].claimed}
                                                    </Button>
                                                    : <Button
                                                        disabled={(name === item.name) && inProgress}
                                                        onClick={() => this.claimTokens(item)}>
                                                        {(name === item.name) && inProgress
                                                            ? variables[this.props.lang].processing + '...'
                                                            : variables[this.props.lang]['claim_test_tokens']}
                                                    </Button>}
                                        </div>
                                    );
                                })}
                        </div>
                    </DialogContent>
                }
            </Dialog>
        );
    }
}

FaucetDialog.propTypes = {
    addFaucetBalance: PropTypes.func.isRequired,
    address: PropTypes.string.isRequired,
    addressInProgress: PropTypes.bool.isRequired,
    balance: PropTypes.array.isRequired,
    balanceList: PropTypes.array.isRequired,
    balanceListInProgress: PropTypes.bool.isRequired,
    connectIBCAccount: PropTypes.func.isRequired,
    faucetClaim: PropTypes.object.isRequired,
    faucetClaimInProgress: PropTypes.bool.isRequired,
    fetchBalance: PropTypes.func.isRequired,
    fetchFaucetClaim: PropTypes.func.isRequired,
    fetchIBCBalance: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
    inProgress: PropTypes.bool.isRequired,
    lang: PropTypes.string.isRequired,
    location: PropTypes.shape({
        pathname: PropTypes.string,
    }).isRequired,
    open: PropTypes.bool.isRequired,
    setFaucetSuccess: PropTypes.func.isRequired,
    success: PropTypes.bool.isRequired,
    match: PropTypes.shape({
        params: PropTypes.shape({
            id: PropTypes.string,
        }),
    }),
};

const stateToProps = (state) => {
    return {
        address: state.account.wallet.connection.address,
        addressInProgress: state.account.wallet.connection.addressInProgress,
        balance: state.account.bc.balance.value,
        balanceList: state.faucet.balanceList.value,
        balanceListInProgress: state.faucet.balanceList.inProgress,
        lang: state.language,
        open: state.faucet.faucetDialog.open,
        success: state.faucet.faucetDialog.success,
        inProgress: state.faucet.faucetDialog.inProgress,
        faucetClaim: state.faucet.faucetClaim.value,
        faucetClaimInProgress: state.faucet.faucetClaim.inProgress,
    };
};

const actionToProps = {
    handleClose: hideFaucetDialog,
    connectIBCAccount,
    fetchFaucetClaim,
    fetchBalance,
    fetchIBCBalance,
    addFaucetBalance,
    setFaucetSuccess,
};

export default withRouter(connect(stateToProps, actionToProps)(FaucetDialog));
