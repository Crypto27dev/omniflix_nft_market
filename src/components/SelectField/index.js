import { MenuItem, TextField } from '@mui/material';
import * as PropTypes from 'prop-types';
import React from 'react';
import './index.css';
import { styled } from '@mui/material/styles';

const MuiTextField = styled((props) => (
    <TextField {...props}/>
))(({ theme }) => ({
    '&.MuiTextField-root': {
        margin: 'unset',
    },
    '& .MuiInputBase-input.MuiSelect-select.MuiSelect-select': {
        padding: '10px',
        textAlign: 'left',
    },
    '& .MuiFormHelperText-root': {
        '&.Mui-error': {
            width: '100%',
            margin: '-6px 0',
        },
    },
    ':-webkit-autofill': {
        WebkitBoxShadow: '0 0 0 1000px white inset',
        backgroundColor: 'red !important',
    },
}));

const SelectField = (props) => {
    const onChange = (e) => {
        props.onChange(e.target.value);
    };

    return (
        <MuiTextField
            select
            className="text_field select_field"
            id={props.id}
            margin="normal"
            name={props.name}
            value={props.value}
            variant="outlined"
            onChange={onChange}>
            {props.placeholder
                ? <MenuItem disabled value="none">
                    {props.placeholder}
                </MenuItem>
                : null}
            {props.items &&
                props.items.length &&
                props.items.map((item) => (
                    <MenuItem
                        key={item.key || item.value || item.name}
                        value={item && item.network && item.network.chain_id
                            ? item
                            : item && item.network && item.network.CHAIN_ID
                                ? item
                                : item.label || item.value || item.name}>
                        {item && item.network && item.network.chain_id
                            ? item.network.chain_id
                            : item && item.network && item.network.CHAIN_ID
                                ? item.network.CHAIN_ID
                                : item.label || item.name}
                    </MenuItem>
                ))}
        </MuiTextField>
    );
};

SelectField.propTypes = {
    id: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
};

export default SelectField;
