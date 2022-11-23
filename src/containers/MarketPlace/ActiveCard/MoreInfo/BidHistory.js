import React from 'react';
import * as PropTypes from 'prop-types';
import moment from 'moment';
import { tokensList } from '../../../../utils/defaultOptions';
import { connect } from 'react-redux';
import { config } from '../../../../config';
import { withRouter } from 'react-router-dom';

const BidHistory = (props) => {
    const handleClick = (value, address) => {
        if (value === 'address') {
            props.history.push('/account/' + address + '/nfts');
        }
    };

    return (
        <div className="activity">
            {props.list && props.list.length > 0
                ? props.list.map((item, index) => {
                    const tokenType = item && item.price && item.price.denom
                        ? tokensList.find((val) => val.value === item.price.denom)
                        : item && item.amount && item.amount.denom
                            ? tokensList.find((val) => val.value === item.amount.denom)
                            : null;
                    const ibcToken = item && item.price && item.price.denom &&
                    props.ibcTokensList && props.ibcTokensList.length
                        ? props.ibcTokensList.find((val) => val && val.ibc_denom_hash && (val.ibc_denom_hash === item.price.denom))
                        : item && item.amount && item.amount.denom &&
                        props.ibcTokensList && props.ibcTokensList.length &&
                        props.ibcTokensList.find((val) => val && val.ibc_denom_hash && (val.ibc_denom_hash === item.amount.denom));

                    const displayDenom = ibcToken && ibcToken.network && ibcToken.network.display_denom
                        ? ibcToken.network.display_denom : config.COIN_DENOM;

                    return (
                        <div key={index} className="activity_row">
                            <div className="left_section">
                                {/* <span></span> */}
                                <div className="left_details">
                                    <div className="activity_action">
                                        <span> Bid</span>
                                        <p className="status_post status_bid">
                                            <span>{(item.status).toLocaleLowerCase()}</span>
                                            <span>at</span>
                                        </p>
                                        <div>
                                            {ibcToken && ibcToken.network && ibcToken.network.decimals &&
                                            item && item.price && item.price.amount
                                                ? <span className="lsr_value">
                                                    {item.price.amount / (10 ** ibcToken.network.decimals) + ' ' +
                                                        (displayDenom || item.price.denom)}
                                                </span>
                                                : item && item.price && item.price.amount &&
                                                tokenType && tokenType.label
                                                    ? <span
                                                        className="lsr_value">{(item.price.amount) / (10 ** config.COIN_DECIMALS) + ' ' +
                                                        (displayDenom || (tokenType && tokenType.label) || (item.price.denom))}</span>
                                                    : item && item.amount && item.amount.amount && item.amount.denom
                                                        ? <span
                                                            className="lsr_value">{(item.amount.amount) / (10 ** config.COIN_DECIMALS) + ' ' +
                                                            (displayDenom || (tokenType && tokenType.label) || (item.amount.denom))}</span>
                                                        : null}
                                        </div>
                                    </div>
                                    {item.bidder
                                        ? <div className="activity_by">
                                            <span>by</span>
                                            <a
                                                className="hash_text hover_me"
                                                href={'/account/' + item.bidder + '/nfts'}
                                                title={item.bidder}
                                                onClick={() => handleClick('address', item.bidder)}>
                                                <p className="name">{item.bidder}</p>
                                                {item.bidder && item.bidder.slice(item.bidder.length - 4, item.bidder.length)}
                                            </a>
                                        </div>
                                        : item.owner
                                            ? <div className="activity_by">
                                                <span>by</span>
                                                <a
                                                    className="hash_text hover_me"
                                                    href={'/account/' + item.owner + '/nfts'}
                                                    title={item.owner}
                                                    onClick={() => handleClick('address', item.owner)}>
                                                    <p className="name">{item.owner}</p>
                                                    {item.owner && item.owner.slice(item.owner.length - 4, item.owner.length)}
                                                </a>
                                            </div>
                                            : null}
                                </div>
                            </div>
                            <div className="right_section">
                                <span>{item.created_at && moment(item.created_at).fromNow()}</span>
                            </div>
                        </div>
                    );
                }) : null
            }
        </div>
    );
};

BidHistory.propTypes = {
    address: PropTypes.string.isRequired,
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
    }).isRequired,
    ibcTokensList: PropTypes.array.isRequired,
    list: PropTypes.array.isRequired,
    handleScroll: PropTypes.func,
};

const stateToProps = (state) => {
    return {
        address: state.account.wallet.connection.address,
        ibcTokensList: state.marketplace.ibcTokensList.value,
        lang: state.language,
        value: state.explore.activeCard.value,
    };
};

export default withRouter(connect(stateToProps)(BidHistory));
