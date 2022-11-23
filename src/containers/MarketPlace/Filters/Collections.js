import React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Accordions from '../../../components/Accordions';
import variables from '../../../utils/variables';
import { setCollections, setCollectionsSearch } from '../../../actions/filters';
import TextField from '../../../components/TextField';
import { Checkbox, FormControlLabel, FormGroup, InputAdornment } from '@mui/material';
import Icon from '../../../components/Icon';
import ClassNames from 'classnames';

const Collections = (props) => {
    const handleSelect = (event, value) => {
        const list = new Set(props.value);

        if (list.has(value)) {
            list.delete(value);
        } else {
            list.add(value);
        }

        props.onChange(list);
    };

    const list = props.list && props.list.length && props.search !== ''
        ? props.list.filter((value) => props.search &&
            value.toLowerCase().includes(props.search.toLowerCase()))
        : props.list;

    return (
        <Accordions name={variables[props.lang].collections}>
            <TextField
                className="search_field"
                id="collections-search"
                inputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <Icon
                                className="search"
                                icon="search"/>
                        </InputAdornment>
                    ),
                }}
                name="collectionsSearch"
                placeholder={variables[props.lang].search}
                value={props.search}
                onChange={props.onSearch}/>
            <FormGroup>
                {list.map((val) => {
                    return (
                        <FormControlLabel
                            key={val}
                            className={ClassNames('checkbox', props.value.has(val) ? 'checked' : '')}
                            control={<Checkbox
                                checked={props.value.has(val)}
                                sx={{
                                    color: '#969696',
                                    '&.Mui-checked': {
                                        color: '#FAC01E',
                                    },
                                }}
                                onChange={(event) => handleSelect(event, val)}/>}
                            label={val}/>
                    );
                })}
            </FormGroup>
        </Accordions>
    );
};

Collections.propTypes = {
    lang: PropTypes.string.isRequired,
    list: PropTypes.array.isRequired,
    search: PropTypes.string.isRequired,
    value: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        list: state.filters.collections.list,
        search: state.filters.collections.search,
        value: state.filters.collections.value,
    };
};

const actionToProps = {
    onChange: setCollections,
    onSearch: setCollectionsSearch,
};

export default connect(stateToProps, actionToProps)(Collections);
