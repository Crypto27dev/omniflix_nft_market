import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React from 'react';
import variables from '../../../utils/variables';
import { Button } from '@mui/material';
import './index.css';
import { hideActiveCard } from '../../../actions/explore';

const Tabs = (props) => {
    const handleClick = (value) => {
        props.onClick(value);
        props.hideActiveCard();
    };

    return (
        <div className="marketplace_tabs">
            <Button
                className={props.value === 'collect_now' ? 'active_tab' : ''}
                onClick={() => handleClick('collect_now')}>
                <p>{variables[props.lang]['collect_now']}
                    {' ' + (props.statsData && props.statsData.active_listings ? `(${props.statsData.active_listings})` : '')}</p>
            </Button>
            <Button
                className={props.value === 'auctions' ? 'active_tab' : ''}
                onClick={() => handleClick('auctions')}>
                <p>{variables[props.lang].auctions}
                    {' ' + (props.statsData && props.statsData.active_auctions ? `(${props.statsData.active_auctions})` : '')}</p>
            </Button>
            <Button
                className={props.value === 'launchpad' ? 'active_tab' : ''}
                onClick={() => handleClick('launchpad')}>
                <p>{variables[props.lang].launchpad}
                    {' ' + (props.statsData && props.statsData.launchpad_collections ? `(${props.statsData.launchpad_collections})` : '')}</p>
            </Button>
        </div>
    );
};

Tabs.propTypes = {
    hideActiveCard: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    statsData: PropTypes.object.isRequired,
    value: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    auctionListingsTotal: PropTypes.number,
    listingsTotal: PropTypes.number,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        value: state.marketplace.marketPlaceTab.value,
        listingsTotal: state.marketplace.listings.total,
        auctionListingsTotal: state.auctions.auctionListings.total,
    };
};

const actionsToProps = {
    hideActiveCard,
};

export default connect(stateToProps, actionsToProps)(Tabs);
