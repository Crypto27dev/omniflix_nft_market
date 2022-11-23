import { Chip, IconButton, makeStyles, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import ClassNames from 'classnames';
import * as PropTypes from 'prop-types';
import React from 'react';
import './index.css';
import '../TextField/index.css';
import Icon from '../Icon';

const useStyles = makeStyles(() => ({
    root: {
        '& .MuiFilledInput-underline:after': {
            border: 'unset',
        },
        '& .MuiFilledInput-underline:before': {
            border: 'unset',
        },
        '& .MuiFilledInput-input': {
            padding: '10px !important',
        },
        '& .MuiFilledInput-root': {
            background: '#141414',
            color: '#696969',
            border: '1px solid #141414',
            borderRadius: '5px',
            padding: '8px',
            alignItems: 'flex-start',
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
                margin: '-6px 0',
            },
        },
        ':-webkit-autofill': {
            WebkitBoxShadow: '0 0 0 1000px white inset',
            backgroundColor: 'red !important',
        },
    },
    paper: {
        margin: 'unset',
        background: 'unset',
        boxShadow: '0 4px 4px rgba(0, 0, 0, 0.25)',
    },
    listbox: {
        padding: 'unset',
    },
}));

const AutoCompleteTextField = (props) => {
    return (
        <Autocomplete
            multiple
            className={ClassNames(useStyles().root, 'auto_complete text_field ' + (props.className
                ? props.className : ''))}
            classes={{
                paper: useStyles().paper,
                listbox: useStyles().listbox,
            }}
            disableClearable={!!props.disableClearable}
            freeSolo={!!props.freeSolo}
            getOptionLabel={(option) => option}
            id={props.id}
            options={props.options}
            renderInput={(params) => (
                <TextField
                    {...params}
                    multiline
                    label={props.label ? props.label : null}
                    placeholder={props.placeholder ? props.placeholder : ''}
                    rows={4}
                    variant="filled"/>
            )}
            renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                    <Chip
                        key={index}
                        className="chips_input"
                        deleteIcon={<IconButton className="delete_icon">
                            <Icon className="chip-close" icon="chip-close"/>
                        </IconButton>}
                        label={option}
                        variant="outlined"
                        {...getTagProps({ index })} />
                ))
            }
            value={props.value}
            onChange={(event, newValue) =>
                props.onChange(newValue)
            }
            onInputChange={(event, newValue) =>
                props.handleInput(newValue)
            }/>
    );
};

AutoCompleteTextField.propTypes = {
    options: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    InputLabelProps: PropTypes.bool,
    className: PropTypes.string,
    disableClearable: PropTypes.bool,
    freeSolo: PropTypes.bool,
    handleInput: PropTypes.func,
    id: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.any,
};

export default AutoCompleteTextField;
