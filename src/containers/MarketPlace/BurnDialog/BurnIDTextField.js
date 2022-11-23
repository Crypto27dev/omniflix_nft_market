import * as PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import OtpInput from 'react-otp-input';
import { setBurnId } from '../../../actions/marketplace';

const BurnNFTTextField = (props) => {
    return (
        <OtpInput
            numInputs={4}
            shouldAutoFocus={true}
            value={props.value}
            onChange={props.onChange}/>
    );
};

BurnNFTTextField.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

const stateToProps = (state) => {
    return {
        value: state.marketplace.burnID,
    };
};

const actionsToProps = {
    onChange: setBurnId,
};

export default connect(stateToProps, actionsToProps)(BurnNFTTextField);
