import React from 'react';
import { config } from '../../../config';
import moment from 'moment';
import ClassNames from 'classnames';
import { getAssetType, getAssetTypeExtension } from '../../../utils/strings';
import { Tooltip } from '@mui/material';
import variables from '../../../utils/variables';
import arrowIcon from '../../../assets/explore/transferability.svg';
import { ReactComponent as AuctionIcon } from '../../../assets/auction/live.svg';
import LiveInCounter from './LiveInCounter';
import VideoOnLoad from '../../../components/ImageOnLoad/VideoOnLoad';
import ImageOnLoad from '../../../components/ImageOnLoad/BackgroundImage';
import { ReactComponent as CopyRight } from '../../../assets/copy-right.svg';
import genesisCreatorIcon from '../../../assets/diamond.svg';
import NetworkImages from '../../../components/NetworkImages';
import EndsInCounter from './EndsInCounter';
import * as PropTypes from 'prop-types';
import { hideActiveCard, showActiveCard } from '../../../actions/explore';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import './index.css';
import { mathCeilDecimals } from '../../../utils/numbers';
import { hideFilters } from '../../../actions/filters';
import { formatCount } from '../../../utils/price';

const Card = (props) => {
    const {
        item,
        index,
    } = props;

    const handleShow = (value, event) => {
        const marketPlace = document.getElementById('market-place-scroll');
        let card = event.target;
        if (!event.target.classList.contains('list_page')) {
            card = event.target.closest('.list_page');
        }
        if (!props.showActive) {
            card && card.scrollIntoView();
        } else {
            if (marketPlace) {
                marketPlace.scrollTo({
                    top: (card && card.offsetTop) - 140,
                    behavior: 'smooth',
                });
            } else {
                window.scrollTo({
                    top: (card && card.offsetTop) + 330,
                    behavior: 'smooth',
                });
            }
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

    let nftDetails = {};
    if (item.auction) {
        nftDetails = { ...item };
    } else {
        nftDetails = {
            auction: item,
            ...(item && item.nft_id),
        };
    }

    const bgImage = nftDetails && nftDetails.preview_uri;
    const collectionDetails = item && item.denom_id;
    const ibcToken = nftDetails && nftDetails.auction && nftDetails.auction.price && nftDetails.auction.price.denom &&
        props.ibcTokensList && props.ibcTokensList.length &&
        props.ibcTokensList.find((val) => val && val.ibc_denom_hash && (val.ibc_denom_hash === nftDetails.auction.price.denom));
    const displayDenom = ibcToken && ibcToken.network && ibcToken.network.display_denom
        ? ibcToken.network.display_denom : config.COIN_DENOM;
    const decimals = ibcToken && ibcToken.network && ibcToken.network.decimals
        ? ibcToken.network.decimals
        : config.COIN_DECIMALS;
    let amount = nftDetails && nftDetails.auction && nftDetails.auction.price && nftDetails.auction.price.amount;
    amount = amount / (10 ** decimals);
    amount = mathCeilDecimals(amount, 2);

    const nftObj = (nftDetails && typeof (nftDetails) === 'object') ? nftDetails : {};
    nftObj.list = item;
    nftObj.denom_id = (collectionDetails && typeof (collectionDetails) === 'object') ? collectionDetails : {};

    const mediaType = nftDetails && nftDetails.media_type;
    const liveAuction = nftDetails && nftDetails.auction && nftDetails.auction.start_time &&
        moment().diff(nftDetails.auction.start_time) > 0;

    if ((amount / (10 ** decimals)) > 100) {
        amount = formatCount(amount / (10 ** decimals), true);
    }

    return (
        <div
            key={index}
            className={ClassNames('list_page auctions_list', (props.activeValue) === (nftDetails && nftDetails.id) ? 'active' : '')}
            onClick={(e) => handleShow({
                nftDetails,
            }, e)}
            onMouseOut={handleMouseOut}
            onMouseOver={handleMouseOver}>
            <div className="list_section1">
                <div className="list_section1_left">
                    {mediaType &&
                        <div className="asset_type">
                            {mediaType && getAssetType(mediaType)}
                        </div>}
                    {nftDetails && nftDetails.transferable &&
                        <Tooltip title={variables[props.lang].transferability}>
                            <div><img alt="icon" src={arrowIcon}/></div>
                        </Tooltip>}
                </div>
                <div className="list_section1_right" onClick={(event) => event.stopPropagation()}>
                    {liveAuction && nftDetails && nftDetails.auction && nftDetails.auction.end_time &&
                    moment().diff(nftDetails.auction.end_time) < 0
                        ? <EndsInCounter auction={nftDetails && nftDetails.auction}/>
                        : liveAuction
                            ? <div>
                                <AuctionIcon/>
                                {variables[props.lang].live}
                            </div>
                            : <LiveInCounter auction={nftDetails && nftDetails.auction}/>}
                </div>
            </div>
            {mediaType &&
            getAssetType(mediaType) === 'video'
                ? <div
                    className={ClassNames('list_section2 inline_video_section', item.nft_id && item.nft_id.nsfw ? 'blur' : '')}>
                    <VideoOnLoad
                        preview={bgImage}
                        src={item.nft_id && item.nft_id.media_uri}
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
                <div className="list_section4_right">
                    <span>{variables[props.lang].creator}</span>
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
                <div className="list_section4_left">
                    {liveAuction && nftDetails && nftDetails.auction && nftDetails.auction.last_bid
                        ? <span>{variables[props.lang].last_bid_price}</span>
                        : <span>{variables[props.lang].min_bid}</span>}
                    <div className="lsr_value">
                        <NetworkImages
                            name={displayDenom}/>
                        {amount}
                        {' ' + (displayDenom)}
                    </div>
                </div>
            </div>
        </div>
    );
};

Card.propTypes = {
    filterShow: PropTypes.bool.isRequired,
    hideActiveCard: PropTypes.func.isRequired,
    hideFilters: PropTypes.func.isRequired,
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
    }).isRequired,
    ibcTokensList: PropTypes.array.isRequired,
    ibcTokensListInProgress: PropTypes.bool.isRequired,
    index: PropTypes.number.isRequired,
    item: PropTypes.object.isRequired,
    lang: PropTypes.string.isRequired,
    show: PropTypes.func.isRequired,
    showActive: PropTypes.bool.isRequired,
    activeValue: PropTypes.string,
};

const stateToProps = (state) => {
    return {
        activeValue: state.explore.activeCard.activeNFTID,
        ibcTokensList: state.marketplace.ibcTokensList.value,
        ibcTokensListInProgress: state.marketplace.ibcTokensList.inProgress,
        lang: state.language,
        showActive: state.explore.activeCard.open,
    };
};

const actionToProps = {
    hideActiveCard,
    hideFilters,
    show: showActiveCard,
};

export default withRouter(connect(stateToProps, actionToProps)(Card));
