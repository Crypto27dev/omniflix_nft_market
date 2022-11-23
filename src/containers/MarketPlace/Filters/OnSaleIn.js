import React, { useState } from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Accordions from '../../../components/Accordions';
import variables from '../../../utils/variables';
import { setOnSaleIn, setOnSaleInSearch, setPriceRange } from '../../../actions/filters';
import TextField from '../../../components/TextField';
import { Checkbox, FormControlLabel, FormGroup, InputAdornment } from '@mui/material';
import Icon from '../../../components/Icon';
import ClassNames from 'classnames';
import { tokensList } from '../../../utils/defaultOptions';
import { DEFAULT_LIMIT, DEFAULT_SKIP } from '../../../config';
import { fetchListings } from '../../../actions/marketplace';

const OnSaleIn = (props) => {
    const [options, setOptions] = useState([...tokensList, ...props.ibcTokensList]);

    const handleSelect = (event, value) => {
        const list = new Set(props.value);

        if (list.has(value)) {
            list.delete(value);
        } else {
            list.add(value);
        }

        props.onChange(list);
        props.setPriceRange([0, 50000]);
        props.fetchListings(DEFAULT_SKIP, DEFAULT_LIMIT, [...list], null, null, props.sortBy, props.order, props.listingSearch);
        if (props.search !== '') {
            props.onSearch('');
            setOptions([...tokensList, ...props.ibcTokensList]);
        }
    };

    const handleSearch = (value) => {
        props.onSearch(value);

        let searchOptions = options.filter((item) => (item.label && item.label.indexOf(value.toUpperCase()) > -1) ||
            (item.network && item.network.display_denom && (item.network.display_denom.indexOf(value.toUpperCase()) > -1)));

        if (value === '') {
            searchOptions = [...tokensList, ...props.ibcTokensList];
        }

        setOptions(searchOptions);
    };

    return (
        <Accordions name={variables[props.lang]['on_sale_in']}>
            <TextField
                className="search_field"
                id="on-sale-in-search"
                inputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <Icon
                                className="search"
                                icon="search"/>
                        </InputAdornment>
                    ),
                }}
                name="onSaleSearch"
                placeholder={variables[props.lang].search}
                value={props.search}
                onChange={(e) => handleSearch(e)}/>
            <FormGroup>
                {options && options.length
                    ? options.map((val) => {
                        const value = val && val.ibc_denom_hash
                            ? val.ibc_denom_hash
                            : val.value;
                        const label = val.network && val.network.display_denom ? val.network.display_denom : val.label;

                        return (
                            <FormControlLabel
                                key={value}
                                className={ClassNames('checkbox', props.value.has(value) ? 'checked' : '')}
                                control={<Checkbox
                                    checked={props.value.has(value)}
                                    sx={{
                                        color: '#969696',
                                        '&.Mui-checked': {
                                            color: '#FAC01E',
                                        },
                                    }}
                                    onChange={(event) => handleSelect(event, value)}/>}
                                label={label}/>
                        );
                    }) : null}
            </FormGroup>
        </Accordions>
    );
};

OnSaleIn.propTypes = {
    fetchListings: PropTypes.func.isRequired,
    ibcTokensList: PropTypes.array.isRequired,
    ibcTokensListInProgress: PropTypes.bool.isRequired,
    lang: PropTypes.string.isRequired,
    list: PropTypes.array.isRequired,
    listingSearch: PropTypes.string.isRequired,
    marketPlaceTab: PropTypes.string.isRequired,
    search: PropTypes.string.isRequired,
    setPriceRange: PropTypes.func.isRequired,
    sortBy: PropTypes.string.isRequired,
    value: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired,
    order: PropTypes.string,
};

const stateToProps = (state) => {
    return {
        ibcTokensList: state.marketplace.ibcTokensList.value,
        ibcTokensListInProgress: state.marketplace.ibcTokensList.inProgress,
        lang: state.language,
        list: state.filters.onSaleIn.list,
        listingSearch: state.marketplace.listingSearch.value,
        order: state.marketplace.listingSort.order,
        search: state.filters.onSaleIn.search,
        sortBy: state.marketplace.listingSort.sortBy,
        value: state.filters.onSaleIn.value,
        marketPlaceTab: state.marketplace.marketPlaceTab.value,
    };
};

const actionToProps = {
    fetchListings,
    onChange: setOnSaleIn,
    onSearch: setOnSaleInSearch,
    setPriceRange,
};

export default connect(stateToProps, actionToProps)(OnSaleIn);
