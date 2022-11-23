import ImageOnLoad from '../../../../components/ImageOnLoad';
import variables from '../../../../utils/variables';
import React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { tokensList } from '../../../../utils/defaultOptions';
import { config } from '../../../../config';
import { formatCount } from '../../../../utils/price';
import { getAssetType, getAssetTypeExtension } from '../../../../utils/strings';
import thumbnail from '../../../../assets/collections/thumbnail.svg';

const NFTInfo = (props) => {
    const tokenType = props.value && props.value.list && props.value.list.price && props.value.list.price.denom &&
        tokensList.find((val) => val.value === props.value.list.price.denom);
    const poster = props.value && props.value.preview_uri
        ? props.value.preview_uri
        : null;
    const ibcToken = props.value && props.value.list && props.value.list.price && props.value.list.price.denom &&
        props.ibcTokensList && props.ibcTokensList.length &&
        props.ibcTokensList.find((val) => val && val.ibc_denom_hash && (val.ibc_denom_hash === props.value.list.price.denom));
    const mediaType = props.value && props.value.media_type;

    return (
        <div className="delist_info card">
            {mediaType &&
            getAssetType(mediaType) === 'image' && getAssetTypeExtension(mediaType) === 'gif'
                ? <ImageOnLoad
                    preview={poster}
                    src={props.value.media_uri}
                    text="image"/>
                : mediaType &&
                getAssetType(mediaType) === 'image' && props.value
                    ? <ImageOnLoad
                        cdn={props.value.cloudflare_cdn && props.value.cloudflare_cdn.variants}
                        preview={poster}
                        src={props.value.media_uri}
                        text="image"/>
                    : props.value
                        ? <ImageOnLoad
                            preview={poster}
                            src={props.value.media_uri}
                            text="image"/>
                        : <ImageOnLoad
                            src={thumbnail}
                            text="image"/>}
            <div className="info">
                <div className="price_row">
                    <div className="nft_info">
                        <p className="label">
                            {props.value && props.value.denom_id &&
                                (props.value.denom_id.name || props.value.denom_id.symbol)}
                        </p>
                        <p className="value">
                            {props.value && props.value.name}
                        </p>
                    </div>
                    <div className="price_info">
                        <p className="label">{variables[props.lang]['listing_price']}</p>
                        <p className="price">
                            {props.value && props.value.list && props.value.list.price && props.value.list.price.amount &&
                            props.value.list.price.denom &&
                            ibcToken && ibcToken.network && ibcToken.network.decimals
                                ? <span>
                                    {((props.value.list.price.amount) / (10 ** ibcToken.network.decimals)) > 100
                                        ? formatCount((props.value.list.price.amount) / (10 ** ibcToken.network.decimals), true)
                                        : (props.value.list.price.amount) / (10 ** ibcToken.network.decimals)}
                                    {' ' + (ibcToken && ibcToken.network && ibcToken.network.display_denom) || (props.value.list.price.denom)}
                                </span>
                                : <span>
                                    {(props.value && props.value.list && props.value.list.price && props.value.list.price.amount) &&
                                    (props.value && props.value.list && props.value.list.price && props.value.list.price.denom) &&
                                    ((props.value && props.value.list && props.value.list.price && props.value.list.price.amount) / (10 ** config.COIN_DECIMALS))
                                        ? formatCount(((props.value && props.value.list && props.value.list.price && props.value.list.price.amount) / (10 ** config.COIN_DECIMALS)), true)
                                        : (props.value && props.value.list && props.value.list.price && props.value.list.price.amount) / (10 ** config.COIN_DECIMALS)}
                                    {' ' + ((tokenType && tokenType.label) || (props.value && props.value.list && props.value.list.price && props.value.list.price.denom))}
                                </span>}
                        </p>
                    </div>
                </div>
                <div className="label">
                    {variables[props.lang]['listing_id']}: &nbsp;
                    <div className="hash_text value" title={props.value && props.value.list && props.value.list.id}>
                        <p className="name">{props.value && props.value.list && props.value.list.id}</p>
                        {props.value && props.value.list && props.value.list.id.slice(props.value.list.id.length - 6, props.value.list.id.length)}
                    </div>
                </div>
                <div className="label">
                    {variables[props.lang]['listing_type']}: &nbsp;
                    <p className="value">Fixed</p>
                </div>
            </div>
        </div>
    );
};

NFTInfo.propTypes = {
    ibcTokensList: PropTypes.array.isRequired,
    ibcTokensListInProgress: PropTypes.bool.isRequired,
    lang: PropTypes.string.isRequired,
    value: PropTypes.object.isRequired,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        ibcTokensList: state.marketplace.ibcTokensList.value,
        ibcTokensListInProgress: state.marketplace.ibcTokensList.inProgress,
    };
};

export default connect(stateToProps)(NFTInfo);
