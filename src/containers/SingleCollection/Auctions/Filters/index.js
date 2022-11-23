import React from 'react';
import '../../../MarketPlace/Filters/index.css';
import variables from '../../../../utils/variables';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ReactComponent as BackIcon } from '../../../../assets/explore/Vector.svg';
import { IconButton } from '@mui/material';
import PriceRange from './PriceRange';
import ClassNames from 'classnames';
import OnSaleIn from './OnSaleIn';
import DotsLoading from '../../../../components/DotsLoading';
import SearchTextField from '../../SearchListedTextField';
import { hideCollectionAuctionFilters } from '../../../../actions/auctions/filters';
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
                <SearchTextField/>
                <PriceRange activeTab={this.props.activeTab}/>
                {this.props.ibcTokensListInProgress
                    ? <DotsLoading/>
                    : <OnSaleIn activeTab={this.props.activeTab}/>}
                <AuctionTypes/>
            </div>
        );
    }
}

Filters.propTypes = {
    activeTab: PropTypes.string.isRequired,
    filterShow: PropTypes.bool.isRequired,
    hideFilters: PropTypes.func.isRequired,
    ibcTokensListInProgress: PropTypes.bool.isRequired,
    lang: PropTypes.string.isRequired,
};

const stateToProps = (state) => {
    return {
        filterShow: state.auctions.filters.showCA,
        lang: state.language,
        ibcTokensListInProgress: state.marketplace.ibcTokensList.inProgress,
    };
};

const actionToProps = {
    hideFilters: hideCollectionAuctionFilters,
};

export default connect(stateToProps, actionToProps)(Filters);
