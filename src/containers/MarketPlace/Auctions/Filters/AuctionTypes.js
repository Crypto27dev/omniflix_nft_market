import React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Accordions from '../../../../components/Accordions';
import variables from '../../../../utils/variables';
import { FormControlLabel, FormGroup, Radio } from '@mui/material';
import ClassNames from 'classnames';
import { auctionsList } from '../../../../utils/defaultOptions';
import { fetchAuctionsListings } from '../../../../actions/auctions';
import { setLAAuctionsType } from '../../../../actions/auctions/filters';
import { DEFAULT_LIMIT, DEFAULT_SKIP } from '../../../../config';

const AuctionTypes = (props) => {
    let options = [{
        value: '',
        label: 'All',
    }];

    if (props.address) {
        options = auctionsList;
    }

    const handleSelect = (event) => {
        props.onChange(event.target.value);
        if (props.denomValueLA && props.denomValueLA.size) {
            props.fetchAuctionsListings(DEFAULT_SKIP, DEFAULT_LIMIT, [...props.denomValueLA], null, null,
                event.target.value, props.address, props.sortBy, props.order, props.listingSearch);
        } else if (props.priceRangeValueLA && props.priceRangeValueLA.network &&
            props.priceRangeLA && props.priceRangeLA.length &&
            ((props.priceRangeLA[0] > 0) || (props.priceRangeLA[1] < 50000))) {
            const decimals = props.priceRangeValueLA && props.priceRangeValueLA.network &&
                (props.priceRangeValueLA.network.COIN_DECIMALS || props.priceRangeValueLA.network.decimals);
            const minValue = props.priceRangeLA[0] * (10 ** decimals);
            const maxValue = props.priceRangeLA[1] * (10 ** decimals);

            props.fetchAuctionsListings(DEFAULT_SKIP, DEFAULT_LIMIT,
                [props.priceRangeValueLA.ibc_denom_hash || props.priceRangeValueLA.value],
                minValue, maxValue, event.target.value, props.address, props.sortBy, props.order, props.listingSearch);
        } else {
            props.fetchAuctionsListings(DEFAULT_SKIP, DEFAULT_LIMIT, null, null, null, event.target.value, props.address,
                props.sortBy, props.order, props.listingSearch);
        }
    };

    return (
        <Accordions name={variables[props.lang]['auction_types']}>
            <FormGroup>
                {options && options.length &&
                    options.map((val) => {
                        const value = val.value;
                        const label = val.label;

                        return (
                            <FormControlLabel
                                key={value}
                                className={ClassNames('checkbox', props.value === value ? 'checked' : '')}
                                control={<Radio
                                    checked={props.value === value}
                                    sx={{
                                        color: '#969696',
                                        '&.Mui-checked': {
                                            color: '#FAC01E',
                                        },
                                    }}
                                    value={value}
                                    onChange={(event) => handleSelect(event, value)}/>}
                                label={label}/>
                        );
                    })}
            </FormGroup>
        </Accordions>
    );
};

AuctionTypes.propTypes = {
    address: PropTypes.string.isRequired,
    denomValueLA: PropTypes.object.isRequired,
    fetchAuctionsListings: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    list: PropTypes.array.isRequired,
    listingSearch: PropTypes.string.isRequired,
    priceRangeLA: PropTypes.array.isRequired,
    priceRangeValueLA: PropTypes.object.isRequired,
    search: PropTypes.string.isRequired,
    sortBy: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    order: PropTypes.string,
};

const stateToProps = (state) => {
    return {
        address: state.account.wallet.connection.address,
        lang: state.language,
        denomValueLA: state.auctions.filters.onSaleInLA.value,
        priceRangeValueLA: state.auctions.filters.priceRangeLA.value,
        priceRangeLA: state.auctions.filters.priceRangeLA.range,
        value: state.auctions.filters.auctionsTypeLA,

        listingSearch: state.marketplace.listingSearch.value,
        sortBy: state.auctions.sort.sortBy,
        order: state.auctions.sort.order,
    };
};

const actionToProps = {
    onChange: setLAAuctionsType,
    fetchAuctionsListings,
};

export default connect(stateToProps, actionToProps)(AuctionTypes);
