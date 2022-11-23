import React from 'react';
import './index.css';
import '../PurchaseCard/index.css';
import * as PropTypes from 'prop-types';
import { config } from '../../../../config';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { formatCount } from '../../../../utils/price';
import PlaceBidButton from './PlaceBidButton';
import variables from '../../../../utils/variables';
import { mathCeilDecimals } from '../../../../utils/numbers';

class PlaceBid extends React.Component {
    render () {
        const item = this.props.value && this.props.value.nftDetails && this.props.value.nftDetails.auction;
        const ibcToken = item && item.price && item.price.denom &&
            this.props.ibcTokensList && this.props.ibcTokensList.length &&
            this.props.ibcTokensList.find((val) => val && val.ibc_denom_hash && (val.ibc_denom_hash === item.price.denom));
        const decimals = ibcToken && ibcToken.network && ibcToken.network.decimals
            ? ibcToken.network.decimals
            : config.COIN_DECIMALS;
        const displayDenom = ibcToken && ibcToken.network && ibcToken.network.display_denom
            ? ibcToken.network.display_denom : config.COIN_DENOM;
        let amount = item && item.price && item.price.amount;
        amount = amount / (10 ** decimals);
        amount = mathCeilDecimals(amount, 2);

        if ((amount / (10 ** decimals)) > 100) {
            amount = formatCount(amount / (10 ** decimals), true);
        }

        return (
            <div className="purchase_card">
                <div className="purchase_card_s4">
                    {(item && item.auction && item.auction.last_bid) ||
                    (item && item.last_bid)
                        ? <span className="price_text">{variables[this.props.lang].last_bid_price}</span>
                        : <span className="price_text">{variables[this.props.lang].min_bid}</span>}
                    <span className="lsr_value">
                        {amount}
                        {' ' + displayDenom}
                    </span>
                </div>
                <PlaceBidButton owner={this.props.owner} singleNft={this.props.singleNft} value={this.props.value}/>
            </div>
        );
    }
}

PlaceBid.propTypes = {
    ibcTokensList: PropTypes.array.isRequired,
    ibcTokensListInProgress: PropTypes.bool.isRequired,
    lang: PropTypes.string.isRequired,
    value: PropTypes.object.isRequired,
    owner: PropTypes.bool,
    singleNft: PropTypes.bool,
};

const stateToProps = (state) => {
    return {
        ibcTokensList: state.marketplace.ibcTokensList.value,
        ibcTokensListInProgress: state.marketplace.ibcTokensList.inProgress,
        lang: state.language,
    };
};

export default withRouter(connect(stateToProps)(PlaceBid));
