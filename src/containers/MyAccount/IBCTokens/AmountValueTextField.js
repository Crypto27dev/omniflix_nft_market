import * as PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import TextField from '../../../components/TextField';
// import variables from '../../../utils/variables';
import { InputAdornment } from '@mui/material';
import { setAmountValue } from '../../../actions/myAccount';
import NetworkImages from '../../../components/NetworkImages';

const AmountValueTextField = (props) => {
    const handleChange = (value) => {
        props.onChange(value);
    };

    return (
        <TextField
            className="amount_field"
            id="amount-value"
            inputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <NetworkImages alt={props.denom} className="token_start_icon" name={props.denom}/>
                        <span className="token_start">{props.denom}</span>
                    </InputAdornment>
                ),
                // endAdornment: (
                //     <InputAdornment
                //         position="end"
                //         onClick={() => props.onChange(props.balance > 0.1 ? (props.balance - 0.1) : props.balance)}>
                //         <span className="amount_end"> {variables[props.lang].max} </span>
                //     </InputAdornment>
                // ),
            }}
            name="amount_value"
            type="number"
            value={props.value}
            onChange={handleChange}/>
    );
};

AmountValueTextField.propTypes = {
    lang: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    balance: PropTypes.number,
    denom: PropTypes.string,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        value: state.myAccount.amountValue,
    };
};

const actionsToProps = {
    onChange: setAmountValue,
};

export default connect(stateToProps, actionsToProps)(AmountValueTextField);
