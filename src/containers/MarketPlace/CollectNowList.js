import React from 'react';
import arrowIcon from '../../assets/explore/transferability.svg';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import variables from '../../utils/variables';
import { hideActiveCard, showActiveCard } from '../../actions/explore';
import { hideFilters } from '../../actions/filters';
import ClassNames from 'classnames';
import { withRouter } from 'react-router';
import { config } from '../../config';
import { tokensList } from '../../utils/defaultOptions';
import ImageOnLoad from '../../components/ImageOnLoad/BackgroundImage';
import { getAssetType, getAssetTypeExtension } from '../../utils/strings';
import { formatCount } from '../../utils/price';
import genesisCreatorIcon from '../../assets/diamond.svg';
import { Tooltip } from '@mui/material';
import VideoOnLoad from '../../components/ImageOnLoad/VideoOnLoad';
import { ReactComponent as CopyRight } from '../../assets/copy-right.svg';

const CollectNowList = (props) => {
    const handleShow = (value, event) => {
        const marketPlace = document.getElementById('market-place-scroll');
        let card = event.target;
        if (!event.target.classList.contains('list_page')) {
            card = event.target.closest('.list_page');
        }
        if (!props.showActive) {
            card && card.scrollIntoView();
        } else {
            marketPlace.scrollTo({
                top: (card && card.offsetTop) - 140,
                behavior: 'smooth',
            });
        }
        if (props.filterShow) {
            props.hideFilters();
        }

        props.show(value);
    };

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
        <>
            {props.listings.map((item, index) => {
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
                        className={ClassNames('list_page', (props.activeValue) === (nftDetails && nftDetails.id) ? 'active' : '')}
                        onClick={(e) => handleShow({
                            nftDetails: nftDetails,
                        }, e)}
                        onMouseOut={handleMouseOut}
                        onMouseOver={handleMouseOver}>
                        <div className="list_section1">
                            <div className="list_section1_left">
                                {mediaType &&
                                    <div className="asset_type">
                                        {mediaType && getAssetType(mediaType)}
                                    </div>}
                                {/* <div><img alt="icon" src={lockIcon}/></div> */}
                                {/* <div><img alt="icon" src={settingIcon}/></div> */}
                                {nftDetails && nftDetails.transferable &&
                                    <Tooltip title={variables[props.lang].transferability}>
                                        <div><img alt="icon" src={arrowIcon}/></div>
                                    </Tooltip>}
                            </div>
                            <div className="list_section1_right" onClick={(event) => event.stopPropagation()}>
                                {/* <span>Artwork</span> */}
                                {/* <div> */}
                                {/*    <img alt="icon" src={moreIcon}/> */}
                                {/* </div> */}
                            </div>
                        </div>
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
                        <div className="list_section3">
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
                                            <img alt="genesis_creator" src={genesisCreatorIcon}/>
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
                        <div className="list_border"/>
                        <div className="list_section4">
                            <div className="list_section4_left">
                                <span>{variables[props.lang].owner}</span>
                                <a
                                    className="lsl_value hash_text"
                                    href={`/account/${item.owner}/nfts`}
                                    rel="no-refresh"
                                    title={item.owner}
                                    onClick={handleReDirect}>
                                    <p className="name">{item.owner}</p>
                                    {item.owner.slice(item.owner.length - 4, item.owner.length)}
                                </a>
                            </div>
                            <div className="list_section4_right">
                                <span>{variables[props.lang].price}</span>
                                {ibcToken && ibcToken.network && ibcToken.network.decimals &&
                                item && item.price && item.price.amount
                                    ? <div className="lsr_value">
                                        {(item.price.amount / (10 ** ibcToken.network.decimals)) > 100
                                            ? formatCount(item.price.amount / (10 ** ibcToken.network.decimals), true)
                                            : item.price.amount / (10 ** ibcToken.network.decimals)}
                                        {' ' + ((ibcToken && ibcToken.network && ibcToken.network.display_denom) || item.price.denom)}
                                    </div>
                                    : <div
                                        className="lsr_value">
                                        {((item.price && item.price.amount) / (10 ** config.COIN_DECIMALS)) > 100
                                            ? formatCount((item.price && item.price.amount) / (10 ** config.COIN_DECIMALS), true)
                                            : (item.price && item.price.amount) / (10 ** config.COIN_DECIMALS)}
                                        {' ' + ((tokenType && tokenType.label) || (item.price && item.price.denom))}
                                    </div>}
                            </div>
                        </div>
                    </div>
                );
            })}
        </>
    );
};

CollectNowList.propTypes = {
    filterShow: PropTypes.bool.isRequired,
    hideActiveCard: PropTypes.func.isRequired,
    hideFilters: PropTypes.func.isRequired,
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
    }).isRequired,
    ibcTokensList: PropTypes.array.isRequired,
    ibcTokensListInProgress: PropTypes.bool.isRequired,
    lang: PropTypes.string.isRequired,
    listings: PropTypes.array.isRequired,
    show: PropTypes.func.isRequired,
    showActive: PropTypes.bool.isRequired,
    activeValue: PropTypes.string,
};

const stateToProps = (state) => {
    return {
        activeValue: state.explore.activeCard.activeNFTID,
        filterShow: state.filters.show,
        ibcTokensList: state.marketplace.ibcTokensList.value,
        ibcTokensListInProgress: state.marketplace.ibcTokensList.inProgress,
        lang: state.language,
        listings: state.marketplace.listings.result,
        showActive: state.explore.activeCard.open,
    };
};

const actionToProps = {
    hideFilters,
    hideActiveCard,
    show: showActiveCard,
};

export default withRouter(connect(stateToProps, actionToProps)(CollectNowList));
