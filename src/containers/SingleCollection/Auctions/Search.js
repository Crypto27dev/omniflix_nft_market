import * as PropTypes from 'prop-types';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import TextField from '../../../components/TextField';
import variables from '../../../utils/variables';
import { InputAdornment } from '@mui/material';
import Icon from '../../../components/Icon';
import { DEFAULT_LIMIT, DEFAULT_SKIP } from '../../../config';
import { fetchCollectionAuctions, setCollectionAuctionSearch } from '../../../actions/collections';
import { withRouter } from 'react-router';

const SearchTextField = (props) => {
    const [time, setTime] = useState(null);
    const route = props.match && props.match.params && props.match.params.id;

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
            props.fetchCollectionAuctions(route, DEFAULT_SKIP, DEFAULT_LIMIT, [...props.denomValue], null, null, props.auctionsTypeCA, props.address, props.sortBy, props.order, value);
        } else if (props.priceRangeValue && props.priceRangeValue.network &&
            props.priceRange && props.priceRange.length &&
            ((props.priceRange[0] > 0) || (props.priceRange[1] < 50000))) {
            const decimals = props.priceRangeValue && props.priceRangeValue.network &&
                (props.priceRangeValue.network.COIN_DECIMALS || props.priceRangeValue.network.decimals);
            const minValue = props.priceRange[0] * (10 ** decimals);
            const maxValue = props.priceRange[1] * (10 ** decimals);

            props.fetchCollectionAuctions(route, DEFAULT_SKIP, DEFAULT_LIMIT, [props.priceRangeValue.ibc_denom_hash || props.priceRangeValue.value], minValue, maxValue, props.auctionsTypeCA, props.address, props.sortBy, props.order, value);
        } else {
            props.fetchCollectionAuctions(route, DEFAULT_SKIP, DEFAULT_LIMIT, null, null, null, props.auctionsTypeCA, props.address, props.sortBy, props.order, value);
        }
        window.scroll(0, 0);
    };

    return (
        <TextField
            className="search_field"
            id="listed-search"
            inputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <Icon
                            className="search"
                            icon="search"/>
                    </InputAdornment>
                ),
            }}
            name="listedSearch"
            placeholder={variables[props.lang].search}
            value={props.value}
            onChange={handleChange}/>
    );
};

SearchTextField.propTypes = {
    address: PropTypes.string.isRequired,
    auctionsTypeCA: PropTypes.string.isRequired,
    denomValue: PropTypes.object.isRequired,
    fetchCollectionAuctions: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    match: PropTypes.shape({
        params: PropTypes.shape({
            id: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
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
        denomValue: state.auctions.filters.onSaleInCA.value,
        lang: state.language,
        priceRangeValue: state.auctions.filters.priceRangeCA.value,
        priceRange: state.auctions.filters.priceRangeCA.range,
        auctionsTypeCA: state.auctions.filters.auctionsTypeCA,
        sortBy: state.collection.collectionAuctionsSort.sortBy,
        order: state.collection.collectionAuctionsSort.order,
        value: state.collection.collectionAuctionSearch.value,
    };
};

const actionsToProps = {
    fetchCollectionAuctions,
    onChange: setCollectionAuctionSearch,
};

export default withRouter(connect(stateToProps, actionsToProps)(SearchTextField));
