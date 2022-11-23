import React from 'react';
import TextField from '../../../../../components/TextField';
import variables from '../../../../../utils/variables';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setSplitInfo } from '../../../../../actions/marketplace';
import { IconButton, InputAdornment } from '@mui/material';
import { config } from '../../../../../config';
import { decodeFromBech32 } from '../../../../../utils/address';

const SplitInfo = (props) => {
    const handleAddressChange = (value, index) => {
        const array = [...props.value];
        array[index].address = value;
        props.onChange([...array]);
    };

    const handlePercentageChange = (value, index) => {
        if (value > 100) {
            return;
        }

        const array = [...props.value];
        array[index].weight = value;
        let total = 0;
        array.map((val) => {
            total = Number(val.weight) + Number(total);

            return null;
        });

        if (total < 100 || total === 100) {
            props.onChange([...array]);
        }
    };

    const handleCreate = () => {
        const array = [...props.value];
        array.push({
            address: '',
            weight: '',
        });
        props.onChange([...array]);
    };

    const handleRemove = (index) => {
        const array = [...props.value];
        array.splice(index, 1);
        props.onChange([...array]);
    };

    const tokens = props.tokenPrice / 100;
    let royalty = props.details && props.details.nftDetails && props.details.nftDetails.royalty_share;
    royalty = royalty * 100;
    let royaltyTokens = (props.tokenPrice - tokens) / 100;
    royaltyTokens = royaltyTokens * royalty;
    let total = 0;

    return (
        <div className="split_info_data">
            {props.value && props.value.length
                ? props.value.map((val, index) => {
                    total = Number(val.weight) + total;
                    const disable = val.address === '' || val.weight === '';
                    let percentageTokens = royaltyTokens
                        ? ((props.tokenPrice) - (tokens + royaltyTokens)) / 100
                        : (props.tokenPrice - tokens) / 100;
                    percentageTokens = percentageTokens * val.weight;
                    percentageTokens = parseFloat(percentageTokens).toFixed(2);
                    const valid = val.address && decodeFromBech32(val.address) && (val.address.indexOf(config.PREFIX) > -1);

                    return (
                        <div key={index} className="row">
                            <TextField
                                error={val.address !== '' ? !valid : false}
                                errorText={variables[props.lang]['invalid_address']}
                                id="address"
                                name="address"
                                placeholder={variables[props.lang]['enter_split_address']}
                                value={val.address}
                                onChange={(value) => handleAddressChange(value, index)}/>
                            <TextField
                                className="percentage"
                                id="percentage"
                                inputProps={val.weight !== '' && {
                                    endAdornment: (
                                        <InputAdornment className="adornment" position="end">
                                            {props.tokenPrice && percentageTokens &&
                                                <span className="tokens"> % = {percentageTokens} </span>}
                                        </InputAdornment>
                                    ),
                                }}
                                name="percentage"
                                placeholder={variables[props.lang]['enter_split_percentage']}
                                type="number"
                                value={val.weight}
                                onChange={(value) => handlePercentageChange(value, index)}/>
                            {total > 100 || total === 100
                                ? <IconButton className="plus_button hidden">+</IconButton>
                                : props.value.length === (index + 1)
                                    ? <IconButton
                                        className="plus_button" disabled={disable}
                                        onClick={handleCreate}>+</IconButton>
                                    : <IconButton
                                        className="remove_button"
                                        onClick={() => handleRemove(index)}>-</IconButton>}
                        </div>
                    );
                }) : null}
        </div>
    );
};

SplitInfo.propTypes = {
    details: PropTypes.object.isRequired,
    lang: PropTypes.string.isRequired,
    tokenPrice: PropTypes.string.isRequired,
    value: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        value: state.marketplace.splitInfo.value,
        tokenPrice: state.marketplace.sellTokenPrice,
    };
};

const actionsToProps = {
    onChange: setSplitInfo,
};

export default connect(stateToProps, actionsToProps)(SplitInfo);
