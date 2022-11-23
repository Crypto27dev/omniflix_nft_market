import React from 'react';
import variables from '../../../../utils/variables';
import { Button, Tooltip } from '@mui/material';
import * as PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { showDelistDialog } from '../../../../actions/marketplace';
import './index.css';
import { config } from '../../../../config';
import { tokensList } from '../../../../utils/defaultOptions';
import { hideActiveCard } from '../../../../actions/explore';
import { ReactComponent as CopyRight } from '../../../../assets/copy-right.svg';

const DeList = (props) => {
    const handleDeList = () => {
        props.hideActiveCard();
        props.showDelistDialog(props.nftDetails || props.value);
    };

    const list = props.nftDetails && props.nftDetails.nftDetails && props.nftDetails.nftDetails.auction
        ? props.nftDetails.nftDetails.auction
        : (props.nftDetails && props.nftDetails.nftDetails && props.nftDetails.nftDetails.list) ||
        (props.value && props.value.nftDetails && props.value.nftDetails.list);
    const tokenType = list && list.price && list.price.denom &&
        tokensList.find((val) => val.value === list.price.denom);
    const ibcToken = list && list.price && list.price.denom &&
        props.ibcTokensList && props.ibcTokensList.length &&
        props.ibcTokensList.find((val) => val && val.ibc_denom_hash && (val.ibc_denom_hash === list.price.denom));
    const amount = props.nftDetails && props.nftDetails.nftDetails && props.nftDetails.nftDetails.auction
        ? (list && list.price && list.price.amount) + (list.increment_percentage * list.price.amount)
        : list && list.price && list.price.amount;

    return (
        <div className="delist">
            <div className="delist_section">
                <div className="delist_section1">
                    {list && list.last_bid
                        ? <span className="price_text">{variables[props.lang].last_bid_price}</span>
                        : props.nftDetails && props.nftDetails.nftDetails && props.nftDetails.nftDetails.auction
                            ? <span className="price_text">{variables[props.lang].min_bid}</span>
                            : <span className="price_text">{variables[props.lang]['listed_price']}</span>}
                    {ibcToken && ibcToken.network && ibcToken.network.decimals &&
                    amount
                        ? <span className="lsr_value">
                            {amount / (10 ** ibcToken.network.decimals) + ' ' +
                                ((ibcToken && ibcToken.network && ibcToken.network.display_denom) || list.price.denom)}
                        </span>
                        : amount &&
                        tokenType && tokenType.label
                            ? <span
                                className="lsr_value">{(amount) / (10 ** config.COIN_DECIMALS) + ' ' +
                                ((tokenType && tokenType.label) || (list.price.denom))}</span> : null}
                </div>
                <Tooltip
                    classes={{ popper: 'de_list_warning_tooltip' }}
                    title={ibcToken && ibcToken.network && ibcToken.network.display_denom &&
                    ibcToken.network.display_denom === 'ATOM/CH-0'
                        ? <div className="text_content">
                            <CopyRight/>
                            {variables[props.lang]['delist_ibc_deprecated']}
                        </div> : ''}>
                    <Button
                        onClick={handleDeList}>
                        {ibcToken && ibcToken.network && ibcToken.network.display_denom &&
                        ibcToken.network.display_denom === 'ATOM/CH-0'
                            ? <CopyRight/> : null}
                        {props.nftDetails && props.nftDetails.nftDetails && props.nftDetails.nftDetails.auction
                            ? variables[props.lang]['cancel_auction']
                            : variables[props.lang].delist}
                    </Button>
                </Tooltip>
            </div>
        </div>

    );
};

DeList.propTypes = {
    hideActiveCard: PropTypes.func.isRequired,
    ibcTokensList: PropTypes.array.isRequired,
    lang: PropTypes.string.isRequired,
    showDelistDialog: PropTypes.func.isRequired,
    value: PropTypes.object.isRequired,
    nftDetails: PropTypes.object,
};

const stateToProps = (state) => {
    return {
        ibcTokensList: state.marketplace.ibcTokensList.value,
        lang: state.language,
        value: state.explore.activeCard.value,
    };
};

const actionToProps = {
    showDelistDialog,
    hideActiveCard,
};

export default withRouter(connect(stateToProps, actionToProps)(DeList));
