import React from 'react';
import * as PropTypes from 'prop-types';
import { config } from '../../../config';
import { commaSeparator, splitDecimals } from '../../../utils/numbers';
import NoData from '../../../components/NoData';
import { connect } from 'react-redux';
import { tokensList } from '../../../utils/defaultOptions';
import NetworkImages from '../../../components/NetworkImages';

const TotalValueTraded = (props) => {
    return (
        <div className="ibc_tokens_section">
            {props.tokensTraded &&
            Object.keys(props.tokensTraded).length > 0
                ? Object.keys(props.tokensTraded).map((item, index) => {
                    const tokenType = item &&
                        tokensList.find((val) => val.value === item);
                    const ibcToken = item && props.ibcTokensList && props.ibcTokensList.length &&
                        props.ibcTokensList.find((val) => val && val.ibc_denom_hash &&
                            (val.ibc_denom_hash === item));
                    const name = (ibcToken && ibcToken.network && ibcToken.network.display_denom) ||
                        (tokenType && tokenType.label);

                    const decimals = ibcToken && ibcToken.network && ibcToken.network.decimals
                        ? ibcToken.network.decimals
                        : config.COIN_DECIMALS;
                    const balance = Object.values(props.tokensTraded)[index] &&
                        splitDecimals(Object.values(props.tokensTraded)[index] / (10 ** decimals));
                    if (index <= 4) {
                        return (
                            <div key={index} className="tokens_list">
                                <div className="token_info">
                                    <NetworkImages name={name}/>
                                    <span>{name}</span>
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
                            </div>
                        );
                    }

                    return null;
                }) : <NoData/>}
        </div>
    );
};

TotalValueTraded.propTypes = {
    balance: PropTypes.array.isRequired,
    ibcTokensList: PropTypes.array.isRequired,
    ibcTokensListInProgress: PropTypes.bool.isRequired,
    lang: PropTypes.string.isRequired,
    tokensTraded: PropTypes.object.isRequired,
    tokensTradedInProgress: PropTypes.bool.isRequired,
};

const stateToProps = (state) => {
    return {
        balance: state.account.bc.balance.value,
        lang: state.language,
        tokensTraded: state.marketplace.accountTokensTraded.result,
        tokensTradedInProgress: state.marketplace.accountTokensTraded.inProgress,
        ibcTokensList: state.marketplace.ibcTokensList.value,
        ibcTokensListInProgress: state.marketplace.ibcTokensList.inProgress,
    };
};

export default connect(stateToProps)(TotalValueTraded);
