import React from 'react';
import '../../Filters/index.css';
import variables from '../../../../utils/variables';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ReactComponent as BackIcon } from '../../../../assets/explore/Vector.svg';
import { IconButton } from '@mui/material';
import PriceRange from './PriceRange';
import ClassNames from 'classnames';
import OnSaleIn from './OnSaleIn';
import DotsLoading from '../../../../components/DotsLoading';
import { hideListingAuctionFilters } from '../../../../actions/auctions/filters';
import AuctionTypes from './AuctionTypes';

class Filters extends React.Component {
    render () {
        return (
            <div className={ClassNames('filters scroll_bar', this.props.filterShow ? 'show' : '')}>
                <div className="heading">
                    <p>{variables[this.props.lang].filters}</p>
                    <IconButton onClick={this.props.hideFilters}>
                        <BackIcon/>
                    </IconButton>
                </div>
                <PriceRange/>
                {this.props.ibcTokensListInProgress
                    ? <DotsLoading/>
                    : <OnSaleIn/>}
                <AuctionTypes/>
            </div>
        );
    }
}

Filters.propTypes = {
    filterShow: PropTypes.bool.isRequired,
    hideFilters: PropTypes.func.isRequired,
    ibcTokensListInProgress: PropTypes.bool.isRequired,
    lang: PropTypes.string.isRequired,
};

const stateToProps = (state) => {
    return {
        filterShow: state.auctions.filters.showLA,
        lang: state.language,
        ibcTokensListInProgress: state.marketplace.ibcTokensList.inProgress,
    };
};

const actionToProps = {
    hideFilters: hideListingAuctionFilters,
};

export default connect(stateToProps, actionToProps)(Filters);
