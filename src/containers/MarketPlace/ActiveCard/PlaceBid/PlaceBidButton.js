import React from 'react';
import { Button, Tooltip } from '@mui/material';
import { ReactComponent as CopyRight } from '../../../../assets/copy-right.svg';
import variables from '../../../../utils/variables';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { showPlaceBidDialog } from '../../../../actions/auctions';
import { setAmountValue } from '../../../../actions/myAccount';
import { config } from '../../../../config';
import { showMessage } from '../../../../actions/snackbar';
import moment from 'moment';
import Counter from './Counter';
import { mathCeilDecimals } from '../../../../utils/numbers';

const PlaceBidButton = (props) => {
    const handleDialog = () => {
        const whiteList = props.value && props.value.nftDetails && props.value.nftDetails.auction &&
            props.value.nftDetails.auction.whitelist_accounts;
        if (whiteList && whiteList.length) {
            const address = whiteList.find((value) => value === props.address);
            if (!address) {
                props.showMessage(variables[props.lang]['account_not_whitelisted'], 'warning');

                return;
            }
        }

        let amount = props.value && props.value.nftDetails && props.value.nftDetails.auction &&
            props.value.nftDetails.auction.price && props.value.nftDetails.auction.price.amount;
        const denom = props.value && props.value.nftDetails && props.value.nftDetails.auction &&
            props.value.nftDetails.auction.price && props.value.nftDetails.auction.price.denom;
        const balance = props.balance && props.balance.length &&
            props.balance.find((val) => val.denom === denom);

        if ((balance && balance.amount && (amount > balance.amount)) || !balance) {
            props.showMessage('Not Enough balance', 'warning');

            return;
        }

        props.showPlaceBidDialog(props.value);
        const ibcToken = denom && props.ibcTokensList && props.ibcTokensList.length &&
            props.ibcTokensList.find((val) => val && val.ibc_denom_hash && (val.ibc_denom_hash === denom));
        const decimals = ibcToken && ibcToken.network && ibcToken.network.decimals
            ? ibcToken.network.decimals
            : config.COIN_DECIMALS;
        if (props.value && props.value.nftDetails && props.value.nftDetails.auction &&
            props.value.nftDetails.auction.last_bid) {
            amount = (amount) + ((props.value && props.value.nftDetails && props.value.nftDetails.auction &&
                props.value.nftDetails.auction.increment_percentage) * amount);
        }

        amount = amount / (10 ** decimals);
        amount = mathCeilDecimals(amount, 2);

        props.setAmountValue(amount);
    };

    const coryRight = props.value && props.value.nftDetails &&
        props.value.nftDetails.denom_id && props.value.nftDetails.denom_id.IP_infringement;
    const enable = props.value && props.value.nftDetails && props.value.nftDetails.auction &&
        props.value.nftDetails.auction.start_time &&
        moment().diff(props.value.nftDetails.auction.start_time) > 0;
    const whiteList = props.value && props.value.nftDetails && props.value.nftDetails.auction &&
        props.value.nftDetails.auction.whitelist_accounts;
    let whiteListAddress = true;
    if (whiteList && whiteList.length) {
        const address = whiteList.find((value) => value === props.address);

        if (!address) {
            whiteListAddress = false;
        }
    }

    return (
        <div className="place_bid_div">
            {!whiteListAddress
                ? <Button
                    disabled
                    className={coryRight ? 'purchase_license warning' : 'purchase_license'}
                    style={{ textTransform: 'unset' }}>
                    {coryRight ? <CopyRight/> : null}
                    {variables[props.lang]['not_whitelisted']}
                </Button>
                : props.owner
                    ? <Button
                        disabled
                        className={coryRight ? 'purchase_license warning' : 'purchase_license'}
                        style={{ textTransform: 'unset' }}>
                        {coryRight ? <CopyRight/> : null}
                        {variables[props.lang]['owner_of_nft']}
                    </Button>
                    : enable
                        ? <Button
                            className={coryRight ? 'purchase_license warning' : 'purchase_license'}
                            onClick={handleDialog}>
                            {coryRight ? <CopyRight/> : null}
                            {variables[props.lang]['place_bid']}
                        </Button>
                        : <Tooltip
                            arrow
                            className="place_bid_tooltip"
                            title={props.value && props.value.nftDetails && props.value.nftDetails.auction &&
                            props.value.nftDetails.auction.start_time
                                ? `${variables[props.lang]['auction_go_live']} ${moment(props.value.nftDetails.auction.start_time).calendar()}`
                                : variables[props.lang]['auction_is_not_live']}>
                            <span>
                                <Button
                                    className={coryRight ? 'purchase_license warning' : 'purchase_license'}
                                    disabled={!enable}
                                    onClick={handleDialog}>
                                    {coryRight ? <CopyRight/> : null}
                                    {variables[props.lang]['place_bid']}
                                </Button>
                            </span>
                        </Tooltip>}
            {props.singleNft &&
                <Counter auction={props.value && props.value.nftDetails && props.value.nftDetails.auction}/>}
        </div>
    );
};

PlaceBidButton.propTypes = {
    address: PropTypes.string.isRequired,
    balance: PropTypes.array.isRequired,
    ibcTokensList: PropTypes.array.isRequired,
    lang: PropTypes.string.isRequired,
    setAmountValue: PropTypes.func.isRequired,
    showMessage: PropTypes.func.isRequired,
    showPlaceBidDialog: PropTypes.func.isRequired,
    value: PropTypes.object.isRequired,
    owner: PropTypes.bool,
    singleNft: PropTypes.bool,
};

const stateToProps = (state) => {
    return {
        address: state.account.wallet.connection.address,
        balance: state.account.bc.balance.value,
        lang: state.language,
        ibcTokensList: state.marketplace.ibcTokensList.value,
    };
};

const actionToProps = {
    setAmountValue,
    showMessage,
    showPlaceBidDialog,
};

export default connect(stateToProps, actionToProps)(PlaceBidButton);
