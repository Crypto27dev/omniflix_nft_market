import { TextField as MaterialTextField } from '@mui/material';
import ClassNames from 'classnames';
import * as PropTypes from 'prop-types';
import React from 'react';
import './index.css';
import { styled } from '@mui/material/styles';

const MuiTextField = styled((props) => (
    <MaterialTextField {...props}/>
))(({ theme }) => ({
    '&.MuiTextField-root': {
        margin: 'unset',
    },
    '& .MuiInputBase-input.MuiSelect-select.MuiSelect-select': {
        padding: '10px',
        textAlign: 'left',
    },
    '& .MuiFilledInput-underline:after': {
        border: 'unset',
    },
    '& .MuiFilledInput-underline:before': {
        border: 'unset',
    },
    '& .MuiFilledInput-input': {
        padding: '12px 20px',
    },
    '& .MuiFilledInput-root': {
        background: '#141414',
        color: '#696969',
        border: '1px solid #141414',
        borderRadius: '5px',
        '&.Mui-focused': {
            border: '1px solid #3F5A6F',
        },
        '&:hover': {
            border: '1px solid #3F5A6F',
        },
        '&:before': {
            border: 'unset',
        },
        '&:hover:before': {
            border: 'unset !important',
        },
    },
    '& .MuiFormHelperText-root': {
        '&.Mui-error': {
            width: '100%',
            position: 'absolute',
            bottom: '-20px',
        },
    },
    ':-webkit-autofill': {
        WebkitBoxShadow: '0 0 0 1000px white inset',
        backgroundColor: 'red !important',
    },
}));

const TextField = (props) => {
    const onChange = (e) => props.onChange(e.target.value);

    return (
        <MuiTextField
            InputProps={props.inputProps ? props.inputProps : null}
            autoFocus={props.autoFocus ? props.autoFocus : false}
            className={ClassNames('text_field', props.className ? props.className : '')}
            disabled={props.disable}
            error={props.error}
            helperText={props.error
                ? <span className="error">
                    {props.errorText}
                </span>
                : null}
            id={props.id}
            inputRef={props.inputRef ? props.inputRef : null}
            label={props.label ? props.label : null}
            margin="normal"
            multiline={props.multiline ? props.multiline : false}
            name={props.name}
            placeholder={props.placeholder ? props.placeholder : ''}
            required={props.required ? props.required : false}
            rows={props.multiline ? 5 : null}
            type={props.type ? props.type : 'text'}
            value={props.value}
            variant={props.variant ? props.variant : 'filled'}
            onChange={onChange}/>
    );
};

TextField.propTypes = {
    onChange: PropTypes.func.isRequired,
    autoFocus: PropTypes.bool,
    className: PropTypes.string,
    disable: PropTypes.bool,
    error: PropTypes.bool,
    errorText: PropTypes.string,
    helperText: PropTypes.any,
    id: PropTypes.string,
    inputProps: PropTypes.object,
    inputRef: PropTypes.object,
    label: PropTypes.string,
    margin: PropTypes.string,
    multiline: PropTypes.bool,
    name: PropTypes.string,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    type: PropTypes.string,
    valid: PropTypes.bool,
    value: PropTypes.any,
    variant: PropTypes.string,
};

export default TextField;
