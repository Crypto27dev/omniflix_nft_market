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
import { Tooltip } from '@material-ui/core';
import './index.css';

const Info = (props) => {
    const list = props.value && props.value.nftDetails && props.value.nftDetails.list;
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

    return (
        <div className="card">
            {mediaType && props.value && props.value.nftDetails &&
            getAssetType(mediaType) === 'image' && getAssetTypeExtension(mediaType) === 'gif'
                ? <ImageOnLoad
                    preview={poster}
                    src={props.value.nftDetails.preview_uri}
                    text={variables[props.lang]['asset_preview_not_ready']}/>
                : mediaType &&
                getAssetType(mediaType) === 'image' && props.value && props.value.nftDetails
                    ? <ImageOnLoad
                        cdn={props.value.nftDetails.cloudflare_cdn && props.value.nftDetails.cloudflare_cdn.variants}
                        preview={poster}
                        src={props.value.nftDetails.preview_uri}
                        text={variables[props.lang]['asset_preview_not_ready']}/>
                    : props.value && props.value.nftDetails
                        ? <ImageOnLoad
                            preview={poster}
                            src={props.value.nftDetails.preview_uri}
                            text={variables[props.lang]['asset_preview_not_ready']}/>
                        : <ImageOnLoad
                            src={thumbnail}
                            text=""/>}
            <div className="info">
                <div className="price_row">
                    <div className="nft_info">
                        <Tooltip title={props.value && props.value.nftDetails && props.value.nftDetails.denom_id &&
                            (props.value.nftDetails.denom_id.symbol || props.value.nftDetails.denom_id.name)}>
                            <p className="label">
                                {props.value && props.value.nftDetails && props.value.nftDetails.denom_id &&
                                    (props.value.nftDetails.denom_id.symbol || props.value.nftDetails.denom_id.name)}
                            </p>
                        </Tooltip>
                        <Tooltip title={props.value && props.value.nftDetails &&
                            props.value.nftDetails && props.value.nftDetails.name}>
                            <p className="value">
                                {props.value && props.value.nftDetails &&
                                    props.value.nftDetails && props.value.nftDetails.name}
                            </p>
                        </Tooltip>
                    </div>
                    <div className="nft_type">
                        <p>Owned</p>
                    </div>
                </div>
                <div className="label">
                    {variables[props.lang].from}: &nbsp;
                    <div className="hash_text value" title={props.address}>
                        <p className="name">{props.address}</p>
                        {props.address.slice(props.address.length - 6, props.address.length)}
                    </div>
                </div>
                <div className="label">
                    {variables[props.lang].price}: &nbsp;
                    <p className="value">
                        {list && list.price && list.price.amount && list.price.denom &&
                        ibcToken && ibcToken.network && ibcToken.network.decimals
                            ? <span>
                                {(list.price.amount / (10 ** ibcToken.network.decimals)) > 100
                                    ? formatCount((list.price.amount / (10 ** ibcToken.network.decimals)), true)
                                    : (list.price.amount / (10 ** ibcToken.network.decimals))}
                                {' ' + (ibcToken && ibcToken.network && ibcToken.network.display_denom) || list.price.denom}
                            </span>
                            : <span>
                                {list && list.price && list.price.amount && list.price.denom &&
                                (list.price.amount / (10 ** config.COIN_DECIMALS)) > 100
                                    ? formatCount(list.price.amount / (10 ** config.COIN_DECIMALS), true)
                                    : list.price.amount / (10 ** config.COIN_DECIMALS)}
                                {' ' + ((tokenType && tokenType.label) || list.price.denom)}
                            </span>}
                    </p>
                </div>
            </div>
        </div>
    );
};

Info.propTypes = {
    address: PropTypes.string.isRequired,
    ibcTokensList: PropTypes.array.isRequired,
    ibcTokensListInProgress: PropTypes.bool.isRequired,
    lang: PropTypes.string.isRequired,
    value: PropTypes.object.isRequired,
};

const stateToProps = (state) => {
    return {
        address: state.account.wallet.connection.address,
        ibcTokensList: state.marketplace.ibcTokensList.value,
        ibcTokensListInProgress: state.marketplace.ibcTokensList.inProgress,
        lang: state.language,
        value: state.marketplace.buyNFTSuccessDialog.info,
    };
};

export default connect(stateToProps)(Info);
