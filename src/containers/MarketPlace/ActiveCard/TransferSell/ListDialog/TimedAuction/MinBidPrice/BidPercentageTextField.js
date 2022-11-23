import * as PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import TextField from '../../../../../../../components/TextField';
import variables from '../../../../../../../utils/variables';
import { setBidPercentagePrice } from '../../../../../../../actions/marketplace';
import { InputAdornment } from '@mui/material';

const BidPercentageTextField = (props) => {
    return (
        <TextField
            id="price"
            inputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        %
                    </InputAdornment>
                ),
            }}
            name="price"
            placeholder={variables[props.lang]['enter_price']}
            type="number"
            value={props.value}
            onChange={props.onChange}/>
    );
};

BidPercentageTextField.propTypes = {
    lang: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        value: state.marketplace.bidPercentage,
    };
};

const actionsToProps = {
    onChange: setBidPercentagePrice,
};

export default connect(stateToProps, actionsToProps)(BidPercentageTextField);
