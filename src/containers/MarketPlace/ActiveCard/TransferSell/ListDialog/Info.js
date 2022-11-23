import React from 'react';
import ImageOnLoad from '../../../../../components/ImageOnLoad';
import variables from '../../../../../utils/variables';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { config } from '../../../../../config';
import { tokensList } from '../../../../../utils/defaultOptions';
import { formatCount } from '../../../../../utils/price';
import { getAssetType, getAssetTypeExtension } from '../../../../../utils/strings';
import thumbnail from '../../../../../assets/collections/thumbnail.svg';
import './index.css';

const Info = (props) => {
    const list = props.info && props.info.auction
        ? props.info.auction
        : props.info && props.info.start_price
            ? {
                ...props.info,
                price: props.info.start_price,
            } : props.info;
    const tokenType = list && list.price && list.price.denom &&
        tokensList.find((val) => val.value === list.price.denom);
    const poster = props.value && props.value.nftDetails &&
    props.value.nftDetails.preview_uri
        ? props.value.nftDetails.preview_uri
        : null;
    const ibcToken = list && list.price && list.price.denom &&
        props.ibcTokensList && props.ibcTokensList.length &&
        props.ibcTokensList.find((val) => val && val.ibc_denom_hash && (val.ibc_denom_hash === list.price.denom));
    const mediaType = props.value && props.value.nftDetails && props.value.nftDetails.media_type;
    const auction = (props.value && props.value.nftDetails && props.value.nftDetails.auction) ||
        (props.info && props.info.increment_percentage) || (props.info && props.info.auction);

    return (
        <div className="card">
            {mediaType && props.value && props.value.nftDetails &&
            getAssetType(mediaType) === 'image' && getAssetTypeExtension(mediaType) === 'gif'
                ? <ImageOnLoad
                    preview={poster}
                    src={props.value.nftDetails.media_uri}
                    text="image"/>
                : mediaType &&
                getAssetType(mediaType) === 'image' && props.value && props.value.nftDetails
                    ? <ImageOnLoad
                        cdn={props.value.nftDetails.cloudflare_cdn && props.value.nftDetails.cloudflare_cdn.variants}
                        preview={poster}
                        src={props.value.nftDetails.media_uri}
                        text="image"/>
                    : props.value && props.value.nftDetails
                        ? <ImageOnLoad
                            preview={poster}
                            src={props.value.nftDetails.media_uri}
                            text="image"/>
                        : <ImageOnLoad
                            src={thumbnail}
                            text="image"/>}
            <div className="info">
                <div className="price_row">
                    <div className="nft_info">
                        <p className="label">
                            {props.value && props.value.nftDetails && props.value.nftDetails.denom_id &&
                                (props.value.nftDetails.denom_id.symbol || props.value.nftDetails.denom_id.name)}
                        </p>
                        <p className="value">
                            {props.value && props.value.nftDetails && props.value.nftDetails.name}
                        </p>
                    </div>
                    {props.value && props.value.nftDetails && props.value.nftDetails.auction
                        ? null
                        : <div className="price_info">
                            {list && list.increment_percentage
                                ? <p className="label">{variables[props.lang]['bid_amount']}</p>
                                : <p className="label">{variables[props.lang]['listing_price']}</p>}
                            <p className="price">
                                {list && list.price && list.price.amount && list.price.denom &&
                                ibcToken && ibcToken.network && ibcToken.network.decimals
                                    ? <span>
                                        {(list.price.amount / (10 ** ibcToken.network.decimals)) > 100
                                            ? formatCount(list.price.amount / (10 ** ibcToken.network.decimals), true)
                                            : list.price.amount / (10 ** ibcToken.network.decimals)}
                                        {' ' + ((ibcToken && ibcToken.network && ibcToken.network.display_denom) || list.price.denom)}
                                    </span>
                                    : <span>
                                        {list && list.price && list.price.amount && list.price.denom &&
                                        (list.price.amount / (10 ** config.COIN_DECIMALS)) > 100
                                            ? formatCount((list.price.amount / (10 ** config.COIN_DECIMALS)), true)
                                            : list && list.price && (list.price.amount / (10 ** config.COIN_DECIMALS))}
                                        {' ' + ((tokenType && tokenType.label) || (list && list.price && list.price.denom))}
                                    </span>}
                            </p>
                        </div>}
                </div>
                {auction
                    ? null
                    : <div className="label">
                        {variables[props.lang]['listing_id']}: &nbsp;
                        <div className="hash_text value" title={list && list.id}>
                            <p className="name">{list && list.id}</p>
                            {list && list.id && list.id.slice(list.id.length - 6, list.id.length)}
                        </div>
                    </div>}
                <div className="label">
                    {variables[props.lang]['listing_type']}: &nbsp;
                    <p className="value">
                        {auction
                            ? variables[props.lang]['timed_auction']
                            : variables[props.lang]['fixed_price']}
                    </p>
                </div>
                {props.value && props.value.nftDetails && props.value.nftDetails.auction &&
                    <div className="label">
                        {variables[props.lang]['bid_amount']}: &nbsp;
                        <p className="value">
                            {props.amountValue &&
                            ibcToken && ibcToken.network && ibcToken.network.decimals
                                ? <span>
                                    {props.amountValue > 100
                                        ? formatCount(props.amountValue, true)
                                        : props.amountValue}
                                    {' ' + ((ibcToken && ibcToken.network && ibcToken.network.display_denom) || list.price.denom)}
                                </span>
                                : <span>
                                    {props.amountValue > 100
                                        ? formatCount(props.amountValue, true)
                                        : props.amountValue}
                                    {' ' + ((tokenType && tokenType.label) || (list && list.price && list.price.denom))}
                                </span>}
                        </p>
                    </div>}
            </div>
        </div>
    );
};

Info.propTypes = {
    address: PropTypes.string.isRequired,
    ibcTokensList: PropTypes.array.isRequired,
    ibcTokensListInProgress: PropTypes.bool.isRequired,
    info: PropTypes.object.isRequired,
    lang: PropTypes.string.isRequired,
    sellTokenPrice: PropTypes.string.isRequired,
    value: PropTypes.object.isRequired,
    amountValue: PropTypes.any,
    sellTokenValue: PropTypes.object,
};

const stateToProps = (state) => {
    return {
        amountValue: state.myAccount.amountValue,
        ibcTokensList: state.marketplace.ibcTokensList.value,
        ibcTokensListInProgress: state.marketplace.ibcTokensList.inProgress,
        address: state.account.wallet.connection.address,
        lang: state.language,
        sellTokenValue: state.marketplace.sellTokenValue.value,
        sellTokenPrice: state.marketplace.sellTokenPrice,
    };
};

export default connect(stateToProps)(Info);
