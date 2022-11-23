import * as PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import TextField from '../../../../components/TextField';
import variables from '../../../../utils/variables';
import { setRecipentAddress } from '../../../../actions/marketplace';
import { config } from '../../../../config';
import { decodeFromBech32 } from '../../../../utils/address';

const ReciepentAddressTextField = (props) => {
    const handleChange = (value) => {
        props.onChange(value);
    };

    const valid = props.value && decodeFromBech32(props.value) && (props.value.indexOf(config.PREFIX) > -1);

    return (
        <TextField
            className="address_field"
            error={props.value !== '' ? !valid : false}
            errorText={variables[props.lang]['invalid_address']}
            id="address-value"
            name="address"
            placeholder={variables[props.lang]['enter_recipent_address']}
            value={props.value}
            onChange={handleChange}/>
    );
};

ReciepentAddressTextField.propTypes = {
    lang: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    balance: PropTypes.number,
    denom: PropTypes.string,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        value: state.marketplace.recipientAddress,
    };
};

const actionsToProps = {
    onChange: setRecipentAddress,
};

export default connect(stateToProps, actionsToProps)(ReciepentAddressTextField);
