import React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Accordions from '../../../components/Accordions';
import variables from '../../../utils/variables';
import { setTypes, setTypesSearch } from '../../../actions/filters';
import TextField from '../../../components/TextField';
import { InputAdornment } from '@mui/material';
import Icon from '../../../components/Icon';

const Types = (props) => {
    const handleSelect = (value) => {
        const list = new Set(props.value);

        if (list.has(value)) {
            list.delete(value);
        } else {
            list.add(value);
        }

        props.onChange(list);
    };

    const list = props.list && props.list.length && props.search !== ''
        ? props.list.filter((value) => value.name && props.search &&
            value.name.toLowerCase().includes(props.search.toLowerCase()))
        : props.list;

    return (
        <Accordions className="selectable_chips types" name={variables[props.lang].types}>
            <TextField
                className="search_field"
                id="types-search"
                inputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <Icon
                                className="search"
                                icon="search"/>
                        </InputAdornment>
                    ),
                }}
                name="typesSearch"
                placeholder={variables[props.lang].search}
                value={props.search}
                onChange={props.onSearch}/>
            {list.map((val) => {
                return (
                    <span
                        key={val.value}
                        className={props.value.has(val.value) ? 'active' : ''}
                        onClick={() => handleSelect(val.value)}>
                        {val.name}
                        <span className="count">(10)</span>
                    </span>
                );
            })}
        </Accordions>
    );
};

Types.propTypes = {
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
        list: state.filters.types.list,
        search: state.filters.types.search,
        value: state.filters.types.value,
    };
};

const actionToProps = {
    onChange: setTypes,
    onSearch: setTypesSearch,
};

export default connect(stateToProps, actionToProps)(Types);
