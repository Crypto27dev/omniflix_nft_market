import React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Accordions from '../../../components/Accordions';
import variables from '../../../utils/variables';
import { setOnSaleIn, setPriceRange, setPriceRangeCoin } from '../../../actions/filters';
import SelectField from '../../../components/SelectField/TokenSelectField';
import { Slider } from '@mui/material';
import TextField from '../../../components/TextField';
import { tokensList } from '../../../utils/defaultOptions';
import { DEFAULT_LIMIT, DEFAULT_SKIP } from '../../../config';
import { fetchListings } from '../../../actions/marketplace';
import { images } from '../../../components/NetworkImages/ImagesOptions';

const minDistance = 10;

const PriceRange = (props) => {
    const handlePriceRange = (event, newValue, activeThumb) => {
        if (!Array.isArray(newValue)) {
            return;
        }

        if (newValue[1] - newValue[0] < minDistance) {
            if (activeThumb === 0) {
                const clamped = Math.min(newValue[0], props.max - minDistance);
                props.setPriceRange([clamped, clamped + minDistance]);
                if (props.value) {
                    const decimals = props.value && props.value.network &&
                        (props.value.network.COIN_DECIMALS || props.value.network.decimals);
                    const minValue = clamped * (10 ** decimals);
                    const maxValue = (clamped + minDistance) * (10 ** decimals);

                    props.fetchListings(DEFAULT_SKIP, DEFAULT_LIMIT, [props.value.ibc_denom_hash || props.value.value], minValue, maxValue, props.sortBy, props.order);
                }
            } else {
                const clamped = Math.max(newValue[1], minDistance);
                props.setPriceRange([clamped - minDistance, clamped]);
                if (props.value) {
                    const decimals = props.value && props.value.network &&
                        (props.value.network.COIN_DECIMALS || props.value.network.decimals);
                    const minValue = (clamped - minDistance) * (10 ** decimals);
                    const maxValue = clamped * (10 ** decimals);

                    props.fetchListings(DEFAULT_SKIP, DEFAULT_LIMIT, [props.value.ibc_denom_hash || props.value.value], minValue, maxValue, props.sortBy, props.order);
                }
            }
        } else {
            props.setPriceRange(newValue);
            if (props.value) {
                const decimals = props.value && props.value.network &&
                    (props.value.network.COIN_DECIMALS || props.value.network.decimals);
                const minValue = newValue[0] * (10 ** decimals);
                const maxValue = newValue[1] * (10 ** decimals);

                props.fetchListings(DEFAULT_SKIP, DEFAULT_LIMIT, [props.value.ibc_denom_hash || props.value.value], minValue, maxValue, props.sortBy, props.order);
            }
        }
        if (props.onSaleIn.size) {
            props.setOnSaleIn(new Set());
        }
    };

    const handleMin = (value) => {
        const array = [parseFloat(value), props.range[1]];
        props.setPriceRange(array);

        if (props.value) {
            const decimals = props.value && props.value.network &&
                (props.value.network.COIN_DECIMALS || props.value.network.decimals);
            const minValue = value * (10 ** decimals);
            const maxValue = props.range[1] * (10 ** decimals);

            props.fetchListings(DEFAULT_SKIP, DEFAULT_LIMIT, [props.value.ibc_denom_hash || props.value.value], minValue, maxValue, props.sortBy, props.order);
        }
        if (props.onSaleIn.size) {
            props.setOnSaleIn(new Set());
        }
    };

    const handleMax = (value) => {
        const array = [props.range[0], parseFloat(value)];
        props.setPriceRange(array);

        if (props.value) {
            const decimals = props.value && props.value.network &&
                (props.value.network.COIN_DECIMALS || props.value.network.decimals);
            const minValue = props.range[0] * (10 ** decimals);
            const maxValue = value * (10 ** decimals);

            props.fetchListings(DEFAULT_SKIP, DEFAULT_LIMIT, [props.value.ibc_denom_hash || props.value.value], minValue, maxValue, props.sortBy, props.order);
        }
        if (props.onSaleIn.size) {
            props.setOnSaleIn(new Set());
        }
    };

    const handleChange = (e) => {
        props.onChange(e);

        if (props.range && props.range.length) {
            const decimals = e && e.network &&
                (e.network.COIN_DECIMALS || e.network.decimals);
            const minValue = props.range[0] * (10 ** decimals);
            const maxValue = props.range[1] * (10 ** decimals);

            props.fetchListings(DEFAULT_SKIP, DEFAULT_LIMIT, [e.ibc_denom_hash || e.value], minValue, maxValue, props.sortBy, props.order);
        } else {
            props.fetchListings(DEFAULT_SKIP, DEFAULT_LIMIT, [e.ibc_denom_hash || e.value], null, null, props.sortBy, props.order);
        }

        if (props.onSaleIn.size) {
            props.setOnSaleIn(new Set());
        }
    };

    const options = [...tokensList];
    if (props.ibcTokensList && props.ibcTokensList.length) {
        options.push(...props.ibcTokensList);
    }

    return (
        <Accordions className="price_range" name={variables[props.lang]['price_range']}>
            <SelectField
                id="select-token"
                images={images}
                name={variables[props.lang]['select_token']}
                options={options}
                value={props.value}
                onChange={(event) => handleChange(event)}/>
            <Slider
                disableSwap
                className="range_slider"
                max={props.max}
                min={props.min}
                step={1}
                value={props.range}
                onChange={handlePriceRange}/>
            <div className="text_field_range">
                <TextField
                    id="min-range"
                    name="minRange"
                    placeholder={variables[props.lang]['min_range']}
                    type="number"
                    value={props.range[0]}
                    onChange={handleMin}/>
                <p>{variables[props.lang].to}</p>
                <TextField
                    id="max-range"
                    name="maxRange"
                    placeholder={variables[props.lang]['max_range']}
                    type="number"
                    value={props.range[1]}
                    onChange={handleMax}/>
            </div>
        </Accordions>
    );
};

PriceRange.propTypes = {
    fetchListings: PropTypes.func.isRequired,
    ibcTokensList: PropTypes.array.isRequired,
    ibcTokensListInProgress: PropTypes.bool.isRequired,
    lang: PropTypes.string.isRequired,
    list: PropTypes.array.isRequired,
    marketPlaceTab: PropTypes.string.isRequired,
    max: PropTypes.number.isRequired,
    min: PropTypes.number.isRequired,
    range: PropTypes.array.isRequired,
    setOnSaleIn: PropTypes.func.isRequired,
    setPriceRange: PropTypes.func.isRequired,
    sortBy: PropTypes.string.isRequired,
    value: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onSaleIn: PropTypes.object.isRequired,
    order: PropTypes.string,
};

const stateToProps = (state) => {
    return {
        ibcTokensList: state.marketplace.ibcTokensList.value,
        ibcTokensListInProgress: state.marketplace.ibcTokensList.inProgress,
        lang: state.language,
        list: state.filters.priceRange.list,
        max: state.filters.priceRange.max,
        min: state.filters.priceRange.min,
        onSaleIn: state.filters.onSaleIn.value,
        order: state.marketplace.listingSort.order,
        range: state.filters.priceRange.range,
        sortBy: state.marketplace.listingSort.sortBy,
        value: state.filters.priceRange.value,
        marketPlaceTab: state.marketplace.marketPlaceTab.value,
    };
};

const actionToProps = {
    fetchListings,
    onChange: setPriceRangeCoin,
    setOnSaleIn,
    setPriceRange,
};

export default connect(stateToProps, actionToProps)(PriceRange);
