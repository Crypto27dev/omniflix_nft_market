import * as PropTypes from 'prop-types';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import TextField from '../../../components/TextField';
import variables from '../../../utils/variables';
import { InputAdornment } from '@mui/material';
import Icon from '../../../components/Icon';
import { DEFAULT_LIMIT, DEFAULT_SKIP } from '../../../config';
import { setSearchLaunchpadCollection } from '../../../actions/home';
import { fetchLaunchpadCollectionsList } from '../../../actions/marketplace';

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
        if (props.address) {
            props.fetchLaunchpadCollections(props.address, DEFAULT_SKIP, DEFAULT_LIMIT, value);
        } else {
            props.fetchLaunchpadCollections(null, DEFAULT_SKIP, DEFAULT_LIMIT, value);
        }

        const marketPlace = document.getElementById('market-place-scroll');
        marketPlace.scrollTop = 0;
    };

    return (
        <TextField
            className="search_field"
            id="launchpad-search"
            inputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <Icon
                            className="search"
                            icon="search"/>
                    </InputAdornment>
                ),
            }}
            name="launchpadSearch"
            placeholder={variables[props.lang].search}
            value={props.value}
            onChange={handleChange}/>
    );
};

SearchTextField.propTypes = {
    address: PropTypes.string.isRequired,
    fetchLaunchpadCollections: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

const stateToProps = (state) => {
    return {
        address: state.account.wallet.connection.address,
        lang: state.language,
        value: state.home.launchpadCollectionSearch.value,
    };
};

const actionsToProps = {
    fetchLaunchpadCollections: fetchLaunchpadCollectionsList,
    onChange: setSearchLaunchpadCollection,
};

export default connect(stateToProps, actionsToProps)(SearchTextField);
