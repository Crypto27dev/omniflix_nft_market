import React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Accordions from '../../../components/Accordions';
import variables from '../../../utils/variables';
import { setGenre, setGenreSearch } from '../../../actions/filters';
import TextField from '../../../components/TextField';
import { InputAdornment } from '@mui/material';
import Icon from '../../../components/Icon';

const Genre = (props) => {
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
        <Accordions className="selectable_chips genre" name={variables[props.lang].genre}>
            <TextField
                className="search_field"
                id="genre-search"
                inputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <Icon
                                className="search"
                                icon="search"/>
                        </InputAdornment>
                    ),
                }}
                name="genreSearch"
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
                    </span>
                );
            })}
        </Accordions>
    );
};

Genre.propTypes = {
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
        list: state.filters.genre.list,
        search: state.filters.genre.search,
        value: state.filters.genre.value,
    };
};

const actionToProps = {
    onChange: setGenre,
    onSearch: setGenreSearch,
};

export default connect(stateToProps, actionToProps)(Genre);
