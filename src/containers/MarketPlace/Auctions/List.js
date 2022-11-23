import React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Card from './Card';
import { hideListingAuctionFilters } from '../../../actions/auctions/filters';

const AuctionsList = (props) => {
    return (
        <>
            {props.auctionListings.map((item, index) => {
                return <Card
                    key={index} filterShow={props.filterShowLA} hideFilters={props.hideListingAuctionFilters}
                    index={index} item={item}/>;
            })}
        </>
    );
};

AuctionsList.propTypes = {
    auctionListings: PropTypes.array.isRequired,
    filterShowLA: PropTypes.bool.isRequired,
    hideListingAuctionFilters: PropTypes.func.isRequired,
};

const stateToProps = (state) => {
    return {
        auctionListings: state.auctions.auctionListings.result,
        filterShowLA: state.auctions.filters.showLA,
    };
};

const actionToProps = {
    hideListingAuctionFilters,
};

export default withRouter(connect(stateToProps, actionToProps)(AuctionsList));
