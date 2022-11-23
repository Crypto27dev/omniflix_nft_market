import * as PropTypes from 'prop-types';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import TextField from '../../../components/TextField';
import variables from '../../../utils/variables';
import { InputAdornment } from '@mui/material';
import Icon from '../../../components/Icon';
import { DEFAULT_LIMIT, DEFAULT_SKIP } from '../../../config';
import { fetchAuctionsListings, setSearchAuction } from '../../../actions/auctions';

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
            props.fetchAuctionsListings(DEFAULT_SKIP, DEFAULT_LIMIT, [...props.denomValue], null, null,
                props.auctionsTypeLA, props.address, props.sortBy, props.order, value);
        } else if (props.priceRangeValue && props.priceRangeValue.network &&
            props.priceRange && props.priceRange.length &&
            ((props.priceRange[0] > 0) || (props.priceRange[1] < 50000))) {
            const decimals = props.priceRangeValue && props.priceRangeValue.network &&
                (props.priceRangeValue.network.COIN_DECIMALS || props.priceRangeValue.network.decimals);
            const minValue = props.priceRange[0] * (10 ** decimals);
            const maxValue = props.priceRange[1] * (10 ** decimals);

            props.fetchAuctionsListings(DEFAULT_SKIP, DEFAULT_LIMIT, [props.priceRangeValue.ibc_denom_hash || props.priceRangeValue.value],
                minValue, maxValue, props.auctionsTypeLA, props.address, props.sortBy, props.order, value);
        } else {
            props.fetchAuctionsListings(DEFAULT_SKIP, DEFAULT_LIMIT, null, null, null,
                props.auctionsTypeLA, props.address, props.sortBy, props.order, value);
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
    address: PropTypes.string.isRequired,
    auctionsTypeLA: PropTypes.string.isRequired,
    denomValue: PropTypes.object.isRequired,
    fetchAuctionsListings: PropTypes.func.isRequired,
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
        address: state.account.wallet.connection.address,
        denomValue: state.auctions.filters.onSaleInLA.value,
        lang: state.language,
        order: state.auctions.sort.order,
        auctionsTypeLA: state.auctions.filters.auctionsTypeLA,
        priceRangeValue: state.auctions.filters.priceRangeLA.value,
        priceRange: state.auctions.filters.priceRangeLA.range,
        sortBy: state.auctions.sort.sortBy,
        value: state.auctions.search.value,
    };
};

const actionsToProps = {
    fetchAuctionsListings,
    onChange: setSearchAuction,
};

export default connect(stateToProps, actionsToProps)(SearchTextField);
