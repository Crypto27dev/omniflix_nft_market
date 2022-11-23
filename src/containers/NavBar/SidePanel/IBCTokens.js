import React from 'react';
import * as PropTypes from 'prop-types';
import { config } from '../../../config';
import { commaSeparator, splitDecimals } from '../../../utils/numbers';
import NoData from '../../../components/NoData';
import { connect } from 'react-redux';
import { showDepositeDialog, showWithdrawDialog } from '../../../actions/myAccount';
import { withRouter } from 'react-router';
import { Button } from '@mui/material';
import variables from '../../../utils/variables';
import NetworkImages from '../../../components/NetworkImages';
import { Tooltip } from '@material-ui/core';
import { ReactComponent as CopyRight } from '../../../assets/copy-right.svg';

const IBCTokens = (props) => {
    const list = props.data && props.data.length &&
        props.data.filter((val) => val.status === 'ENABLED');

    return (
        <div className="ibc_tokens_section">
            {list && list.length
                ? list.map((item, index) => {
                    const name = item.network && item.network.display_denom ? item.network.display_denom : item.label;

                    const denom = item && item.ibc_denom_hash
                        ? item.ibc_denom_hash
                        : config.COIN_MINIMAL_DENOM;
                    const decimals = item && item.network && item.network.decimals
                        ? item.network.decimals
                        : config.COIN_DECIMALS;

                    let balance = props.balance && props.balance.length && props.balance.find((val) => val.denom === denom);
                    balance = balance && balance.amount && splitDecimals(balance.amount / (10 ** decimals));

                    const buttonsDisable = item && item.status && (item.status !== 'ENABLED');
                    const disable = props.balance && props.balance.length && (!(props.balance.find((val) => val.denom === denom)) || (props.balance.find((val) => val.denom === denom)) < 0);

                    if (index <= 4) {
                        return (
                            <div key={index} className="tokens_list">
                                <div className="token_info">
                                    <NetworkImages name={name}/>
                                    <span>{name}</span>
                                    {name === 'ATOM/CH-0'
                                        ? <Tooltip
                                            classes={{ popper: 'warning_ibc_tooltip side_bar_ibc' }}
                                            placement="bottom-start" title={
                                                <div className="text_content">
                                                    <CopyRight/>
                                                    {`"${name}" ${variables[props.lang]['ibc_deprecated_text']} "${name}"`}
                                                </div>}>
                                            <CopyRight/>
                                        </Tooltip> : null}
                                </div>
                                <span className="token_bal">
                                    {balance && balance.length
                                        ? <>
                                            {balance.length && balance[0] && commaSeparator(balance[0])}
                                            {balance.length && balance[1] &&
                                                <span>.{balance.length && balance[1]}</span>}
                                        </>
                                        : 0}
                                </span>
                                <div className="ibc_actions">
                                    <Button
                                        disabled={buttonsDisable}
                                        onClick={() => props.showDepositeDialog(item)}>
                                        {variables[props.lang].deposit}
                                    </Button>
                                    <Button
                                        disabled={disable || buttonsDisable}
                                        onClick={() => props.showWithdrawDialog(item)}>
                                        {variables[props.lang].withdraw}
                                    </Button>
                                </div>
                            </div>
                        );
                    }

                    return null;
                }) : <NoData/>}
        </div>
    );
};

IBCTokens.propTypes = {
    balance: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    lang: PropTypes.string.isRequired,
    showDepositeDialog: PropTypes.func.isRequired,
    showWithdrawDialog: PropTypes.func.isRequired,
};

const stateToProps = (state) => {
    return {
        balance: state.account.bc.balance.value,
        data: state.account.chainID.list,
        lang: state.language,
    };
};

const actionToProps = {
    showDepositeDialog,
    showWithdrawDialog,
};

export default withRouter(connect(stateToProps, actionToProps)(IBCTokens));
