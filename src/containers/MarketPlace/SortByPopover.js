import React, { useState } from 'react';
import { Button, Popover, Typography } from '@mui/material';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import variables from '../../utils/variables';
import downArrow from '../../assets/explore/expand more.svg';
import { DEFAULT_LIMIT, DEFAULT_SKIP } from '../../config';
import { fetchListings, setListingSort } from '../../actions/marketplace';
import SortIcon from '@mui/icons-material/Sort';

const SortByPopover = (props) => {
    const [anchorEl, setAnchorEl] = useState(false);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSort = (sortBy, order) => {
        props.setListingSort(sortBy, order);
        if (props.denomValue && props.denomValue.size) {
            props.fetchListings(DEFAULT_SKIP, DEFAULT_LIMIT, [...props.denomValue], null, null, sortBy, order, props.listingSearch);
        } else if (props.priceRangeValue && props.priceRangeValue.network &&
            props.priceRange && props.priceRange.length &&
            ((props.priceRange[0] > 0) || (props.priceRange[1] < 50000))) {
            const decimals = props.priceRangeValue && props.priceRangeValue.network &&
                (props.priceRangeValue.network.COIN_DECIMALS || props.priceRangeValue.network.decimals);
            const minValue = props.priceRange[0] * (10 ** decimals);
            const maxValue = props.priceRange[1] * (10 ** decimals);

            props.fetchListings(DEFAULT_SKIP, DEFAULT_LIMIT, [props.priceRangeValue.ibc_denom_hash || props.priceRangeValue.value], minValue, maxValue, sortBy, order, props.listingSearch);
        } else {
            props.fetchListings(DEFAULT_SKIP, DEFAULT_LIMIT, null, null, null, sortBy, order, props.listingSearch);
        }

        setAnchorEl(null);
        const marketPlace = document.getElementById('market-place-scroll');
        marketPlace.scrollTop = 0;
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <>
            <div
                aria-describedby={id}
                className="icon_button"
                onClick={handleClick}>
                <SortIcon className="sort_icon"/>
                {props.sortBy === 'created_at'
                    ? <span> Recently Listed</span>
                    : props.sortBy === 'price.amount' && props.order === 'asc'
                        ? <span>Price : Low to high</span>
                        : props.sortBy === 'price.amount' && props.order === 'desc'
                            ? <span> Price : High to low</span>
                            : <span>{variables[props.lang]['sort_by']}</span>}
                <img alt="icon" src={downArrow}/>
            </div>
            <Popover
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                className="profile_popover sort_by"
                id={id}
                open={open}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                onClose={handleClose}>
                <Typography className="tab" onClick={() => handleSort('created_at')}>
                    <Button>
                        Recently Listed
                    </Button>
                </Typography>
                <Typography className="tab" onClick={() => handleSort('price.amount', 'asc')}>
                    <Button>
                        Price: Low to high
                    </Button>
                </Typography>
                <Typography className="tab" onClick={() => handleSort('price.amount', 'desc')}>
                    <Button>
                        Price: High to low
                    </Button>
                </Typography>
            </Popover>
        </>
    );
};

SortByPopover.propTypes = {
    denomValue: PropTypes.object.isRequired,
    fetchListings: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    listingSearch: PropTypes.string.isRequired,
    priceRange: PropTypes.array.isRequired,
    priceRangeValue: PropTypes.object.isRequired,
    setListingSort: PropTypes.func.isRequired,
    order: PropTypes.string,
    sortBy: PropTypes.string,
};

const stateToProps = (state) => {
    return {
        denomValue: state.filters.onSaleIn.value,
        lang: state.language,
        listingSearch: state.marketplace.listingSearch.value,
        order: state.marketplace.listingSort.order,
        priceRangeValue: state.filters.priceRange.value,
        priceRange: state.filters.priceRange.range,
        sortBy: state.marketplace.listingSort.sortBy,
    };
};

const actionToProps = {
    fetchListings,
    setListingSort,
};

export default connect(stateToProps, actionToProps)(SortByPopover);
