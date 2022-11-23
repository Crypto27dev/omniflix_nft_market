import React from 'react';
import { components } from 'react-select';
import AsyncSelect from 'react-select/async';
import * as PropTypes from 'prop-types';
import ClassNames from 'classnames';
import './index.css';

const SelectField = (props) => {
    const handleChange = (newValue) => {
        props.onChange(newValue);
    };

    const DropdownIndicator = (props) => {
        return (
            <components.DropdownIndicator {...props}/>
        );
    };

    const handleImages = (name) => {
        const value = props.images.find((val) => val.name === name);

        return value && value.image;
    };

    const filterSearch = (inputValue) => {
        return props.options.filter((i) => {
            if (i.network && i.network.display_denom) {
                return i.network.display_denom.toLowerCase().includes(inputValue.toLowerCase());
            } else if (i.name) {
                return i.name.toLowerCase().includes(inputValue.toLowerCase());
            } else if (i.label) {
                return i.label.toLowerCase().includes(inputValue.toLowerCase());
            } else {
                return i;
            }
        });
    };

    const promiseOptions = (inputValue) =>
        new Promise((resolve) => {
            setTimeout(() => {
                resolve(filterSearch(inputValue));
            }, 100);
        });

    return (
        <div className="select_field_parent">
            <AsyncSelect
                autoFocus={!!props.autoFocus}
                className={ClassNames('text_field select_field', props.className ? props.className : '')}
                classNamePrefix="select"
                components={{ DropdownIndicator }}
                defaultOptions={props.options}
                getOptionLabel={(option) => {
                    return (
                        <div className="label">
                            {props.images ? handleImages(option.network && option.network.display_denom
                                ? option.network.display_denom
                                : option.name || option.label) : null}
                            {option.network && option.network.display_denom
                                ? option.network.display_denom
                                : option.name || option.label}
                        </div>
                    );
                }}
                getOptionValue={(option) => `${option._id}`}
                id={props.id}
                isClearable={!!props.isClearable}
                isDisabled={!!props.isDisabled}
                isLoading={!!props.isLoading}
                isRtl={!!props.isRtl}
                isSearchable={true}
                loadOptions={promiseOptions}
                name={props.name}
                options={props.options}
                placeholder={props.placeholder ? props.placeholder : ''}
                value={props.value}
                onChange={handleChange}/>
            {props.error
                ? <span className="error">
                    {props.errorText}
                </span>
                : null}
        </div>
    );
};

SelectField.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    autoFocus: PropTypes.bool,
    className: PropTypes.string,
    error: PropTypes.bool,
    errorText: PropTypes.string,
    images: PropTypes.array,
    isClearable: PropTypes.bool,
    isDisabled: PropTypes.bool,
    isLoading: PropTypes.bool,
    isRtl: PropTypes.bool,
    placeholder: PropTypes.string,
    value: PropTypes.any,
};

export default SelectField;
