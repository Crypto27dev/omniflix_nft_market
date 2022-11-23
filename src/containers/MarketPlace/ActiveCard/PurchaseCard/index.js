import React from 'react';
import './index.css';
// import PurchaseTab from './PurchaseTab';
// import ValidityTab from './ValidityTab';
import * as PropTypes from 'prop-types';
import { config } from '../../../../config';
import { tokensList } from '../../../../utils/defaultOptions';
import BuyNFTButton from './BuyNFTButton';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { formatCount } from '../../../../utils/price';

class PurchaseCard extends React.Component {
    render () {
        const item = this.props.value && this.props.value.nftDetails && this.props.value.nftDetails.list;
        const tokenType = item && item.price && item.price.denom &&
            tokensList.find((val) => val.value === item.price.denom);
        const ibcToken = item && item.price && item.price.denom &&
            this.props.ibcTokensList && this.props.ibcTokensList.length &&
            this.props.ibcTokensList.find((val) => val && val.ibc_denom_hash && (val.ibc_denom_hash === item.price.denom));

        return (
            <div className="purchase_card">
                <div className="purchase_card_s4">
                    <span className="price_text">Current Price</span>
                    {ibcToken && ibcToken.network && ibcToken.network.decimals &&
                    item && item.price && item.price.amount
                        ? <span className="lsr_value">
                            {(item.price.amount / (10 ** ibcToken.network.decimals)) > 100
                                ? formatCount(item.price.amount / (10 ** ibcToken.network.decimals), true)
                                : item.price.amount / (10 ** ibcToken.network.decimals)}
                            {' ' + ((ibcToken && ibcToken.network && ibcToken.network.display_denom) || item.price.denom)}
                        </span>
                        : <span className="lsr_value">
                            {((item.price && item.price.amount) / (10 ** config.COIN_DECIMALS)) > 100
                                ? formatCount((item.price && item.price.amount) / (10 ** config.COIN_DECIMALS), true)
                                : (item.price && item.price.amount) / (10 ** config.COIN_DECIMALS)}
                            {' ' + ((tokenType && tokenType.label) || (item.price && item.price.denom))}
                        </span>}
                </div>
                <BuyNFTButton value={this.props.value}/>
                {/* <div className="purchase_card_s1"> */}
                {/*    <span>Choose Purchase</span> */}
                {/*    <PurchaseTab/> */}
                {/* </div> */}
                {/* <div className="purchase_card_s2"> */}
                {/*    <h2>Rent asset to watch</h2> */}
                {/*    <span>lorem ipsum lines on rent</span> */}
                {/* </div> */}
                {/* <div className="purchase_card_s3"> */}
                {/*    <span>Validity</span> */}
                {/*    <ValidityTab/> */}
                {/* </div> */}
                {/* <div className="purchase_card_s4"> */}
                {/*    <span>Quality</span> */}
                {/*    <span> Original</span> */}
                {/* </div> */}
            </div>
        );
    }
}

PurchaseCard.propTypes = {
    ibcTokensList: PropTypes.array.isRequired,
    ibcTokensListInProgress: PropTypes.bool.isRequired,
    value: PropTypes.object.isRequired,
};

const stateToProps = (state) => {
    return {
        ibcTokensList: state.marketplace.ibcTokensList.value,
        ibcTokensListInProgress: state.marketplace.ibcTokensList.inProgress,
    };
};

export default withRouter(connect(stateToProps)(PurchaseCard));
