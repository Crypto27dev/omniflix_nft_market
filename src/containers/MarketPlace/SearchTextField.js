import * as PropTypes from 'prop-types';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import TextField from '../../components/TextField';
import variables from '../../utils/variables';
import { InputAdornment } from '@mui/material';
import Icon from '../../components/Icon';
import { fetchListings, setSearchListing } from '../../actions/marketplace';
import { DEFAULT_LIMIT, DEFAULT_SKIP } from '../../config';

const SearchTextField = (props) => {
    const [time, setTime] = useState(null);

    const handleChange = (value) => {
        props.onChange(value);

        if (time) {
            clearInterval(time);
        }

        const interval = setTimeout(() => {
            handleSearch(value);
        }, 1000);

        setTime(interval);
    };

    const handleSearch = (value) => {
        if (props.denomValue && props.denomValue.size) {
            props.fetchListings(DEFAULT_SKIP, DEFAULT_LIMIT, [...props.denomValue], null, null, props.sortBy, props.order, value);
        } else if (props.priceRangeValue && props.priceRangeValue.network &&
            props.priceRange && props.priceRange.length &&
            ((props.priceRange[0] > 0) || (props.priceRange[1] < 50000))) {
            const decimals = props.priceRangeValue && props.priceRangeValue.network &&
                (props.priceRangeValue.network.COIN_DECIMALS || props.priceRangeValue.network.decimals);
            const minValue = props.priceRange[0] * (10 ** decimals);
            const maxValue = props.priceRange[1] * (10 ** decimals);

            props.fetchListings(DEFAULT_SKIP, DEFAULT_LIMIT, [props.priceRangeValue.ibc_denom_hash || props.priceRangeValue.value], minValue, maxValue, props.sortBy, props.order, value);
        } else {
            props.fetchListings(DEFAULT_SKIP, DEFAULT_LIMIT, null, null, null, props.sortBy, props.order, value);
        }
        const marketPlace = document.getElementById('market-place-scroll');
        marketPlace.scrollTop = 0;
    };

    return (
        <TextField
            className="search_field"
            id="listing-search"
            inputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <Icon
                            className="search"
                            icon="search"/>
                    </InputAdornment>
                ),
            }}
            name="listingSearch"
            placeholder={variables[props.lang].search}
            value={props.value}
            onChange={handleChange}/>
    );
};

SearchTextField.propTypes = {
    denomValue: PropTypes.object.isRequired,
    fetchListings: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    priceRange: PropTypes.array.isRequired,
    priceRangeValue: PropTypes.object.isRequired,
    sortBy: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    order: PropTypes.string,
};

const stateToProps = (state) => {
    return {
        denomValue: state.filters.onSaleIn.value,
        lang: state.language,
        order: state.marketplace.listingSort.order,
        priceRangeValue: state.filters.priceRange.value,
        priceRange: state.filters.priceRange.range,
        sortBy: state.marketplace.listingSort.sortBy,
        value: state.marketplace.listingSearch.value,
    };
};

const actionsToProps = {
    fetchListings,
    onChange: setSearchListing,
};

export default connect(stateToProps, actionsToProps)(SearchTextField);
