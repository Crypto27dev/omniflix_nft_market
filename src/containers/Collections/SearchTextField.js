import * as PropTypes from 'prop-types';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import TextField from '../../components/TextField';
import variables from '../../utils/variables';
import { InputAdornment } from '@mui/material';
import Icon from '../../components/Icon';
import { fetchCollections, setSearchCollections } from '../../actions/marketplace';
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
        props.fetchCollections(props.address, DEFAULT_SKIP, DEFAULT_LIMIT, value);
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
    fetchCollections: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

const stateToProps = (state) => {
    return {
        address: state.account.wallet.connection.address,
        lang: state.language,
        value: state.marketplace.collectionsSearch.value,
    };
};

const actionsToProps = {
    onChange: setSearchCollections,
    fetchCollections,
};

export default connect(stateToProps, actionsToProps)(SearchTextField);
