import * as PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import TextField from '../../../../../../components/TextField';
import variables from '../../../../../../utils/variables';
import { setSellTokenPrice } from '../../../../../../actions/marketplace';

const PriceTextField = (props) => {
    const handleChange = (value) => {
        if (Number(value) > 0 || value === '') {
            if (value === '') {
                props.onChange('');
                return;
            }

            props.onChange(value);
        }
    };

    return (
        <TextField
            id="price"
            name="price"
            placeholder={variables[props.lang]['enter_price']}
            type="number"
            value={props.value}
            onChange={handleChange}/>
    );
};

PriceTextField.propTypes = {
    lang: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        value: state.marketplace.sellTokenPrice,
    };
};

const actionsToProps = {
    onChange: setSellTokenPrice,
};

export default connect(stateToProps, actionsToProps)(PriceTextField);
