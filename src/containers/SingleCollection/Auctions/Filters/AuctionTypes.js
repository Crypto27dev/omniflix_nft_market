import React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Accordions from '../../../../components/Accordions';
import variables from '../../../../utils/variables';
import { FormControlLabel, FormGroup, Radio } from '@mui/material';
import ClassNames from 'classnames';
import { auctionsList } from '../../../../utils/defaultOptions';
import { setCAAuctionsType } from '../../../../actions/auctions/filters';
import { DEFAULT_LIMIT, DEFAULT_SKIP } from '../../../../config';
import { fetchCollectionAuctions } from '../../../../actions/collections';
import { withRouter } from 'react-router';

const AuctionTypes = (props) => {
    let options = [{
        value: '',
        label: 'All',
    }];

    if (props.address) {
        options = auctionsList;
    }

    const handleSelect = (event) => {
        const route = props.match && props.match.params && props.match.params.id;

        props.onChange(event.target.value);
        if (props.denomValueCA && props.denomValueCA.size) {
            props.fetchCollectionAuctions(route, DEFAULT_SKIP, DEFAULT_LIMIT, [...props.denomValueCA], null, null,
                event.target.value, props.address, props.sortBy, props.order, props.listingSearch);
        } else if (props.priceRangeValueCA && props.priceRangeValueCA.network &&
            props.priceRangeCA && props.priceRangeCA.length &&
            ((props.priceRangeCA[0] > 0) || (props.priceRangeCA[1] < 50000))) {
            const decimals = props.priceRangeValueCA && props.priceRangeValueCA.network &&
                (props.priceRangeValueCA.network.COIN_DECIMALS || props.priceRangeValueCA.network.decimals);
            const minValue = props.priceRangeCA[0] * (10 ** decimals);
            const maxValue = props.priceRangeCA[1] * (10 ** decimals);

            props.fetchCollectionAuctions(route, DEFAULT_SKIP, DEFAULT_LIMIT,
                [props.priceRangeValueCA.ibc_denom_hash || props.priceRangeValueCA.value],
                minValue, maxValue, event.target.value, props.address, props.sortBy, props.order, props.listingSearch);
        } else {
            props.fetchCollectionAuctions(route, DEFAULT_SKIP, DEFAULT_LIMIT, null, null, null, event.target.value, props.address,
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
    denomValueCA: PropTypes.object.isRequired,
    fetchCollectionAuctions: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    list: PropTypes.array.isRequired,
    listingSearch: PropTypes.string.isRequired,
    match: PropTypes.shape({
        params: PropTypes.shape({
            id: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
    priceRangeCA: PropTypes.array.isRequired,
    priceRangeValueCA: PropTypes.object.isRequired,
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
        denomValueCA: state.auctions.filters.onSaleInCA.value,
        priceRangeValueCA: state.auctions.filters.priceRangeCA.value,
        priceRangeCA: state.auctions.filters.priceRangeCA.range,
        value: state.auctions.filters.auctionsTypeCA,

        listingSearch: state.collection.listedSearch.value,
        sortBy: state.collection.collectionNFTsSort.sortBy,
        order: state.collection.collectionNFTsSort.order,
    };
};

const actionToProps = {
    onChange: setCAAuctionsType,
    fetchCollectionAuctions,
};

export default withRouter(connect(stateToProps, actionToProps)(AuctionTypes));
