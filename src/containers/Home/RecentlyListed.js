import React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import variables from '../../utils/variables';
import NoData from '../../components/NoData';
import { tokensList } from '../../utils/defaultOptions';
import { withRouter } from 'react-router';
import { getAssetType, getAssetTypeExtension } from '../../utils/strings';
import ClassNames from 'classnames';
import ImageOnLoad from '../../components/ImageOnLoad/BackgroundImage';
import genesisCreatorIcon from '../../assets/diamond.svg';
import { formatCount } from '../../utils/price';
import { config } from '../../config';
import { Tooltip } from '@mui/material';
import VideoOnLoad from '../../components/ImageOnLoad/VideoOnLoad';
import { ReactComponent as CopyRight } from '../../assets/copy-right.svg';
import CircularProgress from '../../components/CircularProgress';
import '../MarketPlace/index.css';
import { hideActiveCard } from '../../actions/explore';

const RecentlyListed = (props) => {
    const handleReDirect = (event) => {
        event.stopPropagation();
        if (props.showActive) {
            props.hideActiveCard();
        }
    };

    const handleMouseOver = (event) => {
        const element = event.currentTarget.querySelector('video');

        if (element) {
            element.play();
        }
    };

    const handleMouseOut = (event) => {
        const element = event.currentTarget.querySelector('video');

        if (element) {
            element.pause();
        }
    };

    return (
        <div className="recent_lists">
            {props.listingsInProgress && props.listings && !props.listings.length
                ? <CircularProgress/>
                : props.listings && props.listings.length
                    ? props.listings.map((item, index) => {
                        if (index <= 12) {
                            const nftDetails = item && item.nft_id;
                            const bgImage = item.nft_id && item.nft_id.preview_uri;
                            const collectionDetails = item && item.denom_id;
                            const tokenType = item.price && item.price.denom &&
                                tokensList.find((val) => val.value === item.price.denom);
                            const ibcToken = item && item.price && item.price.denom &&
                                props.ibcTokensList && props.ibcTokensList.length &&
                                props.ibcTokensList.find((val) => val && val.ibc_denom_hash && (val.ibc_denom_hash === item.price.denom));

                            const nftObj = (nftDetails && typeof (nftDetails) === 'object') ? nftDetails : {};
                            nftObj.list = item;
                            nftObj.denom_id = (collectionDetails && typeof (collectionDetails) === 'object') ? collectionDetails : {};

                            const mediaType = nftDetails && nftDetails.media_type;

                            return (
                                <div
                                    key={index}
                                    className="list_details"
                                    onMouseOut={handleMouseOut}
                                    onMouseOver={handleMouseOver}>
                                    <a
                                        href={'/nft/' + (nftDetails && nftDetails.id)}
                                        rel="no-refresh"
                                        onClick={handleReDirect}>
                                        {mediaType &&
                                        getAssetType(mediaType) === 'video'
                                            ? <div
                                                className={ClassNames('list_section2 inline_video_section', item.nft_id && item.nft_id.nsfw ? 'blur' : '')}>
                                                <VideoOnLoad
                                                    preview={bgImage} src={item.nft_id && item.nft_id.media_uri}
                                                    type={mediaType}/>
                                            </div>
                                            : mediaType &&
                                            getAssetType(mediaType) === 'image' && getAssetTypeExtension(mediaType) === 'gif'
                                                ? <ImageOnLoad
                                                    className={ClassNames('list_section2', item.nft_id && item.nft_id.nsfw ? 'blur' : '')}
                                                    preview={bgImage}
                                                    src={item.nft_id && item.nft_id.media_uri}/>
                                                : mediaType &&
                                                getAssetType(mediaType) === 'image'
                                                    ? <ImageOnLoad
                                                        cdn={item.nft_id && item.nft_id.cloudflare_cdn && item.nft_id.cloudflare_cdn.variants}
                                                        className={ClassNames('list_section2', item.nft_id && item.nft_id.nsfw ? 'blur' : '')}
                                                        preview={bgImage}
                                                        src={item.nft_id && item.nft_id.media_uri}/>
                                                    : <ImageOnLoad
                                                        className={ClassNames('list_section2', item.nft_id && item.nft_id.nsfw ? 'blur' : '')}
                                                        src={bgImage}/>}
                                    </a>
                                    <div className="section1">
                                        <div className="list_section3_div">
                                            <Tooltip
                                                title={(collectionDetails && collectionDetails.name) + ' | ' + (collectionDetails && collectionDetails.symbol)}>
                                                <a
                                                    href={'/collection/' + (collectionDetails && collectionDetails.id)}
                                                    rel="no-refresh"
                                                    onClick={handleReDirect}>
                                                    {collectionDetails && collectionDetails.name
                                                        ? collectionDetails.name : '--'}
                                                </a>
                                            </Tooltip>
                                            {collectionDetails && collectionDetails.IP_infringement
                                                ? <Tooltip title={variables[props.lang]['ip_tooltip']}>
                                                    <CopyRight/>
                                                </Tooltip>
                                                : collectionDetails && collectionDetails.verified
                                                    ? <Tooltip title={variables[props.lang]['genesis_creator']}>
                                                        <img
                                                            alt="genesis_creator"
                                                            src={genesisCreatorIcon}/>
                                                    </Tooltip>
                                                    : null}
                                        </div>
                                        <Tooltip title={nftDetails && nftDetails.name}>
                                            <a
                                                className="list_section3_span"
                                                href={'/nft/' + (nftDetails && nftDetails.id)}
                                                rel="no-refresh"
                                                onClick={handleReDirect}>
                                                {nftDetails && nftDetails.name
                                                    ? nftDetails.name : '----'}
                                            </a>
                                        </Tooltip>
                                    </div>
                                    <div className="section2">
                                        <div>
                                            <span>{variables[props.lang].creator}</span>
                                            <a
                                                className="creator_address hash_text"
                                                href={`/account/${item.owner}/nfts`}
                                                rel="no-refresh"
                                                title={item.owner}
                                                onClick={handleReDirect}>
                                                <p className="name">{item.owner}</p>
                                                {item.owner.slice(item.owner.length - 4, item.owner.length)}
                                            </a>
                                        </div>
                                        <div>
                                            <span>{variables[props.lang]['list_price']}</span>
                                            {ibcToken && ibcToken.network && ibcToken.network.decimals &&
                                            item && item.price && item.price.amount
                                                ? <p className="lsr_value">
                                                    {(item.price.amount / (10 ** ibcToken.network.decimals)) > 100
                                                        ? formatCount(item.price.amount / (10 ** ibcToken.network.decimals), true)
                                                        : item.price.amount / (10 ** ibcToken.network.decimals)}
                                                    {' ' + ((ibcToken && ibcToken.network && ibcToken.network.display_denom) || item.price.denom)}
                                                </p>
                                                : <p
                                                    className="lsr_value">
                                                    {((item.price && item.price.amount) / (10 ** config.COIN_DECIMALS)) > 100
                                                        ? formatCount((item.price && item.price.amount) / (10 ** config.COIN_DECIMALS), true)
                                                        : (item.price && item.price.amount) / (10 ** config.COIN_DECIMALS)}
                                                    {' ' + ((tokenType && tokenType.label) || (item.price && item.price.denom))}
                                                </p>}
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        return null;
                    }) : <NoData/>}
        </div>
    );
};

RecentlyListed.propTypes = {
    hideActiveCard: PropTypes.func.isRequired,
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
    }).isRequired,
    ibcTokensList: PropTypes.array.isRequired,
    ibcTokensListInProgress: PropTypes.bool.isRequired,
    lang: PropTypes.string.isRequired,
    listings: PropTypes.array.isRequired,
    listingsInProgress: PropTypes.bool.isRequired,
    showActive: PropTypes.bool.isRequired,
};

const stateToProps = (state) => {
    return {
        ibcTokensList: state.marketplace.ibcTokensList.value,
        ibcTokensListInProgress: state.marketplace.ibcTokensList.inProgress,
        lang: state.language,
        listings: state.marketplace.listings.result,
        listingsInProgress: state.marketplace.listings.inProgress,
        showActive: state.explore.activeCard.open,
    };
};

const actionToProps = {
    hideActiveCard,
};

export default withRouter(connect(stateToProps, actionToProps)(RecentlyListed));
