import React from 'react';
// import moreIcon from '../../assets/explore/more.svg';
import arrowIcon from '../../assets/explore/transferability.svg';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import variables from '../../utils/variables';
import { hideActiveCard, showActiveCard } from '../../actions/explore';
import ClassNames from 'classnames';
import { withRouter } from 'react-router';
import { config } from '../../config';
import { tokensList } from '../../utils/defaultOptions';
import ImageOnLoad from '../../components/ImageOnLoad/BackgroundImage';
import thumbnail from '../../assets/thumbnail.svg';
import { getAssetType, getAssetTypeExtension } from '../../utils/strings';
import { formatCount } from '../../utils/price';
import genesisCreatorIcon from '../../assets/diamond.svg';
import { Tooltip } from '@mui/material';
import VideoOnLoad from '../../components/ImageOnLoad/VideoOnLoad';
import { ReactComponent as CopyRight } from '../../assets/copy-right.svg';
import { hideCollectionFilters } from '../../actions/collections/filters';
import moreIcon from '../../assets/explore/more.svg';
import { showMenuPopover } from '../../actions/marketplace';

const List = (props) => {
    const handleShow = (value, event) => {
        let card = event.target;
        if (!event.target.classList.contains('list_page')) {
            card = event.target.closest('.list_page');
        }
        if (!props.showActive) {
            card && card.scrollIntoView();
        } else {
            window.scrollTo({
                top: (card && card.offsetTop) + 330,
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

    const handleMoreOptions = (event, item) => {
        event.stopPropagation();
        props.showMenuPopover(event, item);
    };

    return (
        <>
            {props.listData && props.listData.length > 0
                ? props.listData.map((item, index) => {
                    const bgImage = (item && item.status === 'LISTED'
                        ? item && item.nft_id && item.nft_id.preview_uri
                        : item && item.preview_uri) || thumbnail;

                    const tokenType = item && item.status === 'LISTED' && item.price && item.price.denom &&
                        tokensList.find((val) => val.value === item.price.denom);

                    const ibcToken = item && item.status === 'LISTED' && item.price && item.price.denom &&
                        props.ibcTokensList && props.ibcTokensList.length &&
                        props.ibcTokensList.find((val) => val && val.ibc_denom_hash &&
                            (val.ibc_denom_hash === item.price.denom));

                    const nftObj = item && item.status === 'LISTED'
                        ? item && item.nft_id
                        : item;
                    nftObj.list = item && item.status === 'LISTED' && item;
                    nftObj.denom_id = item && item.status === 'LISTED'
                        ? item && item.denom_id
                        : props.collectionList;

                    const mediaType = item && item.status === 'LISTED'
                        ? item && item.nft_id && item.nft_id.media_type
                        : item && item.media_type;

                    return (
                        <div
                            key={index}
                            className={ClassNames('list_page', (props.activeValue) === (nftObj && nftObj.id) ? 'active' : '')}
                            onClick={(e) => handleShow({
                                nftDetails: nftObj,
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
                                    {nftObj && nftObj.transferable &&
                                        <Tooltip title={variables[props.lang].transferability}>
                                            <div><img alt="icon" src={arrowIcon}/></div>
                                        </Tooltip>}
                                </div>
                                <div className="list_section1_right">
                                    {/* <span>Artwork</span> */}
                                    {nftObj && nftObj.owner && (nftObj.owner === props.address) &&
                                        !nftObj.list && !nftObj.auction &&
                                        <div onClick={(event) => handleMoreOptions(event, nftObj)}>
                                            <img alt="icon" src={moreIcon}/>
                                        </div>}
                                </div>
                            </div>
                            {mediaType &&
                            getAssetType(mediaType) === 'video'
                                ? <div
                                    className={ClassNames('list_section2 inline_video_section', nftObj && nftObj.nsfw ? 'blur' : '')}>
                                    <VideoOnLoad preview={bgImage} src={nftObj && nftObj.media_uri} type={mediaType}/>
                                </div>
                                : mediaType &&
                                getAssetType(mediaType) === 'image' && getAssetTypeExtension(mediaType) === 'gif'
                                    ? <ImageOnLoad
                                        className={ClassNames('list_section2', nftObj && nftObj.nsfw ? 'blur' : '')}
                                        preview={bgImage}
                                        src={nftObj && nftObj.media_uri}/>
                                    : mediaType &&
                                    getAssetType(mediaType) === 'image'
                                        ? <ImageOnLoad
                                            cdn={nftObj && nftObj.cloudflare_cdn && nftObj.cloudflare_cdn.variants}
                                            className={ClassNames('list_section2', nftObj && nftObj.nsfw ? 'blur' : '')}
                                            preview={bgImage}
                                            src={nftObj && nftObj.media_uri}/>
                                        : <ImageOnLoad
                                            className={ClassNames('list_section2', nftObj && nftObj.nsfw ? 'blur' : '')}
                                            src={bgImage}/>}
                            <div className="list_section3">
                                <div className="list_section3_div">
                                    <Tooltip title={(props.collectionList &&
                                        props.collectionList.name) + ' | ' + (props.collectionList &&
                                        props.collectionList.symbol)}>
                                        <span>
                                            {props.collectionList &&
                                                props.collectionList.name &&
                                                (props.collectionList.name || props.collectionList.symbol)}
                                        </span>
                                    </Tooltip>
                                    {props.collectionList && props.collectionList.IP_infringement
                                        ? <Tooltip title={variables[props.lang]['ip_tooltip']}>
                                            <CopyRight/>
                                        </Tooltip>
                                        : props.collectionList && props.collectionList.verified
                                            ? <Tooltip title={variables[props.lang]['genesis_creator']}>
                                                <img alt="genesis_creator" src={genesisCreatorIcon}/>
                                            </Tooltip>
                                            : null}
                                </div>
                                <Tooltip title={nftObj && nftObj.name}>
                                    <a
                                        className="list_section3_span"
                                        href={'/nft/' + (nftObj && nftObj.id)}
                                        rel="no-refresh"
                                        onClick={handleReDirect}>
                                        {nftObj && nftObj.name}
                                    </a>
                                </Tooltip>
                            </div>
                            <div className="list_border"/>
                            <div className="list_section4">
                                <div className="list_section4_left">
                                    <span>{variables[props.lang].owner}</span>
                                    <a
                                        className="lsl_value hash_text"
                                        href={`/account/${nftObj.owner}/nfts`}
                                        rel="no-refresh"
                                        title={nftObj.owner}
                                        onClick={handleReDirect}>
                                        <p className="name">{nftObj.owner}</p>
                                        {nftObj.owner && nftObj.owner.slice(nftObj.owner.length - 4, nftObj.owner.length)}
                                    </a>
                                </div>

                                <div className="list_section4_right">
                                    <span>{variables[props.lang].price}</span>
                                    {item && item.status === 'LISTED' && item.price
                                        ? ibcToken && ibcToken.network && ibcToken.network.decimals
                                            ? <span className="lsr_value">
                                                {((item.price && item.price.amount) / (10 ** (ibcToken.network && ibcToken.network.decimals))) > 100
                                                    ? formatCount((item.price && item.price.amount) / (10 ** (ibcToken.network && ibcToken.network.decimals)), true)
                                                    : (item.price && item.price.amount) / (10 ** (ibcToken.network && ibcToken.network.decimals))}
                                                {' ' + ((ibcToken && ibcToken.network && ibcToken.network.display_denom) || item.price.denom)}
                                            </span>
                                            : <span className="lsr_value">
                                                {((item.price && item.price.amount) / (10 ** config.COIN_DECIMALS)) > 100
                                                    ? formatCount((item.price && item.price.amount) / (10 ** config.COIN_DECIMALS), true)
                                                    : (item.price && item.price.amount) / (10 ** config.COIN_DECIMALS)}
                                                {' ' + ((tokenType && tokenType.label) || (item.price.denom))}</span>
                                        : <span>{variables[props.lang]['not_listed']}</span>}
                                </div>
                            </div>
                        </div>
                    );
                }) : null}
        </>
    );
};

List.propTypes = {
    address: PropTypes.string.isRequired,
    collectionInProgress: PropTypes.bool.isRequired,
    collectionList: PropTypes.object.isRequired,
    filterShow: PropTypes.bool.isRequired,
    hideActiveCard: PropTypes.func.isRequired,
    hideFilters: PropTypes.func.isRequired,
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
    }).isRequired,
    ibcTokensList: PropTypes.array.isRequired,
    ibcTokensListInProgress: PropTypes.bool.isRequired,
    lang: PropTypes.string.isRequired,
    listData: PropTypes.array.isRequired,
    show: PropTypes.func.isRequired,
    showActive: PropTypes.bool.isRequired,
    showMenuPopover: PropTypes.func.isRequired,
    activeValue: PropTypes.string,
};

const stateToProps = (state) => {
    return {
        address: state.account.wallet.connection.address,
        lang: state.language,
        filterShow: state.collection.filters.showCollectionFilter,
        showActive: state.explore.activeCard.open,
        activeValue: state.explore.activeCard.activeNFTID,
        ibcTokensList: state.marketplace.ibcTokensList.value,
        ibcTokensListInProgress: state.marketplace.ibcTokensList.inProgress,
        collectionList: state.marketplace.collection.result,
        collectionInProgress: state.marketplace.collection.inProgress,
    };
};

const actionToProps = {
    hideActiveCard,
    hideFilters: hideCollectionFilters,
    show: showActiveCard,
    showMenuPopover,
};

export default withRouter(connect(stateToProps, actionToProps)(List));
