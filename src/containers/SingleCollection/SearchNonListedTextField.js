import * as PropTypes from 'prop-types';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import TextField from '../../components/TextField';
import variables from '../../utils/variables';
import { InputAdornment } from '@mui/material';
import Icon from '../../components/Icon';
import { DEFAULT_LIMIT, DEFAULT_SKIP } from '../../config';
import { fetchNonListedCollectionNFTs, setNonListedSearch } from '../../actions/collections';
import { withRouter } from 'react-router';

const SearchNonListedTextField = (props) => {
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
        props.fetchNonListedCollectionNFTs(route, DEFAULT_SKIP, DEFAULT_LIMIT, value);
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

SearchNonListedTextField.propTypes = {
    denomValue: PropTypes.object.isRequired,
    fetchNonListedCollectionNFTs: PropTypes.func.isRequired,
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
        denomValue: state.collection.filters.onSaleInCollection.value,
        lang: state.language,
        priceRangeValue: state.collection.filters.priceRangeCollection.value,
        priceRange: state.collection.filters.priceRangeCollection.range,
        sortBy: state.collection.collectionNFTsSort.sortBy,
        order: state.collection.collectionNFTsSort.order,
        value: state.collection.nonListedSearch.value,
    };
};

const actionsToProps = {
    fetchNonListedCollectionNFTs,
    onChange: setNonListedSearch,
};

export default withRouter(connect(stateToProps, actionsToProps)(SearchNonListedTextField));
